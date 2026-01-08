import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VipPermissionsService } from './vip-permissions.service';
import { VipTier } from '@prisma/client';

@Injectable()
export class VipFeaturesService {
  constructor(
    private prisma: PrismaService,
    private vipPermissionsService: VipPermissionsService,
  ) {}

  // 获取VIP专属游戏模板
  async getVipGameTemplates(userId: string) {
    const userVipStatus = await this.getUserVipStatus(userId);

    if (!userVipStatus.isVip) {
      return [];
    }

    const templates = await this.prisma.gameTemplate.findMany({
      where: {
        isVipOnly: true
        // 暂时移除vipTier字段的查询，因为数据库中可能不存在
      },
      orderBy: { createdAt: 'desc' }
    });

    return templates.map(template => ({
      ...template,
      vipExclusive: true,
      requiredTier: template.vipTier || 'BASIC'
    }));
  }

  // 获取VIP专属主题
  async getVipThemes(userId: string) {
    const hasPermission = await this.vipPermissionsService.checkVipPermission(userId, 'CUSTOM_THEMES');
    
    if (!hasPermission.hasPermission) {
      return [];
    }

    const vipThemes = [
      {
        id: 'vip-gold',
        name: '黄金主题',
        description: 'VIP专属黄金配色主题',
        colors: {
          primary: '#FFD700',
          secondary: '#FFA500',
          accent: '#FF8C00'
        },
        requiredTier: VipTier.BASIC
      },
      {
        id: 'vip-platinum',
        name: '铂金主题',
        description: 'VIP专属铂金配色主题',
        colors: {
          primary: '#E5E4E2',
          secondary: '#C0C0C0',
          accent: '#A8A8A8'
        },
        requiredTier: VipTier.PREMIUM
      },
      {
        id: 'vip-diamond',
        name: '钻石主题',
        description: 'VIP专属钻石配色主题',
        colors: {
          primary: '#B9F2FF',
          secondary: '#87CEEB',
          accent: '#4682B4'
        },
        requiredTier: VipTier.ELITE
      }
    ];

    const userVipStatus = await this.getUserVipStatus(userId);
    
    return vipThemes.filter(theme => 
      this.compareVipTiers(userVipStatus.tier, theme.requiredTier)
    );
  }

  // 获取VIP专属徽章
  async getVipBadges(userId: string) {
    const userVipStatus = await this.getUserVipStatus(userId);
    
    if (!userVipStatus.isVip) {
      return [];
    }

    const badges = [
      {
        id: 'vip-member',
        name: 'VIP会员',
        description: 'VIP会员专属徽章',
        icon: '👑',
        color: '#FFD700',
        requiredTier: VipTier.BASIC
      },
      {
        id: 'vip-premium',
        name: '高级会员',
        description: '高级VIP会员徽章',
        icon: '💎',
        color: '#E5E4E2',
        requiredTier: VipTier.PREMIUM
      },
      {
        id: 'vip-elite',
        name: '精英会员',
        description: '精英VIP会员徽章',
        icon: '⭐',
        color: '#B9F2FF',
        requiredTier: VipTier.ELITE
      }
    ];

    return badges.filter(badge => 
      this.compareVipTiers(userVipStatus.tier, badge.requiredTier)
    );
  }

  // 获取VIP专属统计数据
  async getVipStatistics(userId: string) {
    const hasPermission = await this.vipPermissionsService.checkVipPermission(userId, 'ADVANCED_STATISTICS');
    
    if (!hasPermission.hasPermission) {
      throw new Error('需要高级VIP权限才能查看详细统计');
    }

    const [
      gameStats,
      pointsStats,
      socialStats,
      achievementStats
    ] = await Promise.all([
      this.getGameStatistics(userId),
      this.getPointsStatistics(userId),
      this.getSocialStatistics(userId),
      this.getAchievementStatistics(userId)
    ]);

    return {
      gameStats,
      pointsStats,
      socialStats,
      achievementStats,
      generatedAt: new Date(),
      reportType: 'VIP_ADVANCED_STATISTICS'
    };
  }

  // 创建VIP专属游戏
  async createVipExclusiveGame(userId: string, gameData: any) {
    const hasPermission = await this.vipPermissionsService.checkVipPermission(userId, 'CREATE_PRIVATE_GAMES');
    
    if (!hasPermission.hasPermission) {
      throw new Error('需要VIP权限才能创建专属游戏');
    }

    const vipGame = await this.prisma.betGame.create({
      data: {
        ...gameData,
        creatorId: userId,
        isVipOnly: true,
        vipTier: hasPermission.currentTier,
        visibility: 'VIP_ONLY'
      }
    });

    return vipGame;
  }

  // 获取VIP专属游戏列表
  async getVipExclusiveGames(userId: string) {
    const userVipStatus = await this.getUserVipStatus(userId);
    
    if (!userVipStatus.isVip) {
      return [];
    }

    // 暂时返回空数组，因为数据库中没有isVipOnly和vipTier字段
    const games = await this.prisma.betGame.findMany({
      where: {
        status: 'OPEN',
        // 暂时移除VIP相关字段的查询
        isFeatured: true // 使用现有字段作为VIP游戏的标识
      },
      include: {
        creator: {
          select: {
            username: true,
            isVip: true
          }
        },
        _count: {
          select: {
            participants: true // 使用正确的字段名
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10 // 限制数量
    });

    return games.map(game => ({
      ...game,
      vipExclusive: true,
      participantCount: game._count.participants
    }));
  }

  // VIP用户数据导出
  async exportUserData(userId: string) {
    const hasPermission = await this.vipPermissionsService.checkVipPermission(userId, 'EXPORT_DATA');
    
    if (!hasPermission.hasPermission) {
      throw new Error('需要精英VIP权限才能导出数据');
    }

    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        createdGames: true,
        participations: true,
        pointsHistory: true,
        userAchievements: true,
        vipSubscriptions: true
      }
    });

    if (!userData) {
      throw new Error('用户不存在');
    }

    // 生成导出数据
    const exportData = {
      user: {
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        createdAt: userData.createdAt,
        points: {
          participation: userData.participationPoints,
          trust: userData.trustPoints,
          labor: userData.laborPoints
        }
      },
      games: {
        created: userData.createdGames.length,
        participated: userData.participations.length
      },
      achievements: userData.userAchievements.length,
      vipHistory: userData.vipSubscriptions,
      exportedAt: new Date(),
      exportType: 'FULL_USER_DATA'
    };

    return exportData;
  }

  // 获取VIP优先支持状态
  async getVipSupportStatus(userId: string) {
    const [priorityCheck, dedicatedCheck] = await Promise.all([
      this.vipPermissionsService.checkVipPermission(userId, 'PRIORITY_SUPPORT'),
      this.vipPermissionsService.checkVipPermission(userId, 'DEDICATED_SUPPORT')
    ]);

    return {
      hasPrioritySupport: priorityCheck.hasPermission,
      hasDedicatedSupport: dedicatedCheck.hasPermission,
      supportLevel: dedicatedCheck.hasPermission ? 'DEDICATED' : 
                   priorityCheck.hasPermission ? 'PRIORITY' : 'STANDARD',
      responseTime: dedicatedCheck.hasPermission ? '1小时内' :
                   priorityCheck.hasPermission ? '4小时内' : '24小时内'
    };
  }

  // 私有方法：获取游戏统计
  private async getGameStatistics(userId: string) {
    const games = await this.prisma.betParticipant.findMany({
      where: { userId },
      include: { game: true }
    });

    return {
      totalGames: games.length,
      successfulGames: games.filter(g => g.finalResult === 'SUCCESS').length,
      categoriesPlayed: [...new Set(games.map(g => g.game.category))].length,
      averageCompletionTime: 0 // 需要计算
    };
  }

  // 私有方法：获取积分统计
  private async getPointsStatistics(userId: string) {
    const pointsHistory = await this.prisma.pointsHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return {
      totalEarned: pointsHistory.filter(p => p.change > 0).reduce((sum, p) => sum + p.change, 0),
      totalSpent: pointsHistory.filter(p => p.change < 0).reduce((sum, p) => sum + Math.abs(p.change), 0),
      averagePerGame: pointsHistory.length > 0 ? pointsHistory.reduce((sum, p) => sum + p.change, 0) / pointsHistory.length : 0
    };
  }

  // 私有方法：获取社交统计
  private async getSocialStatistics(userId: string) {
    // 简化实现
    return {
      friendsCount: 0,
      teamsJoined: 0,
      messagesExchanged: 0
    };
  }

  // 私有方法：获取成就统计
  private async getAchievementStatistics(userId: string) {
    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId }
    });

    return {
      totalAchievements: achievements.length,
      rareAchievements: 0, // 需要计算
      completionRate: 0 // 需要计算
    };
  }

  // 私有方法：获取用户VIP状态
  private async getUserVipStatus(userId: string): Promise<{ isVip: boolean; tier: VipTier | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isVip: true, vipExpiresAt: true }
    });

    if (!user || !user.isVip || (user.vipExpiresAt && user.vipExpiresAt < new Date())) {
      return { isVip: false, tier: null };
    }

    const subscription = await this.prisma.vipSubscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      isVip: true,
      tier: subscription?.tier || VipTier.BASIC
    };
  }

  // 私有方法：比较VIP等级
  private compareVipTiers(userTier: VipTier | null, requiredTier: VipTier): boolean {
    if (!userTier) return false;

    const tierLevels = {
      [VipTier.BASIC]: 1,
      [VipTier.PREMIUM]: 2,
      [VipTier.ELITE]: 3
    };

    return (tierLevels[userTier] || 0) >= (tierLevels[requiredTier] || 0);
  }
}
