import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VipTier } from '@prisma/client';

@Injectable()
export class VipAdminService {
  constructor(private prisma: PrismaService) {}

  // 获取VIP统计数据
  async getVipStatistics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalVipUsers,
      activeVipUsers,
      newVipThisMonth,
      newVipThisWeek,
      expiringVipUsers,
      vipByTier,
      monthlyRevenue
    ] = await Promise.all([
      // 总VIP用户数
      this.prisma.user.count({
        where: { isVip: true }
      }),
      
      // 活跃VIP用户数（VIP未过期）
      this.prisma.user.count({
        where: {
          isVip: true,
          OR: [
            { vipExpiresAt: null },
            { vipExpiresAt: { gt: now } }
          ]
        }
      }),
      
      // 本月新增VIP用户
      this.prisma.vipSubscription.count({
        where: {
          createdAt: { gte: startOfMonth }
        }
      }),
      
      // 本周新增VIP用户
      this.prisma.vipSubscription.count({
        where: {
          createdAt: { gte: startOfWeek }
        }
      }),
      
      // 即将过期的VIP用户（7天内）
      this.prisma.user.count({
        where: {
          isVip: true,
          vipExpiresAt: {
            gte: now,
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // 按等级统计VIP用户
      this.prisma.vipSubscription.groupBy({
        by: ['tier'],
        where: {
          isActive: true,
          endDate: { gt: now }
        },
        _count: { tier: true }
      }),
      
      // 本月VIP收入
      this.prisma.vipSubscription.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          paymentAmount: { not: null }
        },
        _sum: { paymentAmount: true }
      })
    ]);

    return {
      overview: {
        totalVipUsers,
        activeVipUsers,
        newVipThisMonth,
        newVipThisWeek,
        expiringVipUsers
      },
      tierDistribution: vipByTier.reduce((acc, item) => {
        acc[item.tier] = item._count.tier;
        return acc;
      }, {} as Record<VipTier, number>),
      revenue: {
        thisMonth: monthlyRevenue._sum.paymentAmount || 0,
        currency: 'CNY'
      },
      generatedAt: now
    };
  }

  // 获取VIP用户列表
  async getVipUsers(page: number = 1, limit: number = 20, tier?: VipTier, status?: 'ACTIVE' | 'EXPIRED' | 'ALL') {
    const skip = (page - 1) * limit;
    const now = new Date();

    let whereClause: any = { isVip: true };

    // 按状态筛选
    if (status === 'ACTIVE') {
      whereClause.OR = [
        { vipExpiresAt: null },
        { vipExpiresAt: { gt: now } }
      ];
    } else if (status === 'EXPIRED') {
      whereClause.vipExpiresAt = { lte: now };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      include: {
        vipSubscriptions: {
          where: {
            isActive: true,
            ...(tier && { tier })
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await this.prisma.user.count({ where: whereClause });

    return {
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isVip: user.isVip,
        vipExpiresAt: user.vipExpiresAt,
        currentTier: user.vipSubscriptions[0]?.tier || null,
        subscriptionStartDate: user.vipSubscriptions[0]?.startDate || null,
        isActive: !user.vipExpiresAt || user.vipExpiresAt > now,
        daysRemaining: user.vipExpiresAt ? 
          Math.max(0, Math.ceil((user.vipExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 
          null
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 延长用户VIP
  async extendVipSubscription(userId: string, days: number, reason?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isVip: true, vipExpiresAt: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const now = new Date();
    const currentExpiry = user.vipExpiresAt || now;
    const newExpiry = new Date(Math.max(currentExpiry.getTime(), now.getTime()) + days * 24 * 60 * 60 * 1000);

    // 更新用户VIP状态
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVip: true,
        vipExpiresAt: newExpiry
      }
    });

    // 记录操作日志
    await this.createAdminAction('EXTEND_VIP', userId, {
      days,
      reason,
      oldExpiry: user.vipExpiresAt,
      newExpiry
    });

    return {
      message: `成功延长用户 ${user.username} 的VIP ${days} 天`,
      newExpiryDate: newExpiry
    };
  }

  // 升级用户VIP等级
  async upgradeVipTier(userId: string, newTier: VipTier, reason?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        vipSubscriptions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (!user.isVip) {
      throw new ForbiddenException('用户不是VIP，无法升级等级');
    }

    const currentSubscription = user.vipSubscriptions[0];
    
    if (currentSubscription) {
      // 停用当前订阅
      await this.prisma.vipSubscription.update({
        where: { id: currentSubscription.id },
        data: { isActive: false }
      });
    }

    // 创建新的订阅记录
    const newSubscription = await this.prisma.vipSubscription.create({
      data: {
        userId,
        tier: newTier,
        startDate: new Date(),
        endDate: user.vipExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        paymentAmount: 0,
        paymentMethod: 'ADMIN_UPGRADE'
      }
    });

    // 记录操作日志
    await this.createAdminAction('UPGRADE_VIP_TIER', userId, {
      oldTier: currentSubscription?.tier,
      newTier,
      reason
    });

    return {
      message: `成功将用户 ${user.username} 的VIP等级升级为 ${newTier}`,
      subscription: newSubscription
    };
  }

  // 撤销用户VIP
  async revokeVipStatus(userId: string, reason: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isVip: true }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (!user.isVip) {
      throw new ForbiddenException('用户不是VIP');
    }

    // 更新用户状态
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isVip: false,
        vipExpiresAt: new Date() // 设置为当前时间，表示已过期
      }
    });

    // 停用所有活跃订阅
    await this.prisma.vipSubscription.updateMany({
      where: {
        userId,
        isActive: true
      },
      data: { isActive: false }
    });

    // 记录操作日志
    await this.createAdminAction('REVOKE_VIP', userId, { reason });

    return {
      message: `成功撤销用户 ${user.username} 的VIP状态`,
      reason
    };
  }

  // 批量操作VIP用户
  async batchVipOperation(
    userIds: string[], 
    operation: 'EXTEND' | 'UPGRADE' | 'REVOKE',
    params: any
  ) {
    const results = [];

    for (const userId of userIds) {
      try {
        let result;
        switch (operation) {
          case 'EXTEND':
            result = await this.extendVipSubscription(userId, params.days, params.reason);
            break;
          case 'UPGRADE':
            result = await this.upgradeVipTier(userId, params.tier, params.reason);
            break;
          case 'REVOKE':
            result = await this.revokeVipStatus(userId, params.reason);
            break;
          default:
            throw new Error('无效的操作类型');
        }
        results.push({ userId, success: true, result });
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }

    return {
      operation,
      totalUsers: userIds.length,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
      results
    };
  }

  // 获取VIP收入报告
  async getVipRevenueReport(startDate: Date, endDate: Date) {
    const subscriptions = await this.prisma.vipSubscription.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        paymentAmount: { not: null }
      },
      include: {
        user: {
          select: { username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalRevenue = subscriptions.reduce((sum, sub) => 
      sum + (sub.paymentAmount ? Number(sub.paymentAmount) : 0), 0
    );

    const revenueByTier = subscriptions.reduce((acc, sub) => {
      const tier = sub.tier;
      const amount = Number(sub.paymentAmount) || 0;
      acc[tier] = (acc[tier] || 0) + amount;
      return acc;
    }, {} as Record<VipTier, number>);

    return {
      period: { startDate, endDate },
      totalRevenue,
      totalSubscriptions: subscriptions.length,
      revenueByTier,
      averageRevenuePerSubscription: subscriptions.length > 0 ? totalRevenue / subscriptions.length : 0,
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        username: sub.user.username,
        tier: sub.tier,
        amount: Number(sub.paymentAmount),
        createdAt: sub.createdAt
      }))
    };
  }

  // 获取即将过期的VIP用户
  async getExpiringVipUsers(days: number = 7) {
    const now = new Date();
    const expiryThreshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const users = await this.prisma.user.findMany({
      where: {
        isVip: true,
        vipExpiresAt: {
          gte: now,
          lte: expiryThreshold
        }
      },
      include: {
        vipSubscriptions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { vipExpiresAt: 'asc' }
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      currentTier: user.vipSubscriptions[0]?.tier,
      expiresAt: user.vipExpiresAt,
      daysRemaining: Math.ceil((user.vipExpiresAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }));
  }

  // 创建管理员操作记录
  private async createAdminAction(action: string, targetUserId: string, details: any) {
    try {
      // 这里可以创建管理员操作日志
      console.log(`Admin action: ${action} for user ${targetUserId}`, details);
    } catch (error) {
      console.error('Failed to create admin action log:', error);
    }
  }
}
