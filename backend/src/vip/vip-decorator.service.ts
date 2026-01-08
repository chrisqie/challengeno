import { Injectable } from '@nestjs/common';
import { VipPermissionsService } from './vip-permissions.service';
import { VipFeaturesService } from './vip-features.service';

@Injectable()
export class VipDecoratorService {
  constructor(
    private vipPermissionsService: VipPermissionsService,
    private vipFeaturesService: VipFeaturesService,
  ) {}

  // 为用户数据添加VIP装饰信息
  async decorateUserWithVip(userId: string, userData: any) {
    const [vipStatus, vipLimits, vipBadges] = await Promise.all([
      this.getUserVipStatus(userId),
      this.vipPermissionsService.getVipLimits(userId),
      this.vipFeaturesService.getVipBadges(userId)
    ]);

    return {
      ...userData,
      vip: {
        isVip: vipStatus.isVip,
        tier: vipStatus.tier,
        expiresAt: vipStatus.expiresAt,
        badges: vipBadges,
        limits: vipLimits,
        displayBadge: vipBadges.length > 0 ? vipBadges[0] : null
      }
    };
  }

  // 为游戏数据添加VIP装饰信息
  async decorateGameWithVip(gameData: any, userId?: string) {
    const decoratedGame = {
      ...gameData,
      vip: {
        isVipOnly: gameData.isVipOnly || false,
        requiredTier: gameData.vipTier || null,
        creatorIsVip: false,
        canUserJoin: true
      }
    };

    // 如果游戏创建者信息可用，检查VIP状态
    if (gameData.creator?.id) {
      const creatorVipStatus = await this.getUserVipStatus(gameData.creator.id);
      decoratedGame.vip.creatorIsVip = creatorVipStatus.isVip;
    }

    // 如果提供了用户ID，检查用户是否可以参与
    if (userId && gameData.isVipOnly) {
      const userCanJoin = await this.vipPermissionsService.checkGameJoinPermission(userId, gameData.id);
      decoratedGame.vip.canUserJoin = userCanJoin.hasPermission;
    }

    return decoratedGame;
  }

  // 为游戏列表批量添加VIP装饰
  async decorateGamesWithVip(games: any[], userId?: string) {
    return Promise.all(
      games.map(game => this.decorateGameWithVip(game, userId))
    );
  }

  // 为团队数据添加VIP装饰信息
  async decorateTeamWithVip(teamData: any, userId?: string) {
    const decoratedTeam = {
      ...teamData,
      vip: {
        hasVipMembers: false,
        vipMemberCount: 0,
        canUserJoin: true,
        teamTier: null
      }
    };

    // 检查团队成员的VIP状态
    if (teamData.members) {
      let vipMemberCount = 0;
      let highestTier = null;

      for (const member of teamData.members) {
        const memberVipStatus = await this.getUserVipStatus(member.userId);
        if (memberVipStatus.isVip) {
          vipMemberCount++;
          if (!highestTier || this.compareVipTiers(memberVipStatus.tier, highestTier)) {
            highestTier = memberVipStatus.tier;
          }
        }
      }

      decoratedTeam.vip.hasVipMembers = vipMemberCount > 0;
      decoratedTeam.vip.vipMemberCount = vipMemberCount;
      decoratedTeam.vip.teamTier = highestTier;
    }

    // 如果提供了用户ID，检查用户是否可以加入团队
    if (userId && teamData.maxMembers) {
      const userCanJoin = await this.vipPermissionsService.checkTeamCreationPermission(userId, teamData.maxMembers);
      decoratedTeam.vip.canUserJoin = userCanJoin.hasPermission;
    }

    return decoratedTeam;
  }

  // 为用户界面添加VIP功能可用性信息
  async getVipUIDecorations(userId: string) {
    const [
      availablePermissions,
      vipThemes,
      vipBadges,
      supportStatus
    ] = await Promise.all([
      this.vipPermissionsService.getUserAvailablePermissions(userId),
      this.vipFeaturesService.getVipThemes(userId),
      this.vipFeaturesService.getVipBadges(userId),
      this.vipFeaturesService.getVipSupportStatus(userId)
    ]);

    return {
      features: {
        canCreateUnlimitedGames: availablePermissions.includes('CREATE_UNLIMITED_GAMES'),
        canCreateLargeGames: availablePermissions.includes('CREATE_LARGE_GAMES'),
        canCreatePrivateGames: availablePermissions.includes('CREATE_PRIVATE_GAMES'),
        hasAdvancedStats: availablePermissions.includes('ADVANCED_STATISTICS'),
        hasCustomTemplates: availablePermissions.includes('CUSTOM_TEMPLATES'),
        hasDataExport: availablePermissions.includes('EXPORT_DATA'),
        hasAdFreeExperience: availablePermissions.includes('AD_FREE_EXPERIENCE'),
        hasFeaturedGames: availablePermissions.includes('FEATURED_GAMES')
      },
      customization: {
        availableThemes: vipThemes,
        availableBadges: vipBadges,
        currentBadge: vipBadges.length > 0 ? vipBadges[0] : null
      },
      support: supportStatus,
      ui: {
        showVipBadge: vipBadges.length > 0,
        showPremiumFeatures: availablePermissions.length > 0,
        hideAds: availablePermissions.includes('AD_FREE_EXPERIENCE'),
        highlightProfile: availablePermissions.includes('PROFILE_HIGHLIGHT')
      }
    };
  }

  // 获取VIP功能提示信息
  async getVipFeatureHints(userId: string, feature: string) {
    const permissionCheck = await this.vipPermissionsService.checkVipPermission(userId, feature);
    
    if (permissionCheck.hasPermission) {
      return {
        available: true,
        message: '您可以使用此功能'
      };
    }

    const upgradeMessages = {
      'CREATE_UNLIMITED_GAMES': '升级到精英VIP，享受无限制创建游戏',
      'CREATE_LARGE_GAMES': '升级到高级VIP，创建大型游戏（超过20人）',
      'ADVANCED_STATISTICS': '升级到高级VIP，查看详细数据统计',
      'CUSTOM_TEMPLATES': '升级到高级VIP，使用自定义游戏模板',
      'EXPORT_DATA': '升级到精英VIP，导出您的个人数据',
      'AD_FREE_EXPERIENCE': '升级到基础VIP，享受无广告体验'
    };

    return {
      available: false,
      message: upgradeMessages[feature] || '升级VIP解锁此功能',
      requiredTier: permissionCheck.requiredTier,
      currentTier: permissionCheck.currentTier,
      upgradeRequired: permissionCheck.upgradeRequired
    };
  }

  // 检查用户是否可以访问VIP专属内容
  async canAccessVipContent(userId: string, contentType: 'GAME' | 'TEMPLATE' | 'THEME' | 'FEATURE', requiredTier?: string) {
    const userVipStatus = await this.getUserVipStatus(userId);
    
    if (!userVipStatus.isVip) {
      return {
        canAccess: false,
        reason: '需要VIP会员',
        upgradeUrl: '/vip/plans'
      };
    }

    if (requiredTier && !this.compareVipTiers(userVipStatus.tier, requiredTier)) {
      return {
        canAccess: false,
        reason: `需要${requiredTier}或更高等级`,
        upgradeUrl: '/vip/upgrade'
      };
    }

    return {
      canAccess: true,
      tier: userVipStatus.tier
    };
  }

  // 获取VIP升级建议
  async getVipUpgradeSuggestions(userId: string) {
    const [userVipStatus, currentUsage] = await Promise.all([
      this.getUserVipStatus(userId),
      this.getCurrentUsage(userId)
    ]);

    const suggestions = [];

    if (!userVipStatus.isVip) {
      suggestions.push({
        type: 'BECOME_VIP',
        title: '成为VIP会员',
        description: '解锁专属功能，享受更好的游戏体验',
        benefits: ['无广告体验', '创建私人游戏', '优先客服支持'],
        recommendedTier: 'BASIC'
      });
    } else {
      // 基于使用情况推荐升级
      if (userVipStatus.tier === 'BASIC' && currentUsage.gamesCreatedToday >= 8) {
        suggestions.push({
          type: 'UPGRADE_TIER',
          title: '升级到高级VIP',
          description: '您的游戏创建频率较高，升级可获得更多限制',
          benefits: ['更多游戏创建限制', '高级数据统计', '自定义模板'],
          recommendedTier: 'PREMIUM'
        });
      }

      if (userVipStatus.tier === 'PREMIUM' && currentUsage.isActiveUser) {
        suggestions.push({
          type: 'UPGRADE_TIER',
          title: '升级到精英VIP',
          description: '作为活跃用户，精英VIP将为您提供最佳体验',
          benefits: ['无限制创建和参与', '数据导出', '专属客服'],
          recommendedTier: 'ELITE'
        });
      }
    }

    return suggestions;
  }

  // 私有方法：获取用户VIP状态
  private async getUserVipStatus(userId: string) {
    // 简化实现，实际应该调用VipService
    return { isVip: false, tier: null, expiresAt: null };
  }

  // 私有方法：比较VIP等级
  private compareVipTiers(userTier: string | null, requiredTier: string): boolean {
    if (!userTier) return false;

    const tierLevels = {
      'BASIC': 1,
      'PREMIUM': 2,
      'ELITE': 3
    };

    return (tierLevels[userTier] || 0) >= (tierLevels[requiredTier] || 0);
  }

  // 私有方法：获取当前使用情况
  private async getCurrentUsage(userId: string) {
    // 简化实现
    return {
      gamesCreatedToday: 0,
      gamesJoinedToday: 0,
      isActiveUser: false
    };
  }
}
