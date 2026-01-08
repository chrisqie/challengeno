import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { AchievementCategory, AchievementType, AchievementRarity, PointType, NotificationType } from '@prisma/client';

interface AchievementCondition {
  type: 'count' | 'threshold' | 'streak' | 'ratio' | 'special';
  target: number;
  field?: string;
  operator?: 'gte' | 'lte' | 'eq';
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all';
}

interface AchievementReward {
  points?: {
    type: PointType;
    amount: number;
  };
  vip?: {
    duration: number; // 天数
  };
  badge?: string;
  title?: string;
  special?: string;
}

@Injectable()
export class AchievementsService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  // 获取所有成就
  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  // 获取用户成就
  async getUserAchievements(userId: string) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    const allAchievements = await this.getAllAchievements();

    // 合并已解锁和未解锁的成就
    const achievementsMap = new Map();
    
    // 添加已解锁的成就
    userAchievements.forEach(ua => {
      achievementsMap.set(ua.achievementId, {
        ...ua.achievement,
        unlocked: true,
        unlockedAt: ua.unlockedAt,
        progress: ua.progress,
        isDisplayed: ua.isDisplayed,
      });
    });

    // 添加未解锁的成就
    allAchievements.forEach(achievement => {
      if (!achievementsMap.has(achievement.id)) {
        achievementsMap.set(achievement.id, {
          ...achievement,
          unlocked: false,
          progress: null,
        });
      }
    });

    return Array.from(achievementsMap.values());
  }

  // 检查并解锁成就
  async checkAndUnlockAchievements(userId: string, triggerType?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: true,
        participations: true,
        createdGames: true,
        pointsHistory: true,
      },
    });

    if (!user) return;

    const allAchievements = await this.getAllAchievements();
    const unlockedAchievementIds = user.userAchievements.map(ua => ua.achievementId);

    // 批量检查成就，提高效率
    const achievementsToUnlock: string[] = [];

    for (const achievement of allAchievements) {
      // 跳过已解锁的成就
      if (unlockedAchievementIds.includes(achievement.id)) continue;

      const condition = achievement.condition as unknown as AchievementCondition;
      const shouldUnlock = await this.checkAchievementCondition(user, condition);

      if (shouldUnlock) {
        achievementsToUnlock.push(achievement.id);
      }
    }

    // 批量解锁成就
    for (const achievementId of achievementsToUnlock) {
      await this.unlockAchievement(userId, achievementId);
    }

    // 检查动态成就
    await this.checkDynamicAchievements(userId, user);
  }

  // 检查成就条件
  private async checkAchievementCondition(user: any, condition: AchievementCondition): Promise<boolean> {
    switch (condition.type) {
      case 'count':
        return this.checkCountCondition(user, condition);
      case 'threshold':
        return this.checkThresholdCondition(user, condition);
      case 'streak':
        return this.checkStreakCondition(user, condition);
      case 'ratio':
        return this.checkRatioCondition(user, condition);
      case 'special':
        return this.checkSpecialCondition(user, condition);
      default:
        return false;
    }
  }

  // 检查计数条件
  private checkCountCondition(user: any, condition: AchievementCondition): boolean {
    let count = 0;

    switch (condition.field) {
      case 'gamesCreated':
        count = user.totalGamesCreated;
        break;
      case 'gamesJoined':
        count = user.totalGamesJoined;
        break;
      case 'gamesCompleted':
        count = user.gamesCompleted;
        break;
      case 'participations':
        count = user.participations.length;
        break;
      default:
        return false;
    }

    return count >= condition.target;
  }

  // 检查阈值条件
  private checkThresholdCondition(user: any, condition: AchievementCondition): boolean {
    let value = 0;

    switch (condition.field) {
      case 'participationPoints':
        value = user.participationPoints;
        break;
      case 'trustPoints':
        value = user.trustPoints;
        break;
      case 'laborPoints':
        value = user.laborPoints;
        break;
      case 'totalPoints':
        value = user.participationPoints + user.trustPoints + user.laborPoints;
        break;
      default:
        return false;
    }

    const operator = condition.operator || 'gte';
    switch (operator) {
      case 'gte':
        return value >= condition.target;
      case 'lte':
        return value <= condition.target;
      case 'eq':
        return value === condition.target;
      default:
        return false;
    }
  }

  // 检查连续条件（暂时简化实现）
  private checkStreakCondition(user: any, condition: AchievementCondition): boolean {
    // 这里需要根据具体业务逻辑实现
    // 比如连续登录、连续完成挑战等
    return false;
  }

  // 检查比率条件
  private checkRatioCondition(user: any, condition: AchievementCondition): boolean {
    if (condition.field === 'successRate') {
      const totalGames = user.gamesCompleted;
      if (totalGames === 0) return false;
      
      // 这里需要计算成功率，暂时简化
      const successRate = user.gamesCompleted / user.totalGamesJoined;
      return successRate >= (condition.target / 100);
    }
    return false;
  }

  // 检查特殊条件
  private checkSpecialCondition(user: any, condition: AchievementCondition): boolean {
    switch (condition.field) {
      case 'firstGame':
        return user.totalGamesCreated >= 1;
      case 'firstParticipation':
        return user.totalGamesJoined >= 1;
      case 'vipStatus':
        return user.isVip;
      default:
        return false;
    }
  }

  // 解锁成就
  private async unlockAchievement(userId: string, achievementId: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) return;

    // 创建用户成就记录
    await this.prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
    });

    // 发放奖励
    const reward = achievement.reward as unknown as AchievementReward;
    await this.grantAchievementReward(userId, reward, achievement.name);

    // 发送通知 - 使用翻译键
    await this.prisma.notification.create({
      data: {
        userId,
        type: NotificationType.ACHIEVEMENT_UNLOCKED,
        title: 'notifications.messages.achievementUnlocked.title',
        message: 'notifications.messages.achievementUnlocked.message',
        data: {
          achievementId,
          achievementName: achievement.name,
          reward: JSON.parse(JSON.stringify(reward)),
        } as any,
      },
    });

    console.log(`用户 ${userId} 解锁成就: ${achievement.name}`);
  }

  // 发放成就奖励
  private async grantAchievementReward(userId: string, reward: AchievementReward, achievementName: string) {
    // 积分奖励
    if (reward.points) {
      await this.pointsService.updateUserPoints(
        userId,
        reward.points.type,
        reward.points.amount,
        `成就奖励: ${achievementName}`,
      );
    }

    // VIP奖励
    if (reward.vip) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + reward.vip.duration);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isVip: true,
          vipExpiresAt: expiresAt,
        },
      });
    }

    // 其他奖励（徽章、称号等）可以在这里扩展
  }

  // 管理员：创建成就
  async createAchievement(data: {
    name: string;
    description: string;
    icon?: string;
    category: AchievementCategory;
    type: AchievementType;
    condition: AchievementCondition;
    reward: AchievementReward;
    rarity?: AchievementRarity;
    sortOrder?: number;
  }) {
    return this.prisma.achievement.create({
      data: {
        ...data,
        condition: data.condition as any,
        reward: data.reward as any,
        rarity: data.rarity || AchievementRarity.COMMON,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  // 管理员：更新成就
  async updateAchievement(id: string, data: any) {
    return this.prisma.achievement.update({
      where: { id },
      data,
    });
  }

  // 管理员：删除成就
  async deleteAchievement(id: string) {
    return this.prisma.achievement.delete({
      where: { id },
    });
  }

  // 获取成就统计
  async getAchievementStats() {
    const [
      totalAchievements,
      totalUnlocked,
      categoryStats,
      rarityStats,
    ] = await Promise.all([
      this.prisma.achievement.count({ where: { isActive: true } }),
      this.prisma.userAchievement.count(),
      this.prisma.achievement.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: { category: true },
      }),
      this.prisma.achievement.groupBy({
        by: ['rarity'],
        where: { isActive: true },
        _count: { rarity: true },
      }),
    ]);

    return {
      totalAchievements,
      totalUnlocked,
      categoryStats,
      rarityStats,
    };
  }

  // 检查动态成就
  private async checkDynamicAchievements(userId: string, user: any) {
    // 连续登录成就
    await this.checkLoginStreakAchievements(userId);

    // 时间段成就
    await this.checkTimeBasedAchievements(userId, user);

    // 社交成就
    await this.checkSocialAchievements(userId, user);

    // 质量成就
    await this.checkQualityAchievements(userId, user);

    // 里程碑成就
    await this.checkMilestoneAchievements(userId, user);
  }

  // 连续登录成就检查
  private async checkLoginStreakAchievements(userId: string) {
    // 暂时跳过连续登录检查，因为数据库中没有相关字段
    // 可以在未来版本中添加 lastLoginDate 和 loginStreak 字段

    // 基于用户创建时间的简单检查
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true }
    });

    if (user) {
      const daysSinceJoin = Math.floor((new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // 老用户成就
      if (daysSinceJoin >= 30) {
        await this.createDynamicAchievement(userId, {
          name: '老用户',
          description: '注册超过30天',
          icon: '🏆',
          category: 'MILESTONE',
          reward: { points: { type: 'PARTICIPATION', amount: 50 } }
        });
      }
    }
  }

  // 时间段成就检查
  private async checkTimeBasedAchievements(userId: string, user: any) {
    // 暂时跳过复杂的时间段检查，使用简单的用户活跃度检查
    console.log('时间段成就检查 - 暂时跳过');
  }

  // 社交成就检查
  private async checkSocialAchievements(userId: string, user: any) {
    // 暂时跳过社交成就检查，因为需要复杂的数据库查询
    console.log('社交成就检查 - 暂时跳过');
  }

  // 质量成就检查
  private async checkQualityAchievements(userId: string, user: any) {
    // 暂时跳过质量成就检查，因为需要额外的数据库字段
    console.log('质量成就检查 - 暂时跳过');
  }

  // 里程碑成就检查
  private async checkMilestoneAchievements(userId: string, user: any) {
    const totalPoints = user.participationPoints + user.trustPoints + user.laborPoints;

    const pointMilestones = [
      { points: 1000, name: '积分新星', reward: 100 },
      { points: 5000, name: '积分达人', reward: 300 },
      { points: 10000, name: '积分大师', reward: 500 },
      { points: 50000, name: '积分传说', reward: 1000 },
    ];

    for (const milestone of pointMilestones) {
      if (totalPoints >= milestone.points) {
        await this.createDynamicAchievement(userId, {
          name: milestone.name,
          description: `总积分达到${milestone.points}分`,
          icon: '⭐',
          category: 'MILESTONE',
          reward: { points: { type: 'PARTICIPATION', amount: milestone.reward } }
        });
      }
    }
  }

  // 创建动态成就
  private async createDynamicAchievement(userId: string, achievementData: any) {
    // 检查是否已经存在相同的成就
    const existingAchievement = await this.prisma.achievement.findFirst({
      where: { name: achievementData.name }
    });

    let achievementId: string;

    if (existingAchievement) {
      achievementId = existingAchievement.id;
    } else {
      // 创建新成就
      const newAchievement = await this.prisma.achievement.create({
        data: {
          ...achievementData,
          type: 'SPECIAL', // 修复：使用有效的枚举值
          condition: { type: 'special' },
          reward: achievementData.reward,
          rarity: 'RARE',
        }
      });
      achievementId = newAchievement.id;
    }

    // 检查用户是否已经解锁
    const userAchievement = await this.prisma.userAchievement.findFirst({
      where: {
        userId,
        achievementId
      }
    });

    if (!userAchievement) {
      await this.unlockAchievement(userId, achievementId);
    }
  }

  // 获取用户成就进度
  async getUserAchievementProgress(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: {
          include: {
            achievement: true
          }
        },
        participations: true
      }
    });

    if (!user) return null;

    const allAchievements = await this.getAllAchievements();
    const unlockedIds = user.userAchievements.map(ua => ua.achievementId);

    const progress = await Promise.all(
      allAchievements.map(async (achievement) => {
        const isUnlocked = unlockedIds.includes(achievement.id);
        const condition = achievement.condition as unknown as AchievementCondition;

        let currentProgress = 0;
        let targetProgress = condition.target || 1;

        if (!isUnlocked) {
          // 计算当前进度
          currentProgress = await this.calculateAchievementProgress(user, condition);
        } else {
          currentProgress = targetProgress;
        }

        return {
          achievement,
          isUnlocked,
          currentProgress,
          targetProgress,
          progressPercentage: Math.min(100, (currentProgress / targetProgress) * 100)
        };
      })
    );

    return progress.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? 1 : -1; // 未解锁的排在前面
      }
      return b.progressPercentage - a.progressPercentage; // 按进度排序
    });
  }

  // 计算成就进度
  private async calculateAchievementProgress(user: any, condition: AchievementCondition): Promise<number> {
    switch (condition.type) {
      case 'count':
        return this.calculateCountProgress(user, condition);
      case 'threshold':
        return this.calculateThresholdProgress(user, condition);
      case 'streak':
        return this.calculateStreakProgress(user, condition);
      case 'ratio':
        return this.calculateRatioProgress(user, condition);
      default:
        return 0;
    }
  }

  // 计算数量类进度
  private calculateCountProgress(user: any, condition: AchievementCondition): number {
    switch (condition.field) {
      case 'gamesCompleted':
        return user.participations?.filter((p: any) => p.finalResult === 'SUCCESS').length || 0;
      case 'gamesCreated':
        return user.createdGames?.length || 0;
      case 'evaluationsGiven':
        // 需要查询 peerEvaluation 表
        return 0; // 暂时返回0，需要额外查询
      default:
        return 0;
    }
  }

  // 计算阈值类进度
  private calculateThresholdProgress(user: any, condition: AchievementCondition): number {
    switch (condition.field) {
      case 'participationPoints':
        return user.participationPoints;
      case 'trustPoints':
        return user.trustPoints;
      case 'laborPoints':
        return user.laborPoints;
      case 'totalPoints':
        return user.participationPoints + user.trustPoints + user.laborPoints;
      default:
        return 0;
    }
  }

  // 计算连续类进度
  private calculateStreakProgress(user: any, condition: AchievementCondition): number {
    // 这里需要计算连续成功次数
    // 暂时返回0，需要更复杂的逻辑
    return 0;
  }

  // 计算比率类进度
  private calculateRatioProgress(user: any, condition: AchievementCondition): number {
    const totalGames = user.participations?.length || 0;
    if (totalGames === 0) return 0;

    const successGames = user.participations?.filter((p: any) => p.finalResult === 'SUCCESS').length || 0;
    return (successGames / totalGames) * 100; // 返回百分比
  }
}
