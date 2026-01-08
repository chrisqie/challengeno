import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface FraudDetectionResult {
  isSuspicious: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  recommendedAction: 'ALLOW' | 'WARN' | 'BLOCK' | 'MANUAL_REVIEW';
  confidence: number; // 0-1
}

export interface EvaluationPattern {
  userId: string;
  mutualPositiveCount: number;
  rapidEvaluationCount: number;
  consistencyScore: number;
  timePattern: 'NORMAL' | 'SUSPICIOUS' | 'BOT_LIKE';
}

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  // 检测互评作弊行为
  async detectEvaluationFraud(gameId: string): Promise<FraudDetectionResult> {
    this.logger.log(`开始检测游戏 ${gameId} 的互评作弊行为`);

    const evaluations = await this.prisma.peerEvaluation.findMany({
      where: { gameId },
      include: {
        evaluator: { select: { id: true, username: true, trustPoints: true } },
        evaluated: { select: { id: true, username: true, trustPoints: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    const participants = await this.prisma.betParticipant.findMany({
      where: { gameId },
      include: { user: { select: { id: true, username: true, trustPoints: true } } }
    });

    if (evaluations.length === 0 || participants.length < 2) {
      return {
        isSuspicious: false,
        riskLevel: 'LOW',
        reasons: [],
        recommendedAction: 'ALLOW',
        confidence: 1.0
      };
    }

    const patterns = this.analyzeEvaluationPatterns(evaluations, participants);
    const suspiciousReasons: string[] = [];
    let riskScore = 0;

    // 1. 检测互相好评模式
    const mutualPositiveRate = this.detectMutualPositiveEvaluations(evaluations);
    if (mutualPositiveRate > 0.8) {
      suspiciousReasons.push(`互相好评比例过高: ${Math.round(mutualPositiveRate * 100)}%`);
      riskScore += 30;
    } else if (mutualPositiveRate > 0.6) {
      suspiciousReasons.push(`互相好评比例较高: ${Math.round(mutualPositiveRate * 100)}%`);
      riskScore += 15;
    }

    // 2. 检测快速连续评价
    const rapidEvaluationUsers = this.detectRapidEvaluations(evaluations);
    if (rapidEvaluationUsers.length > 0) {
      suspiciousReasons.push(`${rapidEvaluationUsers.length} 个用户存在快速连续评价行为`);
      riskScore += rapidEvaluationUsers.length * 10;
    }

    // 3. 检测评价时间模式异常
    const timePatternScore = this.analyzeTimePatterns(evaluations);
    if (timePatternScore > 0.7) {
      suspiciousReasons.push('评价时间模式异常，疑似机器人行为');
      riskScore += 25;
    }

    // 4. 检测低信任度用户集中好评
    const lowTrustPositiveRate = this.detectLowTrustPositiveEvaluations(evaluations);
    if (lowTrustPositiveRate > 0.5) {
      suspiciousReasons.push(`低信任度用户好评比例异常: ${Math.round(lowTrustPositiveRate * 100)}%`);
      riskScore += 20;
    }

    // 5. 检测评价内容相似度
    const similarityScore = await this.detectSimilarReasonings(evaluations);
    if (similarityScore > 0.8) {
      suspiciousReasons.push('评价理由高度相似，疑似复制粘贴');
      riskScore += 15;
    }

    // 6. 检测评价者之间的关联性
    const relationshipScore = await this.detectUserRelationships(evaluations);
    if (relationshipScore > 0.7) {
      suspiciousReasons.push('评价者之间存在异常关联，疑似串通');
      riskScore += 25;
    }

    // 7. 检测评价分布异常
    const distributionScore = this.analyzeEvaluationDistribution(evaluations, participants);
    if (distributionScore > 0.8) {
      suspiciousReasons.push('评价分布异常，偏离正常模式');
      riskScore += 20;
    }

    // 8. 检测新用户集中好评
    const newUserBias = this.detectNewUserBias(evaluations);
    if (newUserBias > 0.6) {
      suspiciousReasons.push('新用户集中给出好评，疑似刷分');
      riskScore += 15;
    }

    // 计算风险等级和推荐行动
    const riskLevel = this.calculateRiskLevel(riskScore);
    const recommendedAction = this.getRecommendedAction(riskLevel, riskScore);
    const confidence = Math.min(1.0, riskScore / 100);

    const result: FraudDetectionResult = {
      isSuspicious: riskScore > 20,
      riskLevel,
      reasons: suspiciousReasons,
      recommendedAction,
      confidence
    };

    // 记录检测结果
    await this.logFraudDetection(gameId, result, riskScore);

    // 只有 CRITICAL 级别才通知管理员（降低通知频率）
    if (riskLevel === 'CRITICAL') {
      await this.notifyAdminsOfSuspiciousActivity(gameId, result);
    }

    return result;
  }

  // 分析评价模式
  private analyzeEvaluationPatterns(evaluations: any[], participants: any[]): EvaluationPattern[] {
    const patterns: EvaluationPattern[] = [];

    for (const participant of participants) {
      const userId = participant.userId;
      const userEvaluations = evaluations.filter(e => e.evaluatorId === userId);
      
      // 计算互相好评数量
      const mutualPositiveCount = userEvaluations.filter(evaluation => {
        return evaluations.some(reverse =>
          reverse.evaluatorId === evaluation.evaluatedId &&
          reverse.evaluatedId === evaluation.evaluatorId &&
          evaluation.evaluation === 'RECOGNIZE' &&
          reverse.evaluation === 'RECOGNIZE'
        );
      }).length;

      // 计算快速评价数量（5分钟内连续评价）
      const rapidEvaluationCount = this.countRapidEvaluations(userEvaluations);

      // 计算一致性分数（总是好评或总是差评）
      const positiveCount = userEvaluations.filter(e => e.evaluation === 'RECOGNIZE').length;
      const consistencyScore = userEvaluations.length > 0 ? 
        Math.max(positiveCount, userEvaluations.length - positiveCount) / userEvaluations.length : 0;

      // 分析时间模式
      const timePattern = this.analyzeUserTimePattern(userEvaluations);

      patterns.push({
        userId,
        mutualPositiveCount,
        rapidEvaluationCount,
        consistencyScore,
        timePattern
      });
    }

    return patterns;
  }

  // 检测互相好评
  private detectMutualPositiveEvaluations(evaluations: any[]): number {
    const mutualPositive = evaluations.filter(evaluation => {
      return evaluations.some(reverse =>
        reverse.evaluatorId === evaluation.evaluatedId &&
        reverse.evaluatedId === evaluation.evaluatorId &&
        evaluation.evaluation === 'RECOGNIZE' &&
        reverse.evaluation === 'RECOGNIZE'
      );
    });

    return evaluations.length > 0 ? mutualPositive.length / evaluations.length : 0;
  }

  // 检测快速连续评价
  private detectRapidEvaluations(evaluations: any[]): string[] {
    const rapidUsers: string[] = [];
    const userEvaluations = new Map<string, any[]>();

    // 按用户分组评价
    evaluations.forEach(evaluation => {
      if (!userEvaluations.has(evaluation.evaluatorId)) {
        userEvaluations.set(evaluation.evaluatorId, []);
      }
      userEvaluations.get(evaluation.evaluatorId)!.push(evaluation);
    });

    // 检查每个用户的评价时间间隔
    userEvaluations.forEach((userEvals, userId) => {
      const rapidCount = this.countRapidEvaluations(userEvals);
      if (rapidCount > userEvals.length * 0.5) { // 超过50%的评价是快速连续的
        rapidUsers.push(userId);
      }
    });

    return rapidUsers;
  }

  // 计算快速评价数量
  private countRapidEvaluations(evaluations: any[]): number {
    if (evaluations.length < 2) return 0;

    const sortedEvals = evaluations.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let rapidCount = 0;
    for (let i = 1; i < sortedEvals.length; i++) {
      const timeDiff = new Date(sortedEvals[i].createdAt).getTime() - 
                      new Date(sortedEvals[i-1].createdAt).getTime();
      if (timeDiff < 5 * 60 * 1000) { // 5分钟内
        rapidCount++;
      }
    }

    return rapidCount;
  }

  // 分析时间模式
  private analyzeTimePatterns(evaluations: any[]): number {
    if (evaluations.length < 3) return 0;

    const intervals: number[] = [];
    const sortedEvals = evaluations.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    for (let i = 1; i < sortedEvals.length; i++) {
      const interval = new Date(sortedEvals[i].createdAt).getTime() - 
                      new Date(sortedEvals[i-1].createdAt).getTime();
      intervals.push(interval);
    }

    // 计算时间间隔的标准差，标准差越小越可疑
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // 如果标准差很小且平均间隔很短，可能是机器人
    const normalizedStdDev = stdDev / mean;
    return normalizedStdDev < 0.1 && mean < 60000 ? 0.8 : 0; // 1分钟内且间隔很规律
  }

  // 分析用户时间模式
  private analyzeUserTimePattern(evaluations: any[]): 'NORMAL' | 'SUSPICIOUS' | 'BOT_LIKE' {
    if (evaluations.length < 2) return 'NORMAL';

    const rapidCount = this.countRapidEvaluations(evaluations);
    const rapidRate = rapidCount / evaluations.length;

    if (rapidRate > 0.8) return 'BOT_LIKE';
    if (rapidRate > 0.5) return 'SUSPICIOUS';
    return 'NORMAL';
  }

  // 检测低信任度用户好评
  private detectLowTrustPositiveEvaluations(evaluations: any[]): number {
    const lowTrustEvaluations = evaluations.filter(e => e.evaluator.trustPoints < 50);
    const lowTrustPositive = lowTrustEvaluations.filter(e => e.evaluation === 'RECOGNIZE');

    return lowTrustEvaluations.length > 0 ? 
      lowTrustPositive.length / lowTrustEvaluations.length : 0;
  }

  // 检测相似评价理由
  private async detectSimilarReasonings(evaluations: any[]): Promise<number> {
    const reasonings = evaluations
      .filter(e => e.reasoning && e.reasoning.trim().length > 10)
      .map(e => e.reasoning.trim().toLowerCase());

    if (reasonings.length < 2) return 0;

    let similarPairs = 0;
    let totalPairs = 0;

    for (let i = 0; i < reasonings.length; i++) {
      for (let j = i + 1; j < reasonings.length; j++) {
        totalPairs++;
        const similarity = this.calculateStringSimilarity(reasonings[i], reasonings[j]);
        if (similarity > 0.8) {
          similarPairs++;
        }
      }
    }

    return totalPairs > 0 ? similarPairs / totalPairs : 0;
  }

  // 计算字符串相似度
  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  // 计算编辑距离
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // 计算风险等级
  private calculateRiskLevel(riskScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (riskScore >= 80) return 'CRITICAL';
    if (riskScore >= 50) return 'HIGH';
    if (riskScore >= 25) return 'MEDIUM';
    return 'LOW';
  }

  // 获取推荐行动
  private getRecommendedAction(riskLevel: string, riskScore: number): 'ALLOW' | 'WARN' | 'BLOCK' | 'MANUAL_REVIEW' {
    switch (riskLevel) {
      case 'CRITICAL':
        return 'BLOCK';
      case 'HIGH':
        return 'MANUAL_REVIEW';
      case 'MEDIUM':
        return 'WARN';
      default:
        return 'ALLOW';
    }
  }

  // 记录作弊检测结果
  private async logFraudDetection(gameId: string, result: FraudDetectionResult, riskScore: number) {
    this.logger.log(`游戏 ${gameId} 作弊检测结果: ${result.riskLevel} (${riskScore}分)`);
    
    if (result.isSuspicious) {
      this.logger.warn(`检测到可疑行为: ${result.reasons.join(', ')}`);
    }

    // 可以在这里记录到数据库
    // await this.prisma.fraudDetectionLog.create({ ... });
  }

  // 通知管理员可疑活动
  private async notifyAdminsOfSuspiciousActivity(gameId: string, result: FraudDetectionResult) {
    // 检查是否启用反作弊通知（生产环境才启用）
    const enableFraudNotifications = process.env.ENABLE_FRAUD_NOTIFICATIONS !== 'false';

    if (!enableFraudNotifications) {
      this.logger.warn(`⚠️  反作弊通知已禁用（测试模式），跳过通知管理员`);
      return;
    }

    // 检查是否已经为这个游戏发送过通知（防止重复）
    const recentNotification = await this.prisma.notification.findFirst({
      where: {
        type: 'SECURITY_ALERT',
        data: {
          path: ['gameId'],
          equals: gameId
        },
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // 1小时内
        }
      }
    });

    if (recentNotification) {
      this.logger.warn(`⚠️  游戏 ${gameId} 在1小时内已发送过风控通知，跳过重复通知`);
      return;
    }

    // 获取管理员列表
    const admins = await this.prisma.user.findMany({
      where: { isAdmin: true },
      select: { id: true }
    });

    const adminIds = admins.map(admin => admin.id);

    if (adminIds.length > 0) {
      await this.notificationsService.createBulkNotifications(
        adminIds.map(adminId => ({
          userId: adminId,
          type: 'SECURITY_ALERT' as any,
          title: '检测到可疑互评行为',
          message: `游戏 ${gameId} 存在 ${result.riskLevel} 风险的作弊行为，需要人工审核。`,
          data: { gameId, riskLevel: result.riskLevel, reasons: result.reasons }
        }))
      );

      this.logger.log(`✅ 已通知 ${adminIds.length} 位管理员关于游戏 ${gameId} 的风控警报`);
    }
  }

  // 检测用户之间的关联性
  private async detectUserRelationships(evaluations: any[]): Promise<number> {
    if (evaluations.length < 4) return 0;

    let suspiciousRelationships = 0;
    const userPairs = new Map<string, number>();

    // 检查历史互评记录
    for (const evaluation of evaluations) {
      const evaluatorId = evaluation.evaluatorId;
      const evaluatedId = evaluation.evaluatedId;

      // 查询这两个用户在其他游戏中的互评历史
      const historicalEvaluations = await this.prisma.peerEvaluation.count({
        where: {
          OR: [
            { evaluatorId, evaluatedId },
            { evaluatorId: evaluatedId, evaluatedId: evaluatorId }
          ],
          gameId: { not: evaluation.gameId }
        }
      });

      if (historicalEvaluations > 3) {
        suspiciousRelationships++;
      }

      // 记录用户对
      const pairKey = [evaluatorId, evaluatedId].sort().join('-');
      userPairs.set(pairKey, (userPairs.get(pairKey) || 0) + 1);
    }

    // 检查是否有用户频繁互评
    const frequentPairs = Array.from(userPairs.values()).filter(count => count > 1).length;

    return Math.min(1.0, (suspiciousRelationships + frequentPairs) / evaluations.length);
  }

  // 分析评价分布异常
  private analyzeEvaluationDistribution(evaluations: any[], participants: any[]): number {
    if (evaluations.length < 4) return 0;

    const recognizeCount = evaluations.filter(e => e.evaluation === 'RECOGNIZE').length;
    const recognizeRate = recognizeCount / evaluations.length;

    // 检查分布是否过于极端
    if (recognizeRate > 0.9 || recognizeRate < 0.1) {
      return 0.9; // 极端分布
    }

    // 检查每个参与者收到的评价分布
    let abnormalDistributions = 0;
    for (const participant of participants) {
      const userEvaluations = evaluations.filter(e => e.evaluatedId === participant.userId);
      if (userEvaluations.length > 0) {
        const userRecognizeRate = userEvaluations.filter(e => e.evaluation === 'RECOGNIZE').length / userEvaluations.length;

        // 如果某个用户的认可度与整体差异过大
        if (Math.abs(userRecognizeRate - recognizeRate) > 0.7) {
          abnormalDistributions++;
        }
      }
    }

    return Math.min(1.0, abnormalDistributions / participants.length);
  }

  // 检测新用户偏向
  private detectNewUserBias(evaluations: any[]): number {
    if (evaluations.length < 3) return 0;

    let newUserPositiveEvaluations = 0;
    let totalNewUserEvaluations = 0;

    for (const evaluation of evaluations) {
      const evaluatorTrustPoints = evaluation.evaluator?.trustPoints || 100;

      // 判断是否为新用户（信任积分接近初始值）
      if (evaluatorTrustPoints >= 95 && evaluatorTrustPoints <= 105) {
        totalNewUserEvaluations++;
        if (evaluation.evaluation === 'RECOGNIZE') {
          newUserPositiveEvaluations++;
        }
      }
    }

    if (totalNewUserEvaluations === 0) return 0;

    const newUserPositiveRate = newUserPositiveEvaluations / totalNewUserEvaluations;

    // 如果新用户的好评率明显高于正常水平（通常应该在50-70%）
    if (newUserPositiveRate > 0.8 && totalNewUserEvaluations >= 3) {
      return newUserPositiveRate;
    }

    return 0;
  }
}
