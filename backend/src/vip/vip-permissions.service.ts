import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VipTier } from '@prisma/client';

export interface VipPermissionCheck {
  hasPermission: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  currentTier?: VipTier | null;
  requiredTier?: VipTier;
}

@Injectable()
export class VipPermissionsService {
  constructor(private prisma: PrismaService) {}

  // VIP权限配置
  private readonly VIP_PERMISSIONS = {
    // 游戏创建权限
    CREATE_UNLIMITED_GAMES: {
      requiredTier: VipTier.ELITE,
      description: '无限制创建游戏'
    },
    CREATE_LARGE_GAMES: {
      requiredTier: VipTier.PREMIUM,
      description: '创建大型游戏（超过20人）'
    },
    CREATE_PRIVATE_GAMES: {
      requiredTier: VipTier.BASIC,
      description: '创建私人游戏'
    },

    // 游戏参与权限
    JOIN_UNLIMITED_GAMES: {
      requiredTier: VipTier.ELITE,
      description: '无限制参与游戏'
    },
    JOIN_VIP_ONLY_GAMES: {
      requiredTier: VipTier.BASIC,
      description: '参与VIP专属游戏'
    },
    PRIORITY_GAME_ACCESS: {
      requiredTier: VipTier.PREMIUM,
      description: '优先参与热门游戏'
    },

    // 社交功能权限
    CREATE_TEAMS: {
      requiredTier: VipTier.BASIC,
      description: '创建团队'
    },
    CREATE_LARGE_TEAMS: {
      requiredTier: VipTier.PREMIUM,
      description: '创建大型团队（超过10人）'
    },
    UNLIMITED_FRIEND_REQUESTS: {
      requiredTier: VipTier.PREMIUM,
      description: '无限制发送好友请求'
    },

    // 数据和统计权限
    ADVANCED_STATISTICS: {
      requiredTier: VipTier.PREMIUM,
      description: '高级数据统计'
    },
    EXPORT_DATA: {
      requiredTier: VipTier.ELITE,
      description: '导出个人数据'
    },
    DETAILED_ANALYTICS: {
      requiredTier: VipTier.ELITE,
      description: '详细分析报告'
    },

    // 自定义功能权限
    CUSTOM_TEMPLATES: {
      requiredTier: VipTier.PREMIUM,
      description: '自定义游戏模板'
    },
    CUSTOM_THEMES: {
      requiredTier: VipTier.BASIC,
      description: '自定义主题'
    },
    CUSTOM_BADGES: {
      requiredTier: VipTier.ELITE,
      description: '自定义徽章'
    },

    // 客服和支持权限
    PRIORITY_SUPPORT: {
      requiredTier: VipTier.BASIC,
      description: '优先客服支持'
    },
    DEDICATED_SUPPORT: {
      requiredTier: VipTier.ELITE,
      description: '专属客服支持'
    },

    // 广告和推广权限
    AD_FREE_EXPERIENCE: {
      requiredTier: VipTier.BASIC,
      description: '无广告体验'
    },
    FEATURED_GAMES: {
      requiredTier: VipTier.ELITE,
      description: '游戏推荐位'
    },
    PROFILE_HIGHLIGHT: {
      requiredTier: VipTier.PREMIUM,
      description: '个人资料高亮'
    }
  };

  // 检查用户VIP权限
  async checkVipPermission(userId: string, permission: string): Promise<VipPermissionCheck> {
    const permissionConfig = this.VIP_PERMISSIONS[permission];
    
    if (!permissionConfig) {
      return {
        hasPermission: false,
        reason: '未知权限'
      };
    }

    const userVipStatus = await this.getUserVipStatus(userId);
    
    if (!userVipStatus.isVip) {
      return {
        hasPermission: false,
        reason: '需要VIP会员',
        upgradeRequired: true,
        currentTier: null,
        requiredTier: permissionConfig.requiredTier
      };
    }

    const hasPermission = this.compareVipTiers(userVipStatus.tier, permissionConfig.requiredTier);
    
    return {
      hasPermission,
      reason: hasPermission ? undefined : `需要${permissionConfig.requiredTier}或更高等级`,
      upgradeRequired: !hasPermission,
      currentTier: userVipStatus.tier,
      requiredTier: permissionConfig.requiredTier
    };
  }

  // 批量检查权限
  async checkMultiplePermissions(userId: string, permissions: string[]): Promise<Record<string, VipPermissionCheck>> {
    const results: Record<string, VipPermissionCheck> = {};
    
    for (const permission of permissions) {
      results[permission] = await this.checkVipPermission(userId, permission);
    }
    
    return results;
  }

  // 获取用户所有可用权限
  async getUserAvailablePermissions(userId: string): Promise<string[]> {
    const userVipStatus = await this.getUserVipStatus(userId);
    
    if (!userVipStatus.isVip) {
      return [];
    }

    const availablePermissions: string[] = [];
    
    for (const [permission, config] of Object.entries(this.VIP_PERMISSIONS)) {
      if (this.compareVipTiers(userVipStatus.tier, config.requiredTier)) {
        availablePermissions.push(permission);
      }
    }
    
    return availablePermissions;
  }

  // 获取权限描述
  getPermissionDescription(permission: string): string {
    return this.VIP_PERMISSIONS[permission]?.description || '未知权限';
  }

  // 获取所有权限配置
  getAllPermissions(): Record<string, any> {
    return this.VIP_PERMISSIONS;
  }

  // 检查游戏创建权限
  async checkGameCreationPermission(userId: string, maxParticipants?: number): Promise<VipPermissionCheck> {
    if (maxParticipants && maxParticipants > 20) {
      return this.checkVipPermission(userId, 'CREATE_LARGE_GAMES');
    }
    
    return { hasPermission: true };
  }

  // 检查游戏参与权限
  async checkGameJoinPermission(userId: string, gameId: string): Promise<VipPermissionCheck> {
    const game = await this.prisma.betGame.findUnique({
      where: { id: gameId },
      select: { id: true, isFeatured: true } // 使用现有字段
    });

    if (!game) {
      return { hasPermission: false, reason: '游戏不存在' };
    }

    // 暂时使用isFeatured作为VIP游戏的标识
    if (game.isFeatured) {
      return this.checkVipPermission(userId, 'JOIN_VIP_ONLY_GAMES');
    }

    return { hasPermission: true };
  }

  // 检查团队创建权限
  async checkTeamCreationPermission(userId: string, maxMembers?: number): Promise<VipPermissionCheck> {
    const basicCheck = await this.checkVipPermission(userId, 'CREATE_TEAMS');
    
    if (!basicCheck.hasPermission) {
      return basicCheck;
    }

    if (maxMembers && maxMembers > 10) {
      return this.checkVipPermission(userId, 'CREATE_LARGE_TEAMS');
    }

    return { hasPermission: true };
  }

  // 强制权限检查（抛出异常）
  async requireVipPermission(userId: string, permission: string): Promise<void> {
    const check = await this.checkVipPermission(userId, permission);
    
    if (!check.hasPermission) {
      throw new ForbiddenException(
        check.reason || `需要VIP权限: ${this.getPermissionDescription(permission)}`
      );
    }
  }

  // 获取用户VIP状态
  private async getUserVipStatus(userId: string): Promise<{ isVip: boolean; tier: VipTier | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isVip: true, vipExpiresAt: true }
    });

    if (!user || !user.isVip || (user.vipExpiresAt && user.vipExpiresAt < new Date())) {
      return { isVip: false, tier: null };
    }

    // 获取当前有效的VIP订阅
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

  // 比较VIP等级
  private compareVipTiers(userTier: VipTier | null, requiredTier: VipTier): boolean {
    if (!userTier) return false;

    const tierLevels = {
      [VipTier.BASIC]: 1,
      [VipTier.PREMIUM]: 2,
      [VipTier.ELITE]: 3
    };

    return (tierLevels[userTier] || 0) >= (tierLevels[requiredTier] || 0);
  }

  // 获取VIP等级限制
  async getVipLimits(userId: string): Promise<{
    dailyGameCreation: number;
    dailyGameJoining: number;
    maxTeamMembers: number;
    maxGameParticipants: number;
    friendRequestsPerDay: number;
  }> {
    const userVipStatus = await this.getUserVipStatus(userId);

    if (!userVipStatus.isVip) {
      return {
        dailyGameCreation: 5,
        dailyGameJoining: 15,
        maxTeamMembers: 5,
        maxGameParticipants: 10,
        friendRequestsPerDay: 10
      };
    }

    switch (userVipStatus.tier) {
      case VipTier.BASIC:
        return {
          dailyGameCreation: 10,
          dailyGameJoining: 25,
          maxTeamMembers: 10,
          maxGameParticipants: 20,
          friendRequestsPerDay: 20
        };
      
      case VipTier.PREMIUM:
        return {
          dailyGameCreation: 20,
          dailyGameJoining: 50,
          maxTeamMembers: 20,
          maxGameParticipants: 50,
          friendRequestsPerDay: 50
        };
      
      case VipTier.ELITE:
        return {
          dailyGameCreation: -1, // 无限制
          dailyGameJoining: -1,  // 无限制
          maxTeamMembers: 50,
          maxGameParticipants: 100,
          friendRequestsPerDay: -1 // 无限制
        };
      
      default:
        return {
          dailyGameCreation: 5,
          dailyGameJoining: 15,
          maxTeamMembers: 5,
          maxGameParticipants: 10,
          friendRequestsPerDay: 10
        };
    }
  }
}
