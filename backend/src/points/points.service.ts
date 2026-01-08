import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointType, GameCategory, GameStatus } from '@prisma/client';

interface GamePointsContext {
  gameId: string;
  category: GameCategory;
  difficulty: number; // 1-5
  participantCount: number;
  maxParticipants: number;
  duration: number; // 游戏持续天数
  stakeAmount?: number;
}

interface UserPointsContext {
  userId: string;
  currentTrustPoints: number;
  recentViolations: number; // 最近30天违约次数
  completionRate: number; // 历史完成率
  consecutiveSuccess: number; // 连续成功次数
}

@Injectable()
export class PointsService {
  private readonly logger = new Logger(PointsService.name);

  constructor(private prisma: PrismaService) {}

  // 动态积分计算引擎
  async calculateDynamicPoints(
    basePoints: number,
    gameContext: GamePointsContext,
    userContext: UserPointsContext,
    action: 'complete' | 'perfect' | 'violated' | 'recognized'
  ): Promise<number> {
    let multiplier = 1.0;

    // 游戏难度系数 (1.0 - 1.5)
    const difficultyMultiplier = 1.0 + (gameContext.difficulty - 1) * 0.125;
    multiplier *= difficultyMultiplier;

    // 参与人数系数 (0.8 - 1.3)
    const participationRate = gameContext.participantCount / gameContext.maxParticipants;
    const participationMultiplier = 0.8 + participationRate * 0.5;
    multiplier *= participationMultiplier;

    // 游戏时长系数 (0.9 - 1.4)
    const durationMultiplier = Math.min(1.4, 0.9 + gameContext.duration * 0.1);
    multiplier *= durationMultiplier;

    // 用户信任度系数 (0.7 - 1.2)
    const trustMultiplier = Math.max(0.7, Math.min(1.2, userContext.currentTrustPoints / 100));

    // 连续成功奖励 (1.0 - 1.5)
    const streakMultiplier = Math.min(1.5, 1.0 + userContext.consecutiveSuccess * 0.05);

    // 违约惩罚系数 (0.5 - 1.0)
    const violationPenalty = Math.max(0.5, 1.0 - userContext.recentViolations * 0.1);

    // 根据行为类型调整
    switch (action) {
      case 'complete':
        multiplier *= trustMultiplier * streakMultiplier;
        break;
      case 'perfect':
        multiplier *= trustMultiplier * streakMultiplier * 1.2; // 完美履约额外20%
        break;
      case 'violated':
        multiplier *= violationPenalty * 0.8; // 违约惩罚更重
        break;
      case 'recognized':
        multiplier *= trustMultiplier;
        break;
    }

    const finalPoints = Math.round(basePoints * multiplier);

    this.logger.log(`Dynamic points calculation: base=${basePoints}, multiplier=${multiplier.toFixed(2)}, final=${finalPoints}`);

    return finalPoints;
  }

  // 获取用户积分上下文
  async getUserPointsContext(userId: string): Promise<UserPointsContext> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        trustPoints: true,
      },
    });

    // 获取最近30天的违约记录
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentViolations = await this.prisma.pointsHistory.count({
      where: {
        userId,
        pointType: PointType.TRUST,
        change: { lt: 0 },
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // 获取历史完成率
    const totalGames = await this.prisma.betParticipant.count({
      where: { userId },
    });

    const successfulGames = await this.prisma.betParticipant.count({
      where: {
        userId,
        finalResult: 'SUCCESS',
      },
    });

    const completionRate = totalGames > 0 ? successfulGames / totalGames : 1.0;

    // 获取连续成功次数
    const recentParticipations = await this.prisma.betParticipant.findMany({
      where: { userId },
      orderBy: { joinedAt: 'desc' },
      take: 10,
      select: { finalResult: true },
    });

    let consecutiveSuccess = 0;
    for (const participation of recentParticipations) {
      if (participation.finalResult === 'SUCCESS') {
        consecutiveSuccess++;
      } else {
        break;
      }
    }

    return {
      userId,
      currentTrustPoints: user?.trustPoints || 100,
      recentViolations,
      completionRate,
      consecutiveSuccess,
    };
  }

  // 更新用户积分
  async updateUserPoints(
    userId: string,
    pointType: PointType,
    change: number,
    reason: string,
    gameId?: string
  ) {
    // 记录积分变化历史
    await this.prisma.pointsHistory.create({
      data: {
        userId,
        pointType,
        change,
        reason,
        gameId,
      },
    });

    // 更新用户积分
    const updateData: any = {};
    
    switch (pointType) {
      case PointType.PARTICIPATION:
        updateData.participationPoints = {
          increment: change,
        };
        break;
      case PointType.TRUST:
        updateData.trustPoints = {
          increment: change,
        };
        break;
      case PointType.LABOR:
        updateData.laborPoints = {
          increment: change,
        };
        break;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    this.logger.log(`Updated ${pointType} points for user ${userId}: ${change > 0 ? '+' : ''}${change} (${reason})`);
    
    return updatedUser;
  }

  // 游戏相关积分更新（优化版）
  async updateGamePoints(
    userId: string,
    action: 'create' | 'join' | 'leave' | 'complete' | 'perfect',
    gameId?: string,
    gameContext?: GamePointsContext
  ) {
    let basePoints = 0;
    let reason = '';

    switch (action) {
      case 'create':
        basePoints = 10;
        reason = '创建游戏';
        break;
      case 'join':
        basePoints = 5;
        reason = '参与游戏';
        break;
      case 'leave':
        basePoints = -5;
        reason = '退出游戏';
        break;
      case 'complete':
        basePoints = 15;
        reason = '完成游戏';
        break;
      case 'perfect':
        basePoints = 5;
        reason = '完美履约奖励';
        break;
    }

    // 如果有游戏上下文且是正向积分，使用动态计算
    if (gameContext && basePoints > 0 && (action === 'complete' || action === 'perfect')) {
      const userContext = await this.getUserPointsContext(userId);
      const dynamicPoints = await this.calculateDynamicPoints(
        basePoints,
        gameContext,
        userContext,
        action
      );

      await this.updateUserPoints(userId, PointType.PARTICIPATION, dynamicPoints, reason, gameId);
    } else if (basePoints !== 0) {
      await this.updateUserPoints(userId, PointType.PARTICIPATION, basePoints, reason, gameId);
    }
  }

  // 信任积分更新（优化版 - 轻松模式）
  async updateTrustPoints(
    userId: string,
    action: 'recognized' | 'violated' | 'disputed_win' | 'disputed_lose',
    gameId?: string,
    gameContext?: GamePointsContext,
    recognizeRate?: number
  ) {
    let baseChange = 0;
    let reason = '';

    switch (action) {
      case 'recognized':
        baseChange = 2; // 提高认可奖励
        reason = '被他人认可履约';
        break;
      case 'violated':
        baseChange = -1; // 轻松模式：统一扣1分
        reason = '被他人认定违约';
        break;
      case 'disputed_win':
        baseChange = 3;
        reason = '成功申诉';
        break;
      case 'disputed_lose':
        baseChange = -5; // 降低恶意争议惩罚（原-10）
        reason = '恶意争议败诉';
        break;
    }

    if (baseChange !== 0) {
      let finalChange = baseChange;

      // 对于认可和违约，使用动态计算（轻松模式）
      if (gameContext && (action === 'recognized' || action === 'violated')) {
        const userContext = await this.getUserPointsContext(userId);

        // 根据认可度调整信任积分变化
        if (recognizeRate !== undefined) {
          if (action === 'recognized') {
            // 高认可度获得更多信任积分
            if (recognizeRate >= 0.9) finalChange = Math.round(baseChange * 1.5); // 90%以上认可度1.5倍
            else if (recognizeRate >= 0.8) finalChange = Math.round(baseChange * 1.2); // 80%以上1.2倍
          } else if (action === 'violated') {
            // 轻松模式：不再根据认可度加重惩罚，统一扣1分
            finalChange = -1;
          }
        }

        // 轻松模式：移除惯犯加重惩罚
        // if (action === 'violated' && userContext.recentViolations > 2) {
        //   finalChange = Math.round(finalChange * 1.3);
        // }

        // 考虑连续成功奖励
        if (action === 'recognized' && userContext.consecutiveSuccess >= 5) {
          finalChange = Math.round(finalChange * 1.2); // 连续成功者额外奖励
        }
      }

      await this.updateUserPoints(userId, PointType.TRUST, finalChange, reason, gameId);
    }
  }

  // 劳动积分更新（优化版）
  async updateLaborPoints(
    userId: string,
    action: 'report' | 'evidence' | 'arbitrate' | 'peer_evaluation' | 'quality_evidence' | 'community_help' | 'dispute_win',
    gameId?: string,
    quality?: 'low' | 'medium' | 'high' | 'excellent'
  ) {
    let baseChange = 0;
    let reason = '';

    switch (action) {
      case 'report':
        baseChange = 5;
        reason = '成功举报违规内容';
        break;
      case 'evidence':
        baseChange = 10;
        reason = '提供有效争议证据';
        break;
      case 'arbitrate':
        baseChange = 15;
        reason = '协助仲裁案件';
        break;
      case 'dispute_win':
        baseChange = 10;
        reason = '仲裁胜诉奖励';
        break;
      case 'peer_evaluation':
        baseChange = 2;
        reason = '参与互评';
        break;
      case 'quality_evidence':
        baseChange = 5;
        reason = '提交高质量证据';
        break;
      case 'community_help':
        baseChange = 3;
        reason = '社区互助';
        break;
    }

    // 根据质量调整积分
    if (quality && baseChange > 0) {
      const qualityMultiplier = {
        'low': 0.7,
        'medium': 1.0,
        'high': 1.3,
        'excellent': 1.6
      };
      baseChange = Math.round(baseChange * qualityMultiplier[quality]);
    }

    if (baseChange > 0) {
      await this.updateUserPoints(userId, PointType.LABOR, baseChange, reason, gameId);
    }
  }

  // 综合游戏结算积分奖励
  async awardGameCompletionPoints(
    userId: string,
    gameId: string,
    result: {
      finalResult: 'SUCCESS' | 'FAILURE';
      recognizeRate: number;
      evidenceSubmitted: boolean;
      evidenceQuality?: 'low' | 'medium' | 'high' | 'excellent';
      participatedInEvaluation: boolean;
    }
  ) {
    // 获取游戏上下文
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!game) return;

    const gameContext: GamePointsContext = {
      gameId,
      category: game.category,
      difficulty: this.calculateGameDifficulty(game),
      participantCount: game._count.participants,
      maxParticipants: game.maxParticipants,
      duration: Math.ceil((new Date(game.endDate).getTime() - new Date(game.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      stakeAmount: Number(game.betAmount) || 0,
    };

    // 参与积分奖励
    if (result.finalResult === 'SUCCESS') {
      await this.updateGamePoints(userId, 'complete', gameId, gameContext);

      // 完美履约奖励
      if (result.recognizeRate >= 0.8) {
        await this.updateGamePoints(userId, 'perfect', gameId, gameContext);
      }
    }

    // 信任积分变化
    const action = result.finalResult === 'SUCCESS' ? 'recognized' : 'violated';
    await this.updateTrustPoints(userId, action, gameId, gameContext, result.recognizeRate);

    // 劳动积分奖励
    if (result.participatedInEvaluation) {
      await this.updateLaborPoints(userId, 'peer_evaluation', gameId);
    }

    if (result.evidenceSubmitted && result.evidenceQuality) {
      await this.updateLaborPoints(userId, 'quality_evidence', gameId, result.evidenceQuality);
    }

    // 特殊奖励：连续成功、高难度挑战等
    await this.checkSpecialRewards(userId, gameContext, result);
  }

  // 计算游戏难度
  private calculateGameDifficulty(game: any): number {
    let difficulty = 1;

    // 根据游戏类别调整难度
    const categoryDifficulty = {
      'HEALTH': 2,
      'LEARNING': 3,
      'WORK': 2,
      'SOCIAL': 1,
      'ENTERTAINMENT': 1,
      'OTHER': 2,
    };
    difficulty = categoryDifficulty[game.category] || 2;

    // 根据持续时间调整
    const duration = Math.ceil((new Date(game.endDate).getTime() - new Date(game.startDate).getTime()) / (1000 * 60 * 60 * 24));
    if (duration >= 30) difficulty += 1;
    else if (duration >= 14) difficulty += 0.5;

    // 根据参与人数调整
    if (game.maxParticipants >= 20) difficulty += 0.5;

    return Math.min(5, Math.max(1, difficulty));
  }

  // 检查特殊奖励（优化版）
  private async checkSpecialRewards(
    userId: string,
    gameContext: GamePointsContext,
    result: any
  ) {
    const userContext = await this.getUserPointsContext(userId);

    // 连续成功奖励（分级奖励）
    if (result.finalResult === 'SUCCESS') {
      const streakRewards = [
        { streak: 5, points: 10, reason: '连续成功5次奖励' },
        { streak: 10, points: 25, reason: '连续成功10次奖励' },
        { streak: 20, points: 50, reason: '连续成功20次奖励' },
        { streak: 50, points: 100, reason: '连续成功50次奖励' },
      ];

      for (const reward of streakRewards) {
        if (userContext.consecutiveSuccess === reward.streak) {
          await this.updateUserPoints(
            userId,
            PointType.PARTICIPATION,
            reward.points,
            reward.reason,
            gameContext.gameId
          );
          break;
        }
      }
    }

    // 高难度挑战奖励（分级）
    if (result.finalResult === 'SUCCESS') {
      if (gameContext.difficulty >= 4.5) {
        await this.updateUserPoints(userId, PointType.PARTICIPATION, 20, '极高难度挑战完成', gameContext.gameId);
      } else if (gameContext.difficulty >= 4) {
        await this.updateUserPoints(userId, PointType.PARTICIPATION, 15, '高难度挑战完成', gameContext.gameId);
      } else if (gameContext.difficulty >= 3.5) {
        await this.updateUserPoints(userId, PointType.PARTICIPATION, 10, '中高难度挑战完成', gameContext.gameId);
      }
    }

    // 完美表现奖励（高认可度 + 高质量证据）
    if (result.recognizeRate >= 0.9 && result.evidenceQuality === 'excellent') {
      await this.updateUserPoints(
        userId,
        PointType.TRUST,
        5,
        '完美表现特殊奖励',
        gameContext.gameId
      );
    }

    // 社区贡献奖励
    await this.checkCommunityContributionRewards(userId, gameContext, result);

    // 时间段特殊奖励
    await this.checkTimeBasedRewards(userId, gameContext, result);

    // 分类专精奖励
    await this.checkCategorySpecializationRewards(userId, gameContext, result);
  }

  // 社区贡献奖励检查
  private async checkCommunityContributionRewards(
    userId: string,
    gameContext: GamePointsContext,
    result: any
  ) {
    // 检查用户在该分类下的表现
    const categoryStats = await this.prisma.betParticipant.aggregate({
      where: {
        userId,
        game: { category: gameContext.category },
        finalResult: 'SUCCESS'
      },
      _count: { id: true }
    });

    // 分类达人奖励
    const categoryMilestones = [5, 10, 25, 50];
    for (const milestone of categoryMilestones) {
      if (categoryStats._count.id === milestone) {
        const points = milestone * 2;
        await this.updateUserPoints(
          userId,
          PointType.PARTICIPATION,
          points,
          `${gameContext.category}分类${milestone}次成功奖励`,
          gameContext.gameId
        );
      }
    }

    // 新手引导奖励
    if (result.finalResult === 'SUCCESS') {
      const totalGames = await this.prisma.betParticipant.count({
        where: { userId }
      });

      if (totalGames <= 3) {
        await this.updateUserPoints(
          userId,
          PointType.PARTICIPATION,
          10,
          '新手鼓励奖励',
          gameContext.gameId
        );
      }
    }
  }

  // 时间段特殊奖励
  private async checkTimeBasedRewards(
    userId: string,
    gameContext: GamePointsContext,
    result: any
  ) {
    if (result.finalResult !== 'SUCCESS') return;

    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // 早起奖励（6-8点完成游戏）
    if (hour >= 6 && hour <= 8) {
      await this.updateUserPoints(
        userId,
        PointType.PARTICIPATION,
        5,
        '早起完成奖励',
        gameContext.gameId
      );
    }

    // 周末坚持奖励
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      await this.updateUserPoints(
        userId,
        PointType.PARTICIPATION,
        3,
        '周末坚持奖励',
        gameContext.gameId
      );
    }

    // 月末冲刺奖励
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (now.getDate() >= lastDayOfMonth - 2) {
      await this.updateUserPoints(
        userId,
        PointType.PARTICIPATION,
        8,
        '月末冲刺奖励',
        gameContext.gameId
      );
    }
  }

  // 分类专精奖励
  private async checkCategorySpecializationRewards(
    userId: string,
    gameContext: GamePointsContext,
    result: any
  ) {
    if (result.finalResult !== 'SUCCESS') return;

    // 暂时跳过复杂的分类专精检查
    // 因为需要复杂的数据库查询和字段关联

    // 暂时跳过分类专精奖励的具体实现
  }

  // 获取用户积分历史
  async getUserPointsHistory(userId: string, limit = 50) {
    return this.prisma.pointsHistory.findMany({
      where: { userId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // 获取用户积分统计
  async getUserPointsStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 计算总积分（信任积分不计入可用积分）
    const totalPoints = user.participationPoints + user.laborPoints;

    // 获取最近30天的积分变化
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentHistory = await this.prisma.pointsHistory.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const recentChange = recentHistory.reduce((sum, record) => sum + record.change, 0);

    return {
      participationPoints: user.participationPoints,
      trustPoints: user.trustPoints,
      laborPoints: user.laborPoints,
      totalPoints,
      recentChange,
      recentHistoryCount: recentHistory.length,
    };
  }

  // 批量更新游戏结果积分
  async updateGameResultPoints(gameId: string, results: Array<{
    userId: string;
    recognizeRate: number;
    recognizeCount: number;
    totalEvaluations: number;
  }>) {
    for (const result of results) {
      // 参与积分：成功完成获得15分
      if (result.recognizeRate >= 0.5) {
        await this.updateGamePoints(result.userId, 'complete', gameId);
        
        // 完美履约奖励：认可度超过80%
        if (result.recognizeRate >= 0.8) {
          await this.updateGamePoints(result.userId, 'perfect', gameId);
        }
      }

      // 信任积分：根据认可度调整
      if (result.recognizeRate >= 0.8) {
        await this.updateTrustPoints(result.userId, 'recognized', gameId);
      } else if (result.recognizeRate < 0.3) {
        await this.updateTrustPoints(result.userId, 'violated', gameId);
      }
    }
  }

  // 检查用户是否可以兑换VIP
  async canExchangeVIP(userId: string): Promise<{ canExchange: boolean; laborPoints: number; requiredPoints: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { laborPoints: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const requiredPoints = 1000; // 1000L积分 = 1个月VIP
    
    return {
      canExchange: user.laborPoints >= requiredPoints,
      laborPoints: user.laborPoints,
      requiredPoints,
    };
  }

  // 获取用户积分详细统计
  async getUserDetailedStats(userId: string) {
    const basicStats = await this.getUserPointsStats(userId);

    // 获取本月积分变化
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyHistory = await this.prisma.pointsHistory.findMany({
      where: {
        userId,
        createdAt: { gte: thisMonth },
      },
      select: {
        pointType: true,
        change: true,
        reason: true,
      },
    });

    const monthlyStats = {
      participation: 0,
      trust: 0,
      labor: 0,
    };

    const reasonStats: Record<string, number> = {};

    monthlyHistory.forEach(record => {
      switch (record.pointType) {
        case PointType.PARTICIPATION:
          monthlyStats.participation += record.change;
          break;
        case PointType.TRUST:
          monthlyStats.trust += record.change;
          break;
        case PointType.LABOR:
          monthlyStats.labor += record.change;
          break;
      }

      // 统计积分来源
      reasonStats[record.reason] = (reasonStats[record.reason] || 0) + record.change;
    });

    // 获取用户排名
    const rankings = await this.getUserRankings(userId);

    return {
      ...basicStats,
      monthly: monthlyStats,
      reasonStats,
      rankings,
    };
  }

  // 获取用户排名
  async getUserRankings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
      },
    });

    if (!user) return { participation: 0, trust: 0, labor: 0 };

    // 参与积分排名
    const participationRank = await this.prisma.user.count({
      where: {
        participationPoints: { gt: user.participationPoints }
      }
    }) + 1;

    // 信任积分排名
    const trustRank = await this.prisma.user.count({
      where: {
        trustPoints: { gt: user.trustPoints }
      }
    }) + 1;

    // 劳动积分排名
    const laborRank = await this.prisma.user.count({
      where: {
        laborPoints: { gt: user.laborPoints }
      }
    }) + 1;

    return {
      participation: participationRank,
      trust: trustRank,
      labor: laborRank,
    };
  }

  // 获取积分排行榜
  async getPointsLeaderboard(type: 'participation' | 'trust' | 'labor' | 'total', limit: number = 10) {
    let orderBy: any;

    switch (type) {
      case 'participation':
        orderBy = { participationPoints: 'desc' };
        break;
      case 'trust':
        orderBy = { trustPoints: 'desc' };
        break;
      case 'labor':
        orderBy = { laborPoints: 'desc' };
        break;
      case 'total':
        // 对于总积分，需要使用原始查询
        const users = await this.prisma.user.findMany({
          select: {
            id: true,
            username: true,
            fullName: true,
            participationPoints: true,
            trustPoints: true,
            laborPoints: true,
          },
          take: limit * 2, // 取更多数据以便排序
        });

        return users
          .map(user => ({
            ...user,
            totalPoints: user.participationPoints + user.trustPoints + user.laborPoints,
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, limit);
    }

    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
      },
      orderBy,
      take: limit,
    });
  }

  // 获取用户积分趋势
  async getUserPointsTrends(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await this.prisma.pointsHistory.findMany({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });

    // 按日期分组统计
    const dailyTrends = new Map<string, { participation: number; trust: number; labor: number }>();

    for (const record of history) {
      const dateKey = record.createdAt.toISOString().split('T')[0];
      if (!dailyTrends.has(dateKey)) {
        dailyTrends.set(dateKey, { participation: 0, trust: 0, labor: 0 });
      }

      const dayData = dailyTrends.get(dateKey)!;
      switch (record.pointType) {
        case PointType.PARTICIPATION:
          dayData.participation += record.change;
          break;
        case PointType.TRUST:
          dayData.trust += record.change;
          break;
        case PointType.LABOR:
          dayData.labor += record.change;
          break;
      }
    }

    return Array.from(dailyTrends.entries()).map(([date, points]) => ({
      date,
      ...points,
      total: points.participation + points.trust + points.labor
    }));
  }

  // 获取系统统计信息
  async getSystemStats() {
    const [
      totalUsers,
      totalPointsAwarded,
      averagePoints,
      topUsers,
      pointsDistribution
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.pointsHistory.aggregate({
        _sum: { change: true },
        where: { change: { gt: 0 } }
      }),
      this.prisma.user.aggregate({
        _avg: {
          participationPoints: true,
          trustPoints: true,
          laborPoints: true
        }
      }),
      this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          participationPoints: true,
          trustPoints: true,
          laborPoints: true
        },
        orderBy: [
          { participationPoints: 'desc' },
          { trustPoints: 'desc' },
          { laborPoints: 'desc' }
        ],
        take: 10
      }),
      this.prisma.pointsHistory.groupBy({
        by: ['pointType'],
        _sum: { change: true },
        _count: { change: true }
      })
    ]);

    return {
      totalUsers,
      totalPointsAwarded: totalPointsAwarded._sum.change || 0,
      averagePoints,
      topUsers: topUsers.map(user => ({
        ...user,
        totalPoints: user.participationPoints + user.trustPoints + user.laborPoints
      })),
      pointsDistribution
    };
  }
}
