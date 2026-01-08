import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { GameStatus, ParticipantResult, EvaluationResult, NotificationType } from '@prisma/client';
import { AntiFraudService } from './anti-fraud.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface SettlementResult {
  userId: string;
  username: string;
  evidenceSubmitted: boolean;
  selfReportedSuccess: boolean;
  recognizeRate: number;
  recognizeCount: number;
  totalEvaluations: number;
  finalResult: ParticipantResult;
  pointsEarned: number;
  trustPointsChange: number;
  achievements: string[];
}

export interface GameSettlement {
  gameId: string;
  gameTitle: string;
  totalParticipants: number;
  successfulParticipants: number;
  settlementResults: SettlementResult[];
  completedAt: Date;
}

@Injectable()
export class GameSettlementService {
  private readonly logger = new Logger(GameSettlementService.name);

  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
    private antiFraudService: AntiFraudService,
    private notificationsService: NotificationsService,
  ) {}

  // 执行游戏结算
  async settleGame(gameId: string): Promise<GameSettlement> {
    this.logger.log(`开始结算游戏: ${gameId}`);

    try {
      // 获取游戏信息
      const game = await this.prisma.betGame.findUnique({
        where: { id: gameId },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  participationPoints: true,
                  trustPoints: true,
                }
              }
            }
          }
        }
      });

      if (!game) {
        throw new Error(`游戏不存在: ${gameId}`);
      }

      if (game.status === GameStatus.COMPLETED) {
        throw new Error(`游戏已经结算完成: ${gameId}`);
      }

      // 获取所有互评结果
      const evaluations = await this.prisma.peerEvaluation.findMany({
        where: { gameId },
      });

      // 防刷检测
      const fraudDetection = await this.antiFraudService.detectEvaluationFraud(gameId);
      this.logger.log(`游戏 ${gameId} 防刷检测结果: ${fraudDetection.riskLevel}`);

      // 如果检测到高风险作弊行为，进入COMPLETED状态但标记为需要审核
      if (fraudDetection.riskLevel === 'CRITICAL') {
        this.logger.warn(`游戏 ${gameId} 检测到严重作弊行为，进入仲裁窗口期`);

        const now = new Date();
        // 用户提交争议截止时间：48小时
        const disputeSubmissionDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        // 管理员仲裁截止时间：争议提交截止后72小时（总共120小时）
        const arbitrationDeadline = new Date(now.getTime() + 120 * 60 * 60 * 1000);

        // 更新游戏状态为COMPLETED，允许用户发起争议
        await this.prisma.betGame.update({
          where: { id: gameId },
          data: {
            status: GameStatus.COMPLETED,
            result: 'UNDER_REVIEW', // 标记为审核中
            disputeSubmissionDeadline,
            arbitrationDeadline,
          },
        });

        // 通知参与者
        const participantIds = game.participants.map(p => p.userId);
        await this.notificationsService.createBulkNotifications(
          participantIds.map(userId => ({
            userId,
            type: NotificationType.GAME_UNDER_REVIEW,
            title: '游戏结果审核中',
            message: `"${game.title}" 检测到异常，已进入仲裁窗口期。如有异议请发起争议。`,
            data: { gameId, reason: 'fraud_detection' }
          }))
        );

        throw new Error(`游戏 ${gameId} 检测到作弊行为，已进入仲裁窗口期`);
      }

      // 计算每个参与者的结算结果
      const settlementResults: SettlementResult[] = [];

      for (const participant of game.participants) {
        const result = await this.calculateParticipantResult(
          participant,
          evaluations,
          game
        );
        settlementResults.push(result);
      }

      // 更新参与者结果
      await this.updateParticipantResults(gameId, settlementResults);

      // 更新游戏状态
      const successfulCount = settlementResults.filter(r => r.finalResult === ParticipantResult.SUCCESS).length;
      const now = new Date();
      // 用户提交争议截止时间：48小时
      const disputeSubmissionDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      // 管理员仲裁截止时间：争议提交截止后72小时（总共120小时）
      const arbitrationDeadline = new Date(now.getTime() + 120 * 60 * 60 * 1000);

      await this.prisma.betGame.update({
        where: { id: gameId },
        data: {
          status: GameStatus.COMPLETED,
          result: 'COMPLETED',
          disputeSubmissionDeadline, // 用户提交争议截止时间
          arbitrationDeadline, // 管理员仲裁截止时间
          winnerIds: settlementResults
            .filter(r => r.finalResult === ParticipantResult.SUCCESS)
            .map(r => r.userId),
        },
      });

      // 更新用户积分和统计
      await this.updateUserPointsAndStats(settlementResults, gameId);

      const settlement: GameSettlement = {
        gameId,
        gameTitle: game.title,
        totalParticipants: game.participants.length,
        successfulParticipants: successfulCount,
        settlementResults,
        completedAt: new Date(),
      };

      this.logger.log(`游戏结算完成: ${gameId}, 成功参与者: ${successfulCount}/${game.participants.length}`);
      return settlement;

    } catch (error) {
      this.logger.error(`游戏结算失败: ${gameId}`, error);
      throw error;
    }
  }

  // 计算单个参与者的结算结果（优化版）
  private async calculateParticipantResult(
    participant: any,
    evaluations: any[],
    game: any
  ): Promise<SettlementResult> {
    const userId = participant.userId;
    const user = participant.user;

    // 获取针对该参与者的评价
    const receivedEvaluations = evaluations.filter(e => e.evaluatedId === userId);

    // 计算加权认可度（考虑评价者的信任度）
    const weightedRecognizeRate = this.calculateWeightedRecognizeRate(receivedEvaluations, evaluations);
    const recognizeCount = receivedEvaluations.filter(e => e.evaluation === EvaluationResult.RECOGNIZE).length;
    const totalEvaluations = receivedEvaluations.length;
    const simpleRecognizeRate = totalEvaluations > 0 ? recognizeCount / totalEvaluations : 0;

    // 评估证据质量
    const evidenceQuality = this.evaluateEvidenceQuality(participant, game);

    // 判定最终结果（使用更智能的算法）
    const finalResult = this.determineFinalResult(
      participant,
      weightedRecognizeRate,
      simpleRecognizeRate,
      totalEvaluations,
      evidenceQuality,
      game
    );

    // 计算积分奖励（基于多个因素）
    const pointsEarned = this.calculatePointsReward(finalResult, weightedRecognizeRate, participant, evidenceQuality);
    const trustPointsChange = this.calculateTrustPointsChange(finalResult, weightedRecognizeRate, evidenceQuality);

    // 检查成就
    const achievements = await this.checkAchievements(userId, finalResult, weightedRecognizeRate, game);

    return {
      userId,
      username: user.username,
      evidenceSubmitted: participant.evidenceSubmitted,
      selfReportedSuccess: participant.selfReportedSuccess,
      recognizeRate: weightedRecognizeRate,
      recognizeCount,
      totalEvaluations,
      finalResult,
      pointsEarned,
      trustPointsChange,
      achievements,
    };
  }

  // 计算加权认可度（考虑评价者的信任度和评价质量）
  private calculateWeightedRecognizeRate(receivedEvaluations: any[], allEvaluations: any[]): number {
    if (receivedEvaluations.length === 0) return 0;

    let totalWeight = 0;
    let weightedScore = 0;

    for (const evaluation of receivedEvaluations) {
      // 基础权重
      let weight = 1.0;

      // 评价者信任度权重
      const evaluatorTrustPoints = evaluation.evaluator?.trustPoints || 100;
      const trustWeight = Math.max(0.5, Math.min(1.5, evaluatorTrustPoints / 100));
      weight *= trustWeight;

      // 评价质量权重（基于评价理由的长度和质量）
      const reasoningQuality = this.evaluateReasoningQuality(evaluation.reasoning);
      weight *= reasoningQuality;

      // 评价者的评价一致性权重（避免随意评价）
      const consistencyWeight = this.calculateEvaluatorConsistency(evaluation.evaluatorId, allEvaluations);
      weight *= consistencyWeight;

      // 计算加权分数
      const score = evaluation.evaluation === EvaluationResult.RECOGNIZE ? 1 : 0;
      weightedScore += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  // 评估评价理由的质量
  private evaluateReasoningQuality(reasoning: string): number {
    if (!reasoning || reasoning.length < 5) return 0.5; // 没有理由或理由过短

    let quality = 1.0;

    // 长度评分
    if (reasoning.length > 100) quality += 0.3;
    else if (reasoning.length > 50) quality += 0.2;
    else if (reasoning.length > 20) quality += 0.1;

    // 检查是否包含具体描述
    const specificWords = ['具体', '详细', '清楚', '明确', '证据', '照片', '视频', '时间', '地点'];
    const specificCount = specificWords.filter(word => reasoning.includes(word)).length;
    quality += specificCount * 0.1;

    // 检查是否是敷衍回复
    const genericPhrases = ['好的', '不错', '可以', '还行', '一般', '没问题'];
    const isGeneric = genericPhrases.some(phrase => reasoning.includes(phrase) && reasoning.length < 15);
    if (isGeneric) quality *= 0.5;

    return Math.max(0.3, Math.min(1.5, quality));
  }

  // 计算评价者的一致性（避免随意评价）
  private calculateEvaluatorConsistency(evaluatorId: string, allEvaluations: any[]): number {
    const evaluatorEvaluations = allEvaluations.filter(e => e.evaluatorId === evaluatorId);

    if (evaluatorEvaluations.length < 2) return 1.0; // 评价数量太少，无法判断一致性

    const recognizeCount = evaluatorEvaluations.filter(e => e.evaluation === EvaluationResult.RECOGNIZE).length;
    const recognizeRate = recognizeCount / evaluatorEvaluations.length;

    // 如果总是认可或总是不认可，可能存在问题
    if (recognizeRate === 1.0 || recognizeRate === 0.0) {
      return 0.7; // 降低权重
    }

    // 正常的评价分布
    return 1.0;
  }

  // 智能判定最终结果
  private determineFinalResult(
    participant: any,
    weightedRecognizeRate: number,
    simpleRecognizeRate: number,
    totalEvaluations: number,
    evidenceQuality: string,
    game: any
  ): ParticipantResult {
    // 如果没有提交证据，直接判定为失败
    if (!participant.evidenceSubmitted) {
      return ParticipantResult.FAILURE;
    }

    // 如果没有收到任何评价
    if (totalEvaluations === 0) {
      // 基于证据质量和自我报告
      if (evidenceQuality === 'excellent' || evidenceQuality === 'high') {
        return participant.selfReportedSuccess ? ParticipantResult.SUCCESS : ParticipantResult.FAILURE;
      } else {
        return ParticipantResult.FAILURE; // 证据质量不足且无人评价
      }
    }

    // 评价数量很少时，提高判定标准
    if (totalEvaluations < 3) {
      const threshold = evidenceQuality === 'excellent' ? 0.4 : 0.6;
      return weightedRecognizeRate >= threshold ? ParticipantResult.SUCCESS : ParticipantResult.FAILURE;
    }

    // 正常情况下的判定
    let threshold = 0.5;

    // 根据证据质量调整阈值
    if (evidenceQuality === 'excellent') threshold -= 0.1;
    else if (evidenceQuality === 'high') threshold -= 0.05;
    else if (evidenceQuality === 'low') threshold += 0.1;

    // 根据游戏难度调整阈值
    if (game.category === 'HEALTH' || game.category === 'FITNESS') {
      threshold -= 0.05; // 健康类游戏稍微宽松
    }

    return weightedRecognizeRate >= threshold ? ParticipantResult.SUCCESS : ParticipantResult.FAILURE;
  }

  // 计算积分奖励（优化版）
  private calculatePointsReward(
    result: ParticipantResult,
    recognizeRate: number,
    participant: any,
    evidenceQuality: string
  ): number {
    let points = 0;

    // 基础参与奖励
    points += 5;

    // 证据提交奖励（根据质量调整）
    if (participant.evidenceSubmitted) {
      switch (evidenceQuality) {
        case 'excellent': points += 8; break;
        case 'high': points += 6; break;
        case 'medium': points += 4; break;
        case 'low': points += 2; break;
      }
    }

    // 成功完成奖励
    if (result === ParticipantResult.SUCCESS) {
      // 基础成功奖励
      points += 15;

      // 认可度奖励（更细致的分级）
      if (recognizeRate >= 0.9) {
        points += 10; // 完美履约
      } else if (recognizeRate >= 0.8) {
        points += 7; // 优秀履约
      } else if (recognizeRate >= 0.7) {
        points += 5; // 良好履约
      } else if (recognizeRate >= 0.6) {
        points += 3; // 及格履约
      }

      // 证据质量额外奖励
      if (evidenceQuality === 'excellent') {
        points += 5;
      } else if (evidenceQuality === 'high') {
        points += 3;
      }
    }

    // 互评参与奖励
    if (participant.peerEvaluationsGiven > 0) {
      points += Math.min(5, participant.peerEvaluationsGiven * 1); // 每个评价1分，最多5分
    }

    return points;
  }

  // 计算信任积分变化（优化版 - 轻松氛围）
  private calculateTrustPointsChange(
    result: ParticipantResult,
    recognizeRate: number,
    evidenceQuality: string
  ): number {
    let trustChange = 0;

    if (result === ParticipantResult.SUCCESS) {
      // 成功完成的信任积分奖励（加分更多）
      if (recognizeRate >= 0.9) {
        trustChange += 3; // 完美履约
      } else if (recognizeRate >= 0.8) {
        trustChange += 2; // 优秀履约
      } else if (recognizeRate >= 0.6) {
        trustChange += 2; // 良好履约（提高奖励）
      } else if (recognizeRate >= 0.5) {
        trustChange += 1; // 及格履约
      }

      // 证据质量对信任积分的影响
      if (evidenceQuality === 'excellent') {
        trustChange += 1;
      }
    } else {
      // 失败的信任积分惩罚（轻松模式：统一扣1分）
      trustChange -= 1; // 轻微惩罚，营造轻松氛围

      // 如果提交了证据但仍然失败，不扣分（鼓励参与）
      // 这里需要传入participant参数，暂时注释掉
      // if (participant.evidenceSubmitted && evidenceQuality !== 'low') {
      //   trustChange = 0; // 提交了证据就不扣分
      // }
    }

    return trustChange;
  }

  // 检查成就
  private async checkAchievements(
    userId: string,
    result: ParticipantResult,
    recognizeRate: number,
    game: any
  ): Promise<string[]> {
    const achievements: string[] = [];

    // 完美履约成就
    if (result === ParticipantResult.SUCCESS && recognizeRate >= 0.9) {
      achievements.push('完美履约');
    }

    // 首次完成成就
    const userGamesCount = await this.prisma.betParticipant.count({
      where: {
        userId,
        finalResult: ParticipantResult.SUCCESS,
      }
    });

    if (userGamesCount === 1 && result === ParticipantResult.SUCCESS) {
      achievements.push('初出茅庐');
    }

    // 连续成功成就
    if (result === ParticipantResult.SUCCESS) {
      const recentGames = await this.prisma.betParticipant.findMany({
        where: { userId },
        orderBy: { joinedAt: 'desc' },
        take: 5,
      });

      let consecutiveSuccesses = 0;
      for (const game of recentGames) {
        if (game.finalResult === ParticipantResult.SUCCESS) {
          consecutiveSuccesses++;
        } else {
          break;
        }
      }

      if (consecutiveSuccesses >= 5) {
        achievements.push('连胜达人');
      } else if (consecutiveSuccesses >= 3) {
        achievements.push('三连胜');
      }
    }

    return achievements;
  }

  // 更新参与者结果
  private async updateParticipantResults(gameId: string, results: SettlementResult[]) {
    for (const result of results) {
      await this.prisma.betParticipant.update({
        where: {
          gameId_userId: {
            gameId,
            userId: result.userId,
          },
        },
        data: {
          finalResult: result.finalResult,
          completionVerified: true,
        },
      });
    }
  }

  // 更新用户积分和统计（优化版）
  private async updateUserPointsAndStats(results: SettlementResult[], gameId: string) {
    for (const result of results) {
      // 获取参与者详细信息
      const participant = await this.prisma.betParticipant.findUnique({
        where: {
          gameId_userId: {
            gameId,
            userId: result.userId,
          },
        },
      });

      if (!participant) continue;

      // 评估证据质量
      const evidenceQuality = this.evaluateEvidenceQuality(participant);

      // 检查是否参与了互评
      const participatedInEvaluation = await this.prisma.peerEvaluation.count({
        where: {
          gameId,
          evaluatorId: result.userId,
        },
      }) > 0;

      // 使用新的综合积分奖励系统
      await this.pointsService.awardGameCompletionPoints(
        result.userId,
        gameId,
        {
          finalResult: result.finalResult === ParticipantResult.SUCCESS ? 'SUCCESS' : 'FAILURE',
          recognizeRate: result.recognizeRate,
          evidenceSubmitted: result.evidenceSubmitted,
          evidenceQuality,
          participatedInEvaluation,
        }
      );
    }
  }

  // 评估证据质量（优化版）
  private evaluateEvidenceQuality(participant: any, game?: any): 'low' | 'medium' | 'high' | 'excellent' {
    if (!participant.evidenceSubmitted) return 'low';

    let score = 0;
    const evidenceContent = participant.evidenceContent || '';
    const contentLength = evidenceContent.length;

    // 1. 证据类型评分（根据游戏要求的证据类型调整权重）
    const requiredType = game?.evidenceType || participant.evidenceType;
    if (participant.evidenceType === requiredType) {
      // 符合要求的证据类型
      if (participant.evidenceType === 'VIDEO') score += 5;
      else if (participant.evidenceType === 'PHOTO') score += 4;
      else if (participant.evidenceType === 'TEXT') score += 3;
      else score += 2;
    } else {
      // 不符合要求的证据类型，扣分
      score += 1;
    }

    // 2. 内容质量评分（更细致的评估）
    if (contentLength > 500) score += 3; // 详细描述
    else if (contentLength > 200) score += 2; // 中等描述
    else if (contentLength > 50) score += 1; // 简单描述
    // 内容过短不加分

    // 3. 内容相关性评分（检查关键词）
    if (game?.instructions) {
      const relevanceScore = this.calculateContentRelevance(evidenceContent, game.instructions);
      score += Math.floor(relevanceScore * 2); // 最多加2分
    }

    // 4. 提交时间评分（优化算法）
    if (participant.evidenceSubmittedAt && game) {
      const timeScore = this.calculateTimingScore(participant.evidenceSubmittedAt, game);
      score += timeScore;
    }

    // 5. 用户历史表现加权
    const userTrustPoints = participant.user?.trustPoints || 100;
    if (userTrustPoints > 120) score += 1; // 高信任用户加分
    else if (userTrustPoints < 80) score -= 1; // 低信任用户扣分

    // 6. 证据唯一性检查（避免重复提交）
    const uniquenessScore = this.checkEvidenceUniqueness(evidenceContent);
    score += uniquenessScore;

    // 转换为质量等级（调整阈值）
    if (score >= 10) return 'excellent';
    else if (score >= 7) return 'high';
    else if (score >= 4) return 'medium';
    else return 'low';
  }

  // 计算内容相关性
  private calculateContentRelevance(content: string, instructions: string): number {
    if (!content || !instructions) return 0;

    const contentWords = content.toLowerCase().split(/\s+/);
    const instructionWords = instructions.toLowerCase().split(/\s+/);

    // 提取关键词（去除常见停用词）
    const stopWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
    const keyWords = instructionWords.filter(word => word.length > 1 && !stopWords.includes(word));

    if (keyWords.length === 0) return 0;

    // 计算匹配度
    const matchCount = keyWords.filter(keyword =>
      contentWords.some(word => word.includes(keyword) || keyword.includes(word))
    ).length;

    return Math.min(1.0, matchCount / keyWords.length);
  }

  // 计算提交时间评分
  private calculateTimingScore(submittedAt: Date, game: any): number {
    const submitTime = new Date(submittedAt);
    const startTime = new Date(game.startDate);
    const deadline = new Date(game.evidenceDeadline);

    const totalTime = deadline.getTime() - startTime.getTime();
    const usedTime = submitTime.getTime() - startTime.getTime();
    const timeRatio = usedTime / totalTime;

    // 提交时间评分曲线：早期提交得分更高
    if (timeRatio < 0.3) return 3; // 前30%时间提交
    else if (timeRatio < 0.6) return 2; // 前60%时间提交
    else if (timeRatio < 0.9) return 1; // 前90%时间提交
    else return 0; // 最后10%时间提交
  }

  // 检查证据唯一性
  private checkEvidenceUniqueness(content: string): number {
    if (!content || content.length < 10) return -1; // 内容过短扣分

    // 检查是否是常见的敷衍内容
    const commonPhrases = ['完成了', '已完成', '做完了', '好的', '没问题', '完成'];
    const isGeneric = commonPhrases.some(phrase => content.includes(phrase) && content.length < 20);

    if (isGeneric) return -1; // 敷衍内容扣分

    // 检查内容的多样性（字符种类）
    const uniqueChars = new Set(content.toLowerCase()).size;
    const diversity = uniqueChars / content.length;

    if (diversity > 0.3) return 1; // 内容多样性高加分
    else if (diversity < 0.1) return -1; // 内容重复性高扣分
    else return 0;
  }

  // 获取游戏结算结果
  async getGameSettlement(gameId: string): Promise<GameSettlement | null> {
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
              }
            }
          }
        }
      }
    });

    if (!game || game.status !== GameStatus.COMPLETED) {
      return null;
    }

    // 获取所有互评数据
    const evaluations = await this.prisma.peerEvaluation.findMany({
      where: { gameId },
    });

    // 获取积分历史记录
    const pointsHistory = await this.prisma.pointsHistory.findMany({
      where: {
        gameId,
      }
    });

    // 计算每个参与者的详细数据
    const settlementResults: SettlementResult[] = game.participants.map(participant => {
      // 获取针对该参与者的评价
      const receivedEvaluations = evaluations.filter(e => e.evaluatedId === participant.userId);
      const recognizeCount = receivedEvaluations.filter(e => e.evaluation === EvaluationResult.RECOGNIZE).length;
      const totalEvaluations = receivedEvaluations.length;
      const recognizeRate = totalEvaluations > 0 ? recognizeCount / totalEvaluations : 0;

      // 获取该参与者的积分变化
      const userPointsHistory = pointsHistory.filter(p => p.userId === participant.userId);

      // 分别计算参与积分和信任积分
      const participationPoints = userPointsHistory
        .filter(p => p.pointType === 'PARTICIPATION')
        .reduce((sum, p) => sum + p.change, 0);

      const trustPoints = userPointsHistory
        .filter(p => p.pointType === 'TRUST')
        .reduce((sum, p) => sum + p.change, 0);

      return {
        userId: participant.userId,
        username: participant.user.username,
        evidenceSubmitted: participant.evidenceSubmitted,
        selfReportedSuccess: participant.selfReportedSuccess,
        recognizeRate,
        recognizeCount,
        totalEvaluations,
        finalResult: participant.finalResult,
        pointsEarned: participationPoints,
        trustPointsChange: trustPoints,
        achievements: [], // 成就系统暂时为空
      };
    });

    return {
      gameId,
      gameTitle: game.title,
      totalParticipants: game.participants.length,
      successfulParticipants: game.winnerIds.length,
      settlementResults,
      completedAt: game.updatedAt,
    };
  }
}
