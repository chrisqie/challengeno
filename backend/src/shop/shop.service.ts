import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { PointType, ExchangeStatus } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  // 获取商城商品列表
  async getShopItems(category?: string) {
    const where: any = { isActive: true };

    if (category && category !== 'all') {
      where.category = category;
    }

    // 先检查数据库中是否有商品，如果没有则创建示例商品
    const existingItems = await this.prisma.shopItem.count();
    if (existingItems === 0) {
      await this.createSampleItems();
    }

    const items = await this.prisma.shopItem.findMany({
      where,
      orderBy: [
        { sortOrder: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return { items };
  }

  // 创建示例商品
  private async createSampleItems() {
    const sampleItems = [
      // VIP会员类
      {
        name: 'VIP会员 1个月',
        description: '享受1个月VIP特权，包括无限制创建游戏、专属徽章、优先客服等',
        category: 'VIP',
        pointType: 'LABOR' as PointType,
        pointCost: 500,
        stock: -1,
        sortOrder: 100,
      },
      {
        name: 'VIP会员 3个月',
        description: '享受3个月VIP特权，性价比更高的选择',
        category: 'VIP',
        pointType: 'LABOR' as PointType,
        pointCost: 1200,
        stock: -1,
        sortOrder: 99,
      },
      {
        name: 'VIP会员 1年',
        description: '年度VIP会员，最超值的选择',
        category: 'VIP',
        pointType: 'LABOR' as PointType,
        pointCost: 4000,
        stock: -1,
        sortOrder: 98,
      },

      // 实物商品类
      {
        name: 'BetTogether 经典马克杯',
        description: '高品质陶瓷马克杯，印有BetTogether经典Logo',
        category: 'PHYSICAL',
        pointType: 'PARTICIPATION' as PointType,
        pointCost: 800,
        stock: 100,
        sortOrder: 90,
      },
      {
        name: 'BetTogether Logo T恤',
        description: '100%纯棉T恤，舒适透气，多种尺码可选',
        category: 'PHYSICAL',
        pointType: 'PARTICIPATION' as PointType,
        pointCost: 1500,
        stock: 50,
        sortOrder: 89,
      },
      {
        name: 'BetTogether 贴纸套装',
        description: '精美贴纸套装，包含10张不同设计的防水贴纸',
        category: 'PHYSICAL',
        pointType: 'PARTICIPATION' as PointType,
        pointCost: 300,
        stock: 200,
        sortOrder: 88,
      },

      // 虚拟物品类
      {
        name: '自定义徽章',
        description: '设计专属个人徽章，展示你的独特个性',
        category: 'VIRTUAL',
        pointType: 'TRUST' as PointType,
        pointCost: 1000,
        stock: -1,
        sortOrder: 80,
      },
      {
        name: '彩色用户名',
        description: '让你的用户名显示为特殊颜色，更加醒目',
        category: 'VIRTUAL',
        pointType: 'PARTICIPATION' as PointType,
        pointCost: 600,
        stock: -1,
        sortOrder: 79,
      },

      // 特权功能类
      {
        name: '游戏置顶 1次',
        description: '将你的游戏置顶显示24小时，获得更多关注',
        category: 'PRIVILEGE',
        pointType: 'TRUST' as PointType,
        pointCost: 200,
        stock: -1,
        sortOrder: 70,
      },
      {
        name: '游戏置顶 5次套餐',
        description: '5次游戏置顶机会，更优惠的价格',
        category: 'PRIVILEGE',
        pointType: 'TRUST' as PointType,
        pointCost: 800,
        stock: -1,
        sortOrder: 69,
      },
      {
        name: '额外每日游戏次数 +5',
        description: '增加5次每日游戏创建次数，持续7天',
        category: 'PRIVILEGE',
        pointType: 'PARTICIPATION' as PointType,
        pointCost: 400,
        stock: -1,
        sortOrder: 68,
      },
      {
        name: '优先客服支持',
        description: '享受优先客服支持，问题更快解决',
        category: 'PRIVILEGE',
        pointType: 'TRUST' as PointType,
        pointCost: 300,
        stock: -1,
        sortOrder: 67,
      },
    ];

    for (const item of sampleItems) {
      await this.prisma.shopItem.create({
        data: item,
      });
    }

    console.log('✅ 已创建示例商城商品');
  }

  // 获取商品分类
  async getCategories() {
    const categories = await this.prisma.shopItem.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
    });

    return {
      categories: categories.map(cat => ({
        name: cat.category,
        count: cat._count.category,
      })),
    };
  }

  // 获取单个商品详情
  async getShopItem(itemId: string) {
    const item = await this.prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('商品不存在');
    }

    if (!item.isActive) {
      throw new BadRequestException('商品已下架');
    }

    return item;
  }

  // 兑换商品
  async exchangeItem(userId: string, itemId: string, deliveryInfo?: string) {
    // 获取商品信息
    const item = await this.getShopItem(itemId);

    // 检查库存
    if (item.stock !== -1 && item.stock <= 0) {
      throw new BadRequestException('商品库存不足');
    }

    // 获取用户信息
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查用户积分是否足够
    let userPoints = 0;
    switch (item.pointType) {
      case PointType.PARTICIPATION:
        userPoints = user.participationPoints;
        break;
      case PointType.TRUST:
        userPoints = user.trustPoints;
        break;
      case PointType.LABOR:
        userPoints = user.laborPoints;
        break;
    }

    if (userPoints < item.pointCost) {
      throw new BadRequestException('积分不足');
    }

    // 开始事务
    const result = await this.prisma.$transaction(async (tx) => {
      // 创建兑换记录
      const exchange = await tx.shopExchange.create({
        data: {
          userId,
          itemId,
          pointType: item.pointType,
          pointCost: item.pointCost,
          status: ExchangeStatus.PENDING,
          deliveryInfo,
        },
        include: {
          item: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      // 扣除用户积分
      await this.pointsService.updateUserPoints(
        userId,
        item.pointType,
        -item.pointCost,
        `兑换商品: ${item.name}`,
      );

      // 减少库存（如果不是无限库存）
      if (item.stock !== -1) {
        await tx.shopItem.update({
          where: { id: itemId },
          data: { stock: { decrement: 1 } },
        });
      }

      return exchange;
    });

    return {
      success: true,
      exchange: result,
      message: '兑换成功！',
    };
  }

  // 获取用户兑换历史
  async getUserExchanges(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [exchanges, total] = await Promise.all([
      this.prisma.shopExchange.findMany({
        where: { userId },
        include: {
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.shopExchange.count({
        where: { userId },
      }),
    ]);

    return {
      exchanges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 获取用户积分余额
  async getUserPointsBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      participationPoints: user.participationPoints,
      trustPoints: user.trustPoints,
      laborPoints: user.laborPoints,
      total: user.participationPoints + user.laborPoints, // 信任积分不计入可用积分
    };
  }

  // 管理员：添加商品
  async createShopItem(data: {
    name: string;
    description?: string;
    image?: string;
    category: string;
    pointType: PointType;
    pointCost: number;
    stock?: number;
    sortOrder?: number;
  }) {
    const item = await this.prisma.shopItem.create({
      data: {
        ...data,
        stock: data.stock ?? -1,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    return item;
  }

  // 管理员：更新商品
  async updateShopItem(itemId: string, data: any) {
    const item = await this.prisma.shopItem.update({
      where: { id: itemId },
      data,
    });

    return item;
  }

  // 管理员：删除商品
  async deleteShopItem(itemId: string) {
    await this.prisma.shopItem.delete({
      where: { id: itemId },
    });

    return { success: true, message: '商品已删除' };
  }

  // 管理员：获取所有兑换记录
  async getAllExchanges(page = 1, limit = 20, status?: ExchangeStatus) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [exchanges, total] = await Promise.all([
      this.prisma.shopExchange.findMany({
        where,
        include: {
          item: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.shopExchange.count({ where }),
    ]);

    return {
      exchanges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 管理员：更新兑换状态
  async updateExchangeStatus(exchangeId: string, status: ExchangeStatus, notes?: string) {
    const exchange = await this.prisma.shopExchange.update({
      where: { id: exchangeId },
      data: { status, notes },
      include: {
        item: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // 如果取消兑换，退还积分
    if (status === ExchangeStatus.CANCELLED) {
      await this.pointsService.updateUserPoints(
        exchange.userId,
        exchange.pointType,
        exchange.pointCost,
        `兑换取消退还: ${exchange.item.name}`,
      );

      // 恢复库存
      if (exchange.item.stock !== -1) {
        await this.prisma.shopItem.update({
          where: { id: exchange.itemId },
          data: { stock: { increment: 1 } },
        });
      }
    }

    return exchange;
  }

  // 获取商城统计数据
  async getShopStats() {
    const [
      totalItems,
      totalExchanges,
      pendingExchanges,
      totalPointsSpent,
    ] = await Promise.all([
      this.prisma.shopItem.count({ where: { isActive: true } }),
      this.prisma.shopExchange.count(),
      this.prisma.shopExchange.count({ where: { status: ExchangeStatus.PENDING } }),
      this.prisma.shopExchange.aggregate({
        _sum: { pointCost: true },
        where: { status: { not: ExchangeStatus.CANCELLED } },
      }),
    ]);

    return {
      totalItems,
      totalExchanges,
      pendingExchanges,
      totalPointsSpent: totalPointsSpent._sum.pointCost || 0,
    };
  }
}
