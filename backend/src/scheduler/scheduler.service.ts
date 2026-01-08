import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { GameSettlementService } from '../games/game-settlement.service';
import { GameStatus } from '@prisma/client';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private gameSettlementService: GameSettlementService
  ) {}

  // 每分钟检查一次游戏状态
  @Cron(CronExpression.EVERY_MINUTE)
  async handleGameStatusUpdates() {
    this.logger.debug('Checking game status updates...');

    try {
      await this.startGames();
      await this.endGames();
      await this.startPeerReview();
      await this.completeGames();
      await this.archiveExpiredArbitrationGames(); // 归档仲裁期限已过的游戏
    } catch (error) {
      this.logger.error('Error updating game statuses:', error);
    }
  }

  // 每天凌晨2点执行游戏归档任务
  @Cron('0 2 * * *')
  async archiveGames() {
    this.logger.log('🗄️ 开始执行游戏归档任务...');

    try {
      const now = new Date();
      let archivedCount = 0;

      // 1. 归档仲裁期限已过的游戏（COMPLETED状态，仲裁期限已过）
      const completedGamesWithArbitrationExpired = await this.prisma.betGame.findMany({
        where: {
          status: GameStatus.COMPLETED,
          arbitrationDeadline: { lte: now }
        }
      });

      for (const game of completedGamesWithArbitrationExpired) {
        await this.prisma.betGame.update({
          where: { id: game.id },
          data: { status: GameStatus.CLOSED }
        });
        this.logger.log(`✅ 游戏 ${game.id} (${game.title}) 已归档（仲裁期限已过，无争议）`);
        archivedCount++;
      }

      // 2. 归档无争议游戏（互评结束后7天，没有设置仲裁期限的旧游戏）
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const completedGamesOld = await this.prisma.betGame.findMany({
        where: {
          status: GameStatus.COMPLETED,
          reviewDeadline: { lte: sevenDaysAgo },
          arbitrationDeadline: null // 只处理没有仲裁期限的旧游戏
        }
      });

      for (const game of completedGamesOld) {
        await this.prisma.betGame.update({
          where: { id: game.id },
          data: { status: GameStatus.CLOSED }
        });
        this.logger.log(`✅ 游戏 ${game.id} (${game.title}) 已归档（无争议，互评结束7天后）`);
        archivedCount++;
      }

      // 3. 归档有争议游戏（仲裁截止后）
      const disputedGames = await this.prisma.betGame.findMany({
        where: {
          status: GameStatus.DISPUTED,
          arbitrationDeadline: { lte: now }
        }
      });

      for (const game of disputedGames) {
        await this.prisma.betGame.update({
          where: { id: game.id },
          data: { status: GameStatus.CLOSED }
        });
        this.logger.log(`✅ 游戏 ${game.id} (${game.title}) 已归档（争议处理完成）`);
        archivedCount++;
      }

      this.logger.log(`🗄️ 归档任务完成：共归档 ${archivedCount} 个游戏`);
    } catch (error) {
      this.logger.error('❌ 游戏归档任务失败:', error);
    }
  }

  // 开始游戏 (OPEN -> IN_PROGRESS)
  private async startGames() {
    const now = new Date();

    const gamesToStart = await this.prisma.betGame.findMany({
      where: {
        status: GameStatus.OPEN,
        startDate: {
          lte: now,
        },
        OR: [
          {
            // 多人游戏：至少需要2个参与者
            AND: [
              { maxParticipants: { gt: 1 } },
              { currentParticipants: { gte: 2 } }
            ]
          },
          {
            // 单人游戏：只需要1个参与者（创建者）
            AND: [
              { maxParticipants: 1 },
              { currentParticipants: { gte: 1 } }
            ]
          }
        ]
      },
      include: {
        participants: true,
      },
    });

    for (const game of gamesToStart) {
      await this.prisma.betGame.update({
        where: { id: game.id },
        data: { status: GameStatus.IN_PROGRESS },
      });

      // 发送游戏开始通知
      const participantIds = game.participants.map(p => p.userId);
      await this.notificationsService.notifyGameStartedBulk(
        participantIds,
        game.title,
        game.id
      );

      const isSinglePlayer = game.maxParticipants === 1;
      this.logger.log(`Game ${game.id} started with ${game.participants.length} participants${isSinglePlayer ? ' (single-player mode)' : ''}`);
    }
  }

  // 结束游戏，进入证据提交阶段 (IN_PROGRESS -> EVIDENCE_SUBMISSION)
  private async endGames() {
    const now = new Date();

    const gamesToEnd = await this.prisma.betGame.findMany({
      where: {
        status: GameStatus.IN_PROGRESS,
        endDate: {
          lte: now,
        },
      },
      include: {
        participants: true,
      },
    });

    for (const game of gamesToEnd) {
      await this.prisma.betGame.update({
        where: { id: game.id },
        data: { status: GameStatus.EVIDENCE_SUBMISSION },
      });

      // 发送证据提交通知
      const participantIds = game.participants.map(p => p.userId);
      await this.notificationsService.notifyEvidenceRequiredBulk(
        participantIds,
        game.title,
        game.id,
        game.evidenceDeadline
      );

      this.logger.log(`Game ${game.id} ended, evidence submission phase started (deadline: ${game.evidenceDeadline})`);
    }
  }



  // 开始互评阶段 (EVIDENCE_SUBMISSION -> PEER_REVIEW)
  private async startPeerReview() {
    const now = new Date();

    const gamesToReview = await this.prisma.betGame.findMany({
      where: {
        status: GameStatus.EVIDENCE_SUBMISSION,
        evidenceDeadline: {
          lte: now,
        },
      },
      include: {
        participants: true,
      },
    });

    for (const game of gamesToReview) {
      // 检查是否所有参与者都提交了证据，或者时间已到
      const submittedCount = game.participants.filter(p => p.evidenceSubmitted).length;
      const totalParticipants = game.participants.length;

      // 如果所有人都提交了证据，或者证据提交截止时间已过
      if (submittedCount === totalParticipants || now > game.evidenceDeadline) {
        await this.prisma.betGame.update({
          where: { id: game.id },
          data: {
            status: GameStatus.PEER_REVIEW,
            // 设置互评截止时间为证据截止时间后48小时
            updatedAt: now,
          },
        });

        // 发送互评开始通知
        const participantIds = game.participants.map(p => p.userId);
        const isSinglePlayer = game.participants.length === 1;
        await this.notificationsService.createBulkNotifications(
          participantIds.map(userId => ({
            userId,
            type: 'PEER_EVALUATION_STARTED' as any,  // 使用正确的枚举值
            title: isSinglePlayer ? '自我评价阶段开始' : '互评阶段开始',
            message: `"${game.title}" 进入${isSinglePlayer ? '自我评价' : '互评'}阶段，请对${isSinglePlayer ? '自己' : '其他参与者'}的证据进行评价。`,
            data: { gameId: game.id }
          }))
        );

        this.logger.log(`Game ${game.id} moved to peer review (${submittedCount}/${totalParticipants} submitted evidence)`);
      }
    }
  }

  // 完成游戏 (PEER_REVIEW -> COMPLETED)
  private async completeGames() {
    const now = new Date();

    // 查找互评截止时间已过的游戏
    const gamesToComplete = await this.prisma.betGame.findMany({
      where: {
        status: GameStatus.PEER_REVIEW,
        reviewDeadline: {
          lte: now,
        },
      },
      include: {
        participants: true,
      },
    });

    for (const game of gamesToComplete) {
      try {
        // 使用专门的结算服务
        await this.gameSettlementService.settleGame(game.id);
        this.logger.log(`Game ${game.id} auto-completed and settled`);
      } catch (error) {
        this.logger.error(`Failed to settle game ${game.id}:`, error);

        // 即使结算失败，也要进入COMPLETED状态并设置仲裁期限
        // 这样用户可以发起争议，由管理员人工处理
        const now = new Date();
        const arbitrationDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);

        await this.prisma.betGame.update({
          where: { id: game.id },
          data: {
            status: GameStatus.COMPLETED,
            result: 'SETTLEMENT_FAILED',
            arbitrationDeadline,
          },
        });

        this.logger.warn(`Game ${game.id} settlement failed, moved to COMPLETED with arbitration window`);
      }
    }
  }

  // 归档仲裁期限已过的游戏（每分钟检查）
  private async archiveExpiredArbitrationGames() {
    const now = new Date();

    // 查找仲裁期限已过的COMPLETED状态游戏
    const expiredGames = await this.prisma.betGame.findMany({
      where: {
        status: GameStatus.COMPLETED,
        arbitrationDeadline: {
          lte: now,
        },
      },
    });

    for (const game of expiredGames) {
      await this.prisma.betGame.update({
        where: { id: game.id },
        data: { status: GameStatus.CLOSED },
      });

      this.logger.log(`Game ${game.id} (${game.title}) archived - arbitration period expired`);
    }
  }

  // 手动触发状态更新（用于测试）
  async triggerStatusUpdate() {
    this.logger.log('Manually triggering status update...');
    await this.handleGameStatusUpdates();
  }
}
