import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UploadService } from '../upload/upload.service';
import { DisputeType, DisputeStatus, DisputePriority, DisputeHandlerType, DisputeDecision, DisputeEvidenceType, NotificationType } from '@prisma/client';

export interface CreateDisputeDto {
  gameId: string;
  targetId?: string;
  disputeType: DisputeType;
  title: string;
  description: string;
  reason?: string;
  // 一步完成：直接包含证据
  evidenceText?: string;
  evidenceImages?: string[]; // 图片URL数组
}

export interface ResolveDisputeDto {
  decision: DisputeDecision;
  resolution: string;
  compensationAmount?: number;
  handlerType: DisputeHandlerType;
}

export interface AddDisputeEvidenceDto {
  type: DisputeEvidenceType;
  title?: string;
  description?: string;
  content: string;
}

@Injectable()
export class DisputesService {
  private readonly logger = new Logger(DisputesService.name);

  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    private uploadService: UploadService,
  ) {}

  // 创建争议
  async createDispute(userId: string, createDisputeDto: CreateDisputeDto) {
    const { gameId, targetId, disputeType, title, description, reason, evidenceText, evidenceImages } = createDisputeDto;

    // 验证游戏存在且用户是参与者
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      include: {
        participants: {
          select: { userId: true }
        }
      }
    });

    if (!game) {
      throw new NotFoundException('游戏不存在');
    }

    const isParticipant = game.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new ForbiddenException('只有游戏参与者才能发起争议');
    }

    // 检查是否在争议提交期限内（用户只能在48小时内提交争议）
    if (game.status === 'COMPLETED' || game.status === 'DISPUTED') {
      const now = new Date();

      // 调试日志
      this.logger.debug(`Checking dispute submission deadline for game ${gameId}`);
      this.logger.debug(`Game status: ${game.status}`);
      this.logger.debug(`Current time: ${now.toISOString()}`);
      this.logger.debug(`disputeSubmissionDeadline: ${game.disputeSubmissionDeadline?.toISOString() || 'NULL'}`);
      this.logger.debug(`arbitrationDeadline: ${game.arbitrationDeadline?.toISOString() || 'NULL'}`);

      // 使用 disputeSubmissionDeadline 字段检查用户提交争议的期限
      if (game.disputeSubmissionDeadline) {
        if (now > game.disputeSubmissionDeadline) {
          this.logger.warn(`Dispute submission deadline passed for game ${gameId}`);
          throw new BadRequestException('争议提交期限已过（游戏完成后48小时内），无法发起新的争议');
        }
        this.logger.debug(`Dispute submission is allowed (within 48-hour window)`);
      } else if (game.arbitrationDeadline) {
        // 兼容旧数据：如果没有 disputeSubmissionDeadline，使用 arbitrationDeadline - 72小时
        const disputeDeadline = new Date(game.arbitrationDeadline.getTime() - 72 * 60 * 60 * 1000);
        this.logger.debug(`Using fallback: arbitrationDeadline - 72 hours = ${disputeDeadline.toISOString()}`);
        if (new Date() > disputeDeadline) {
          throw new BadRequestException('争议提交期限已过，无法发起新的争议');
        }
      } else {
        // 如果都没有，使用 updatedAt + 48小时作为后备
        const completedTime = game.updatedAt;
        const disputeDeadline = new Date(completedTime.getTime() + 48 * 60 * 60 * 1000);
        this.logger.debug(`Using fallback: updatedAt + 48 hours = ${disputeDeadline.toISOString()}`);

        if (new Date() > disputeDeadline) {
          throw new BadRequestException('争议提交期限已过，无法发起争议');
        }
      }
    }

    // 检查用户对此游戏的争议次数（最多3次）
    const userDisputeCount = await this.prisma.dispute.count({
      where: {
        gameId,
        initiatorId: userId,
      }
    });

    if (userDisputeCount >= 3) {
      throw new BadRequestException('您对此游戏的争议次数已达上限（3次）');
    }

    // 检查是否已经存在未解决的相同争议
    const existingDispute = await this.prisma.dispute.findFirst({
      where: {
        gameId,
        initiatorId: userId,
        targetId,
        disputeType,
        status: {
          in: ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'WAITING_EVIDENCE']
        }
      }
    });

    if (existingDispute) {
      throw new BadRequestException('您已经对此问题发起过争议，请等待处理');
    }

    // 设置争议截止时间（创建后7天）
    const disputeDeadline = new Date();
    disputeDeadline.setDate(disputeDeadline.getDate() + 7);

    // 根据争议类型设置优先级
    let priority: DisputePriority = DisputePriority.NORMAL;
    if (disputeType === 'HARASSMENT') {
      priority = DisputePriority.HIGH;
    } else if (disputeType === 'TECHNICAL_ISSUE') {
      priority = DisputePriority.URGENT;
    }

    const dispute = await this.prisma.dispute.create({
      data: {
        gameId,
        initiatorId: userId,
        targetId,
        disputeType,
        title,
        description,
        reason,
        priority,
        disputeDeadline,
        status: DisputeStatus.PENDING,
      },
      include: {
        game: {
          select: { title: true, status: true }
        },
        initiator: {
          select: { username: true, fullName: true }
        },
        target: {
          select: { username: true, fullName: true }
        }
      }
    });

    // 更新游戏争议计数
    await this.prisma.betGame.update({
      where: { id: gameId },
      data: {
        disputeCount: { increment: 1 }
      }
    });

    // 如果游戏状态是COMPLETED，改为DISPUTED
    if (game.status === 'COMPLETED') {
      await this.prisma.betGame.update({
        where: { id: gameId },
        data: { status: 'DISPUTED' }
      });
    }

    // 创建初始证据（如果提供）
    if (evidenceText || (evidenceImages && evidenceImages.length > 0)) {
      // 添加文本证据
      if (evidenceText) {
        await this.prisma.disputeEvidence.create({
          data: {
            disputeId: dispute.id,
            uploaderId: userId,
            type: DisputeEvidenceType.TEXT,
            title: '争议说明',
            content: evidenceText,
          }
        });
      }

      // 添加图片证据
      if (evidenceImages && evidenceImages.length > 0) {
        // 处理每张图片：如果是 base64，上传到 Spaces
        const processedImages = await Promise.all(
          evidenceImages.map(async (imageData, index) => {
            let imageUrl = imageData;

            // 如果是 base64 数据，上传到 Spaces
            if (imageData.startsWith('data:image/')) {
              try {
                const timestamp = Date.now();
                const fileName = `${dispute.id}_${userId}_${index}_${timestamp}.jpg`;

                imageUrl = await this.uploadService.uploadBase64Image(
                  imageData,
                  'dispute-evidence',
                  fileName
                );

                this.logger.log(`Dispute evidence image ${index + 1} uploaded to Spaces: ${imageUrl}`);
              } catch (error) {
                this.logger.error(`Failed to upload dispute evidence image ${index + 1}: ${error.message}`);
                throw new BadRequestException(`图片 ${index + 1} 上传失败，请重试`);
              }
            }

            return {
              disputeId: dispute.id,
              uploaderId: userId,
              type: DisputeEvidenceType.IMAGE,
              title: `图片证据 ${index + 1}`,
              content: imageUrl,
            };
          })
        );

        // 批量创建证据记录
        await this.prisma.disputeEvidence.createMany({
          data: processedImages
        });
      }

      this.logger.log(`Created ${evidenceImages?.length || 0} image evidence and ${evidenceText ? 1 : 0} text evidence for dispute ${dispute.id}`);
    }

    // 通知所有游戏参与者（除了发起人）
    await this.notifyDisputeCreated(dispute, game);

    this.logger.log(`Dispute created: ${dispute.id} by user ${userId} for game ${gameId}`);

    return dispute;
  }

  // 通知争议创建
  private async notifyDisputeCreated(dispute: any, game: any) {
    try {
      const participantIds = game.participants
        .map((p: any) => p.userId)
        .filter((id: string) => id !== dispute.initiatorId);

      for (const participantId of participantIds) {
        await this.notificationsService.createNotification(
          participantId,
          NotificationType.SYSTEM,
          'notifications.messages.disputeCreated.title',
          'notifications.messages.disputeCreated.message',
          {
            disputeId: dispute.id,
            gameId: game.id,
            gameTitle: game.title,
            disputeTitle: dispute.title,
            disputeType: dispute.disputeType,
          }
        );
      }

      this.logger.log(`Sent dispute creation notifications for dispute ${dispute.id}`);
    } catch (error) {
      this.logger.error(`Failed to send dispute creation notifications: ${error.message}`);
    }
  }

  // 获取争议列表
  async getDisputes(userId: string, filters?: {
    status?: DisputeStatus;
    gameId?: string;
    type?: 'initiated' | 'targeted' | 'all';
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.gameId) {
      where.gameId = filters.gameId;
    }

    if (filters?.type === 'initiated') {
      where.initiatorId = userId;
    } else if (filters?.type === 'targeted') {
      where.targetId = userId;
    } else {
      where.OR = [
        { initiatorId: userId },
        { targetId: userId }
      ];
    }

    return this.prisma.dispute.findMany({
      where,
      include: {
        game: {
          select: { id: true, title: true, status: true }
        },
        initiator: {
          select: { id: true, username: true, fullName: true }
        },
        target: {
          select: { id: true, username: true, fullName: true }
        },
        handler: {
          select: { id: true, username: true }
        },
        evidence: {
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            content: true,
            isVerified: true,
            createdAt: true,
            uploader: {
              select: { username: true }
            }
          }
        },
        _count: {
          select: { evidence: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  // 获取争议详情
  async getDisputeById(disputeId: string, userId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
            creator: {
              select: { username: true }
            }
          }
        },
        initiator: {
          select: { id: true, username: true, fullName: true }
        },
        target: {
          select: { id: true, username: true, fullName: true }
        },
        handler: {
          select: { id: true, username: true }
        },
        evidence: {
          include: {
            uploader: {
              select: { username: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!dispute) {
      throw new NotFoundException('争议不存在');
    }

    // 检查用户是否有权限查看此争议
    const hasPermission = dispute.initiatorId === userId || 
                         dispute.targetId === userId ||
                         dispute.handlerId === userId;

    if (!hasPermission) {
      throw new ForbiddenException('无权限查看此争议');
    }

    return dispute;
  }

  // 添加争议证据
  async addDisputeEvidence(disputeId: string, userId: string, evidenceDto: AddDisputeEvidenceDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId }
    });

    if (!dispute) {
      throw new NotFoundException('争议不存在');
    }

    // 检查用户是否有权限添加证据
    const hasPermission = dispute.initiatorId === userId || dispute.targetId === userId;
    if (!hasPermission) {
      throw new ForbiddenException('无权限添加证据');
    }

    // 检查争议状态是否允许添加证据
    if (!['PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'WAITING_EVIDENCE'].includes(dispute.status)) {
      throw new BadRequestException('当前争议状态不允许添加证据');
    }

    // 检查用户是否已经提交过证据（限制只能提交一次）
    const existingEvidence = await this.prisma.disputeEvidence.findFirst({
      where: {
        disputeId,
        uploaderId: userId
      }
    });

    if (existingEvidence) {
      throw new BadRequestException('您已经提交过证据，不能重复提交');
    }

    // 处理图片上传到DigitalOcean Spaces
    let imageUrl = evidenceDto.content;

    if (evidenceDto.type === DisputeEvidenceType.IMAGE && evidenceDto.content.startsWith('data:image/')) {
      try {
        // 使用 uploadBase64Image 方法上传
        const timestamp = Date.now();
        const fileName = `${disputeId}_${userId}_${timestamp}.jpg`;

        // 上传到DigitalOcean Spaces
        imageUrl = await this.uploadService.uploadBase64Image(
          evidenceDto.content,
          'dispute-evidence',
          fileName
        );

        this.logger.log(`Dispute evidence image uploaded to Spaces: ${imageUrl}`);
      } catch (error) {
        this.logger.error(`Failed to upload dispute evidence image: ${error.message}`);
        throw new BadRequestException('图片上传失败，请重试');
      }
    }

    const evidence = await this.prisma.disputeEvidence.create({
      data: {
        disputeId,
        uploaderId: userId,
        type: evidenceDto.type,
        title: evidenceDto.title,
        description: evidenceDto.description,
        content: imageUrl, // 存储图片URL而不是base64
      },
      include: {
        uploader: {
          select: { username: true }
        }
      }
    });

    // 如果争议状态是WAITING_EVIDENCE，改为UNDER_REVIEW
    if (dispute.status === 'WAITING_EVIDENCE') {
      await this.prisma.dispute.update({
        where: { id: disputeId },
        data: { status: DisputeStatus.UNDER_REVIEW }
      });
    }

    // 奖励劳动积分
    await this.pointsService.updateLaborPoints(userId, 'evidence', dispute.gameId);

    this.logger.log(`Evidence added to dispute ${disputeId} by user ${userId}`);

    return evidence;
  }

  // 管理员解决争议
  async resolveDispute(disputeId: string, handlerId: string, resolveDto: ResolveDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        game: true,
        initiator: true,
        target: true
      }
    });

    if (!dispute) {
      throw new NotFoundException('争议不存在');
    }

    if (dispute.status === 'RESOLVED') {
      throw new BadRequestException('争议已经解决');
    }

    const { decision, resolution, compensationAmount, handlerType } = resolveDto;

    // 更新争议状态
    const resolvedDispute = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: DisputeStatus.RESOLVED,
        handlerId,
        handlerType,
        decision,
        resolution,
        compensationAmount,
        handledAt: new Date(),
        resolvedAt: new Date(),
      },
      include: {
        game: true,
        initiator: true,
        target: true,
        handler: {
          select: { username: true }
        }
      }
    });

    // 根据决定执行相应的积分调整
    await this.executeDisputeDecision(dispute, decision, compensationAmount);

    // 检查游戏是否还有其他未解决的争议
    const remainingDisputes = await this.prisma.dispute.count({
      where: {
        gameId: dispute.gameId,
        status: {
          in: ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'WAITING_EVIDENCE']
        }
      }
    });

    // 如果没有其他争议，将游戏状态改回COMPLETED
    if (remainingDisputes === 0 && dispute.game.status === 'DISPUTED') {
      await this.prisma.betGame.update({
        where: { id: dispute.gameId },
        data: { status: 'COMPLETED' }
      });
    }

    // 奖励处理争议的管理员劳动积分
    await this.pointsService.updateLaborPoints(handlerId, 'arbitrate', dispute.gameId);

    // 发送通知给争议发起人
    await this.notifyDisputeResolved(resolvedDispute);

    this.logger.log(`Dispute ${disputeId} resolved by ${handlerId} with decision: ${decision}`);

    return resolvedDispute;
  }

  // 发送争议解决通知（给所有参与者）
  private async notifyDisputeResolved(dispute: any) {
    try {
      // Decision labels are now translation keys
      const decisionKeys = {
        'APPROVE_INITIATOR': 'disputes.decisions.approveInitiator',
        'APPROVE_TARGET': 'disputes.decisions.approveTarget',
        'PARTIAL_APPROVAL': 'disputes.decisions.partialApproval',
        'NO_ACTION_NEEDED': 'disputes.decisions.noActionNeeded',
        'INSUFFICIENT_EVIDENCE': 'disputes.decisions.insufficientEvidence',
        'INVALID_DISPUTE': 'disputes.decisions.invalidDispute'
      };

      const decisionKey = decisionKeys[dispute.decision] || dispute.decision;

      // 获取游戏所有参与者
      const game = await this.prisma.betGame.findUnique({
        where: { id: dispute.gameId },
        include: {
          participants: {
            select: { userId: true }
          }
        }
      });

      if (!game) {
        this.logger.warn(`Game ${dispute.gameId} not found for dispute notification`);
        return;
      }

      // 获取发起人信息
      const initiator = await this.prisma.user.findUnique({
        where: { id: dispute.initiatorId },
        select: { username: true }
      });

      // 给所有参与者发送通知
      const participantIds = game.participants.map(p => p.userId);

      for (const participantId of participantIds) {
        const isInitiator = participantId === dispute.initiatorId;
        const isTarget = participantId === dispute.targetId;

        let messageKey = '';
        let canRetry = false;
        let remainingAttempts = 0;

        if (isInitiator) {
          // 发起人的通知
          if (dispute.decision === 'INVALID_DISPUTE') {
            // 检查是否还能再次发起
            const disputeCount = await this.prisma.dispute.count({
              where: {
                gameId: dispute.gameId,
                initiatorId: participantId,
              }
            });

            remainingAttempts = 3 - disputeCount;
            canRetry = remainingAttempts > 0;

            messageKey = canRetry
              ? 'notifications.messages.disputeRejectedCanRetry.message'
              : 'notifications.messages.disputeRejectedNoRetry.message';
          } else {
            messageKey = 'notifications.messages.disputeResolvedInitiator.message';
          }
        } else {
          // 其他参与者的通知
          messageKey = 'notifications.messages.disputeResolvedParticipant.message';
        }

        await this.notificationsService.createNotification(
          participantId,
          NotificationType.SYSTEM,
          'notifications.messages.disputeResolved.title',
          messageKey,
          {
            disputeId: dispute.id,
            gameId: dispute.gameId,
            gameTitle: dispute.game?.title,
            disputeTitle: dispute.title,
            decision: decisionKey,
            resolution: dispute.resolution,
            canRetry: isInitiator && canRetry,
            remainingAttempts: remainingAttempts.toString(),
            initiatorUsername: initiator?.username,
          }
        );
      }

      this.logger.log(`Sent dispute resolution notifications to ${participantIds.length} participants for dispute ${dispute.id}`);
    } catch (error) {
      this.logger.error(`Failed to send dispute resolution notifications: ${error.message}`);
      // 不抛出错误，避免影响主流程
    }
  }

  // 执行争议决定
  private async executeDisputeDecision(dispute: any, decision: DisputeDecision, compensationAmount?: number) {
    const penalizedUserIds: string[] = [];
    const pointsAdjustments: any = {};

    switch (decision) {
      case DisputeDecision.APPROVE_INITIATOR:
        // 支持发起人 - 双重奖励：劳动积分+10，信任积分+10
        await this.pointsService.updateLaborPoints(dispute.initiatorId, 'dispute_win', dispute.gameId);
        await this.pointsService.updateUserPoints(
          dispute.initiatorId,
          'TRUST',
          10,
          '仲裁胜诉奖励',
          dispute.gameId
        );

        pointsAdjustments[dispute.initiatorId] = {
          laborPoints: 10,
          trustPoints: 10,
          reason: '仲裁胜诉奖励'
        };

        // 惩罚被申请人：扣除游戏所得积分 + 信任积分
        if (dispute.targetId) {
          await this.penalizeUser(
            dispute.targetId,
            dispute.gameId,
            dispute.id,
            'DISPUTE_VIOLATION',
            dispute.resolution || '仲裁违规',
            dispute.initiatorId
          );
          penalizedUserIds.push(dispute.targetId);
        }
        break;

      case DisputeDecision.APPROVE_TARGET:
        // 支持被申请人 - 无奖励，只是维持原状
        // 不做任何操作
        break;

      case DisputeDecision.PARTIAL_APPROVAL:
        // 部分支持，给予补偿积分
        if (compensationAmount && compensationAmount > 0) {
          await this.pointsService.updateUserPoints(
            dispute.initiatorId,
            'PARTICIPATION',
            compensationAmount,
            '争议部分支持补偿',
            dispute.gameId
          );

          pointsAdjustments[dispute.initiatorId] = {
            participationPoints: compensationAmount,
            reason: '部分支持补偿'
          };
        }
        break;

      case DisputeDecision.INVALID_DISPUTE:
        // 恶意仲裁 - 扣除发起人2分信任积分（不扣游戏积分）
        await this.penalizeUser(
          dispute.initiatorId,
          dispute.gameId,
          dispute.id,
          'MALICIOUS_DISPUTE',
          '恶意仲裁',
          dispute.initiatorId,
          true // 只扣信任积分
        );
        penalizedUserIds.push(dispute.initiatorId);
        break;

      case DisputeDecision.NO_ACTION_NEEDED:
      case DisputeDecision.INSUFFICIENT_EVIDENCE:
        // 无需处理或证据不足，不调整积分
        break;
    }

    // 更新争议记录中的惩罚信息
    if (penalizedUserIds.length > 0 || Object.keys(pointsAdjustments).length > 0) {
      await this.prisma.dispute.update({
        where: { id: dispute.id },
        data: {
          penalizedUserIds,
          pointsAdjustments
        }
      });
    }
  }

  // 惩罚用户
  private async penalizeUser(
    userId: string,
    gameId: string,
    disputeId: string,
    penaltyType: 'DISPUTE_VIOLATION' | 'MALICIOUS_DISPUTE',
    reason: string,
    executedBy: string,
    onlyTrustPoints: boolean = false
  ) {
    try {
      // 获取用户在该游戏中的参与记录
      const participant = await this.prisma.betParticipant.findUnique({
        where: {
          gameId_userId: {
            gameId,
            userId
          }
        }
      });

      if (!participant) {
        this.logger.warn(`用户 ${userId} 在游戏 ${gameId} 中没有参与记录`);
        return;
      }

      // 获取用户在该游戏中获得的积分
      const gamePoints = await this.prisma.pointsHistory.findMany({
        where: {
          userId,
          gameId,
          change: { gt: 0 } // 只查询正向积分
        }
      });

      const totalGamePoints = gamePoints.reduce((sum, p) => sum + p.change, 0);

      let trustPointsDeduction = 0;
      let gamePointsDeduction = 0;

      if (penaltyType === 'DISPUTE_VIOLATION') {
        // 仲裁违规：扣除游戏所得积分 + 信任积分
        trustPointsDeduction = -10; // 扣除10分信任积分
        gamePointsDeduction = onlyTrustPoints ? 0 : -totalGamePoints; // 扣除所有游戏所得积分
      } else if (penaltyType === 'MALICIOUS_DISPUTE') {
        // 恶意仲裁：只扣除2分信任积分
        trustPointsDeduction = -2;
        gamePointsDeduction = 0;
      }

      // 扣除信任积分
      if (trustPointsDeduction < 0) {
        await this.pointsService.updateUserPoints(
          userId,
          'TRUST',
          trustPointsDeduction,
          reason,
          gameId
        );
      }

      // 扣除游戏积分（参与积分和劳动积分）
      if (gamePointsDeduction < 0) {
        // 扣除参与积分
        const participationPoints = gamePoints.filter(p => p.pointType === 'PARTICIPATION');
        const totalParticipation = participationPoints.reduce((sum, p) => sum + p.change, 0);
        if (totalParticipation > 0) {
          await this.pointsService.updateUserPoints(
            userId,
            'PARTICIPATION',
            -totalParticipation,
            `${reason} - 撤销参与积分`,
            gameId
          );
        }

        // 扣除劳动积分
        const laborPoints = gamePoints.filter(p => p.pointType === 'LABOR');
        const totalLabor = laborPoints.reduce((sum, p) => sum + p.change, 0);
        if (totalLabor > 0) {
          await this.pointsService.updateUserPoints(
            userId,
            'LABOR',
            -totalLabor,
            `${reason} - 撤销劳动积分`,
            gameId
          );
        }
      }

      // 更新参与者记录
      await this.prisma.betParticipant.update({
        where: {
          gameId_userId: {
            gameId,
            userId
          }
        },
        data: {
          penaltyPoints: trustPointsDeduction + gamePointsDeduction,
          penaltyReason: reason,
          penalizedAt: new Date()
        }
      });

      // 创建惩罚记录
      await this.prisma.penaltyRecord.create({
        data: {
          userId,
          gameId,
          disputeId,
          penaltyType,
          reason,
          trustPointsDeduction: Math.abs(trustPointsDeduction),
          gamePointsDeduction: Math.abs(gamePointsDeduction),
          executedBy
        }
      });

      this.logger.log(`用户 ${userId} 因 ${reason} 被惩罚：信任积分 ${trustPointsDeduction}，游戏积分 ${gamePointsDeduction}`);
    } catch (error) {
      this.logger.error(`惩罚用户 ${userId} 失败:`, error);
      throw error;
    }
  }

  // 获取管理员待处理争议列表
  async getAdminDisputes(filters?: {
    status?: DisputeStatus;
    priority?: DisputePriority;
    handlerId?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.handlerId) {
      where.handlerId = filters.handlerId;
    }

    return this.prisma.dispute.findMany({
      where,
      include: {
        game: {
          select: { id: true, title: true, status: true, category: true }
        },
        initiator: {
          select: { id: true, username: true, fullName: true }
        },
        target: {
          select: { id: true, username: true, fullName: true }
        },
        handler: {
          select: { id: true, username: true }
        },
        evidence: {
          include: {
            uploader: {
              select: { id: true, username: true }
            }
          }
        },
        _count: {
          select: { evidence: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ]
    });
  }

  // 分配争议给管理员
  async assignDispute(disputeId: string, handlerId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId }
    });

    if (!dispute) {
      throw new NotFoundException('争议不存在');
    }

    if (dispute.handlerId && dispute.handlerId !== handlerId) {
      throw new BadRequestException('争议已被其他管理员处理');
    }

    return this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        handlerId,
        status: DisputeStatus.UNDER_REVIEW,
      }
    });
  }

  // 取消争议
  async cancelDispute(disputeId: string, userId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId }
    });

    if (!dispute) {
      throw new NotFoundException('争议不存在');
    }

    if (dispute.initiatorId !== userId) {
      throw new ForbiddenException('只有争议发起人才能取消争议');
    }

    if (!['PENDING', 'UNDER_REVIEW'].includes(dispute.status)) {
      throw new BadRequestException('当前状态不允许取消争议');
    }

    return this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: DisputeStatus.CANCELLED,
        resolvedAt: new Date(),
      }
    });
  }
}
