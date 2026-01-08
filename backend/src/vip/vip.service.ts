import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVipSubscriptionDto } from './dto/create-vip-subscription.dto';
import { VipTier } from '@prisma/client';

@Injectable()
export class VipService {
  constructor(private prisma: PrismaService) {}

  // VIP Plan Configuration - Returns translation keys for frontend i18n
  private vipPlans: Record<VipTier, any> = {
    BASIC: {
      nameKey: 'vipPlans.basic.name', // Translation key instead of hardcoded text
      price: 9.9,
      duration: 30, // days
      benefitKeys: [
        'vipPlans.basic.benefit1',
        'vipPlans.basic.benefit2',
        'vipPlans.basic.benefit3',
        'vipPlans.basic.benefit4',
      ],
      features: {
        maxDailyGames: 10,
        maxDailyJoins: 25,
        prioritySupport: true,
        memberBadge: true,
      },
    },
    PREMIUM: {
      nameKey: 'vipPlans.premium.name',
      price: 19.9,
      duration: 30,
      benefitKeys: [
        'vipPlans.premium.benefit1',
        'vipPlans.premium.benefit2',
        'vipPlans.premium.benefit3',
        'vipPlans.premium.benefit4',
        'vipPlans.premium.benefit5',
        'vipPlans.premium.benefit6',
      ],
      features: {
        maxDailyGames: 15,
        maxDailyJoins: 35,
        prioritySupport: true,
        memberBadge: true,
        advancedStats: true,
        customTemplates: true,
      },
    },
    ELITE: {
      nameKey: 'vipPlans.elite.name',
      price: 39.9,
      duration: 30,
      benefitKeys: [
        'vipPlans.elite.benefit1',
        'vipPlans.elite.benefit2',
        'vipPlans.elite.benefit3',
        'vipPlans.elite.benefit4',
        'vipPlans.elite.benefit5',
        'vipPlans.elite.benefit6',
        'vipPlans.elite.benefit7',
        'vipPlans.elite.benefit8',
      ],
      features: {
        maxDailyGames: -1, // -1 means unlimited
        maxDailyJoins: -1,
        prioritySupport: true,
        memberBadge: true,
        advancedStats: true,
        customTemplates: true,
        privateRooms: true,
        featuredGames: true,
      },
    },
  };

  async getVipPlans() {
    return {
      plans: this.vipPlans,
      currency: 'CNY',
    };
  }

  async getUserVipStatus(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isVip: true,
        vipExpiresAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 查找活跃的VIP订阅 - 暂时注释掉，使用简化版本
    const activeSubscription = null; // await this.prisma.vipSubscription.findFirst({
      // where: {
      //   userId,
      //   isActive: true,
      //   endDate: { gt: new Date() }
      // },
      // orderBy: { endDate: 'desc' },
    // });

    const isVipActive = user.isVip && user.vipExpiresAt && user.vipExpiresAt > new Date();

    return {
      isVip: isVipActive,
      tier: activeSubscription?.tier || null,
      expiresAt: user.vipExpiresAt,
      benefits: activeSubscription ? this.vipPlans[activeSubscription.tier]?.benefits || [] : [],
      features: activeSubscription ? this.vipPlans[activeSubscription.tier]?.features || {} : {},
    };
  }

  async createVipSubscription(userId: string, createVipSubscriptionDto: CreateVipSubscriptionDto) {
    const { tier, paymentMethod } = createVipSubscriptionDto;

    const plan = this.vipPlans[tier];
    if (!plan) {
      throw new BadRequestException('无效的VIP套餐');
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    // 创建VIP订阅记录 - 暂时简化
    // const subscription = await this.prisma.vipSubscription.create({
    //   data: {
    //     userId,
    //     tier,
    //     startDate,
    //     endDate,
    //     paymentAmount: plan.price,
    //     paymentMethod,
    //   },
    // });

    // 更新用户VIP状态
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVip: true,
        vipExpiresAt: endDate,
        // 更新用户限制
        dailyGameLimit: plan.features.maxDailyGames === -1 ? 999 : plan.features.maxDailyGames,
      },
    });

    // 发送VIP购买成功通知
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          type: 'GAME_COMPLETED', // 暂时使用现有的枚举值
          title: 'notifications.messages.vipPurchased.title',
          message: 'notifications.messages.vipPurchased.message',
          data: {
            planName: plan.name,
            expiresAt: endDate.toLocaleDateString(),
          } as any,
          isRead: false,
        },
      });
    } catch (error) {
      // 通知创建失败不影响主流程
      console.error('创建VIP购买通知失败:', error);
    }

    return {
      // subscription,
      message: `${plan.name}购买成功！`,
      expiresAt: endDate,
    };
  }

  async getVipBenefits(tier?: string) {
    if (tier && this.vipPlans[tier as VipTier]) {
      return {
        tier,
        benefits: this.vipPlans[tier as VipTier].benefits,
        features: this.vipPlans[tier as VipTier].features,
      };
    }

    return {
      allTiers: Object.entries(this.vipPlans).map(([key, value]) => ({
        tier: key,
        name: value.name,
        benefits: value.benefits,
        features: value.features,
      })),
    };
  }

  async getUserVipHistory(userId: string) {
    // 暂时返回空数组
    const subscriptions: any[] = [];
    // const subscriptions = await this.prisma.vipSubscription.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: 'desc' },
    // });

    return {
      subscriptions: subscriptions.map((sub: any) => ({
        ...sub,
        planName: this.vipPlans[sub.tier]?.name,
      })),
    };
  }

  async checkVipFeature(userId: string, feature: string) {
    const vipStatus = await this.getUserVipStatus(userId);

    if (!vipStatus.isVip) {
      return {
        hasAccess: false,
        reason: '需要VIP会员',
        upgradeRequired: true,
      };
    }

    const hasFeature = vipStatus.features[feature] === true;

    return {
      hasAccess: hasFeature,
      tier: vipStatus.tier,
      feature,
    };
  }

  // 获取用户VIP使用统计
  async getUserVipUsage(userId: string): Promise<any> {
    const vipStatus = await this.getUserVipStatus(userId);

    if (!vipStatus.isVip) {
      return {
        isVip: false,
      } as any;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 统计今日使用情况
    const [todayGamesCreated, todayGamesJoined] = await Promise.all([
      this.prisma.betGame.count({
        where: {
          creatorId: userId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      this.prisma.betParticipant.count({
        where: {
          userId: userId,
          joinedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    const features = vipStatus.features as any;
    const maxDailyGames = features?.maxDailyGames === -1 ? '无限制' : features?.maxDailyGames || 0;
    const maxDailyJoins = features?.maxDailyJoins === -1 ? '无限制' : features?.maxDailyJoins || 0;

    return {
      isVip: true,
      tier: vipStatus.tier,
      expiresAt: vipStatus.expiresAt,
      usage: {
        todayGamesCreated,
        todayGamesJoined,
        maxDailyGames,
        maxDailyJoins,
        remainingGames: (features as any)?.maxDailyGames === -1 ? '无限制' : Math.max(0, ((features as any)?.maxDailyGames || 0) - todayGamesCreated),
        remainingJoins: (features as any)?.maxDailyJoins === -1 ? '无限制' : Math.max(0, ((features as any)?.maxDailyJoins || 0) - todayGamesJoined),
      },
      features,
    };
  }

  // 发送VIP到期提醒
  async sendVipExpiryReminders() {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    // 查找即将到期的VIP用户
    const expiringUsers = await this.prisma.user.findMany({
      where: {
        isVip: true,
        vipExpiresAt: {
          gte: new Date(),
          lte: threeDaysFromNow,
        },
      },
      select: {
        id: true,
        username: true,
        vipExpiresAt: true,
      },
    });

    for (const user of expiringUsers) {
      const daysLeft = Math.ceil((user.vipExpiresAt!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

      try {
        await this.prisma.notification.create({
          data: {
            userId: user.id,
            type: 'GAME_COMPLETED', // 暂时使用现有的枚举值
            title: 'notifications.messages.vipExpiring.title',
            message: 'notifications.messages.vipExpiring.message',
            data: {
              daysLeft: daysLeft.toString(),
            } as any,
            isRead: false,
          },
        });
      } catch (error) {
        console.error(`发送VIP到期提醒失败 - 用户${user.username}:`, error);
      }
    }

    return {
      remindersSent: expiringUsers.length,
      message: `已发送${expiringUsers.length}条VIP到期提醒`,
    };
  }

  // 检查并更新过期的VIP
  async checkExpiredVip() {
    const expiredUsers = await this.prisma.user.findMany({
      where: {
        isVip: true,
        vipExpiresAt: {
          lt: new Date(),
        },
      },
    });

    if (expiredUsers.length > 0) {
      await this.prisma.user.updateMany({
        where: {
          id: { in: expiredUsers.map(u => u.id) },
        },
        data: {
          isVip: false,
          vipExpiresAt: null,
          dailyGameLimit: 5, // 恢复默认限制
        },
      });

      // 停用过期的订阅 - 暂时注释
      // await this.prisma.vipSubscription.updateMany({
      //   where: {
      //     userId: { in: expiredUsers.map(u => u.id) },
      //     isActive: true,
      //     endDate: { lt: new Date() },
      //   },
      //   data: {
      //     isActive: false,
      //   },
      // });
    }

    return {
      expiredCount: expiredUsers.length,
    };
  }

  // 管理员升级用户VIP (用于测试)
  async upgradeUserVip(username: string, tier: VipTier, durationDays: number) {
    const user = await this.prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // 更新用户VIP状态
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVip: true,
        vipExpiresAt: expiresAt
      }
    });

    // 创建VIP订阅记录
    await this.prisma.vipSubscription.create({
      data: {
        userId: user.id,
        tier: tier,
        startDate: new Date(),
        endDate: expiresAt,
        isActive: true,
        paymentAmount: 0, // 测试用，免费
        paymentMethod: 'ADMIN_UPGRADE'
      }
    });

    return {
      success: true,
      message: `用户 ${username} 已升级为 ${tier} VIP，有效期至 ${expiresAt.toLocaleDateString()}`,
      user: {
        username: updatedUser.username,
        isVip: updatedUser.isVip,
        vipExpiresAt: updatedUser.vipExpiresAt
      }
    };
  }
}
