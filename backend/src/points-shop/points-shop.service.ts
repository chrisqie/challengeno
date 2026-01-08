import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'VIP' | 'PHYSICAL' | 'VIRTUAL' | 'PRIVILEGE';
  price: number;
  pointType: 'PARTICIPATION' | 'TRUST' | 'LABOR' | 'MIXED';
  icon: string;
  image?: string;
  isAvailable: boolean;
  stock?: number;
  isLimited: boolean;
  validUntil?: Date;
  requirements?: {
    minLevel?: number;
    minTrustPoints?: number;
    isVipRequired?: boolean;
  };
  benefits?: string[];
  estimatedDelivery?: string;
}

@Injectable()
export class PointsShopService {
  constructor(private prisma: PrismaService) {}

  // 获取商城商品列表
  async getShopItems(category?: string, isAvailable?: boolean): Promise<ShopItem[]> {
    // 暂时返回模拟数据，实际应该从数据库查询
    const items: ShopItem[] = [
      // VIP相关
      {
        id: 'vip_1_month',
        name: 'VIP会员 1个月',
        description: '享受1个月VIP特权，包括无限制创建游戏、专属徽章、优先客服等',
        category: 'VIP',
        price: 500,
        pointType: 'LABOR',
        icon: '👑',
        image: '/images/shop/vip-1month.png',
        isAvailable: false, // 暂时不可兑换
        isLimited: false,
        benefits: [
          '无限制创建游戏',
          'VIP专属徽章',
          '优先客服支持',
          '高级数据统计',
          '自定义主题'
        ]
      },
      {
        id: 'vip_3_month',
        name: 'VIP会员 3个月',
        description: '享受3个月VIP特权，性价比更高的选择',
        category: 'VIP',
        price: 1200,
        pointType: 'LABOR',
        icon: '💎',
        image: '/images/shop/vip-3month.png',
        isAvailable: false,
        isLimited: false,
        benefits: [
          '包含1个月VIP所有特权',
          '额外赠送专属头像框',
          '月度VIP专属活动参与权'
        ]
      },
      {
        id: 'vip_1_year',
        name: 'VIP会员 1年',
        description: '年度VIP会员，最超值的选择',
        category: 'VIP',
        price: 4000,
        pointType: 'LABOR',
        icon: '🏆',
        image: '/images/shop/vip-1year.png',
        isAvailable: false,
        isLimited: false,
        benefits: [
          '包含所有VIP特权',
          '年度专属纪念徽章',
          '优先体验新功能',
          '年度VIP聚会邀请'
        ]
      },

      // 实物商品
      {
        id: 'mug_classic',
        name: 'BetTogether 经典马克杯',
        description: '高品质陶瓷马克杯，印有BetTogether经典Logo',
        category: 'PHYSICAL',
        price: 800,
        pointType: 'PARTICIPATION',
        icon: '☕',
        image: '/images/shop/mug-classic.png',
        isAvailable: false,
        stock: 100,
        isLimited: true,
        estimatedDelivery: '7-14个工作日',
        benefits: [
          '高品质陶瓷材质',
          '容量350ml',
          '洗碗机安全',
          '精美包装'
        ]
      },
      {
        id: 'tshirt_logo',
        name: 'BetTogether Logo T恤',
        description: '100%纯棉T恤，舒适透气，多种尺码可选',
        category: 'PHYSICAL',
        price: 1500,
        pointType: 'PARTICIPATION',
        icon: '👕',
        image: '/images/shop/tshirt-logo.png',
        isAvailable: false,
        stock: 50,
        isLimited: true,
        estimatedDelivery: '7-14个工作日',
        benefits: [
          '100%纯棉材质',
          '多种尺码(S-XXL)',
          '高品质印刷',
          '舒适版型'
        ]
      },
      {
        id: 'sticker_pack',
        name: 'BetTogether 贴纸套装',
        description: '精美贴纸套装，包含10张不同设计的防水贴纸',
        category: 'PHYSICAL',
        price: 300,
        pointType: 'PARTICIPATION',
        icon: '🏷️',
        image: '/images/shop/sticker-pack.png',
        isAvailable: false,
        stock: 200,
        isLimited: true,
        estimatedDelivery: '3-7个工作日',
        benefits: [
          '10张精美贴纸',
          '防水材质',
          '多种设计',
          '适合装饰笔记本、手机等'
        ]
      },

      // 虚拟特权
      {
        id: 'game_pin_1',
        name: '游戏置顶 1次',
        description: '将你的游戏置顶显示24小时，获得更多关注',
        category: 'PRIVILEGE',
        price: 200,
        pointType: 'TRUST',
        icon: '📌',
        isAvailable: false,
        isLimited: false,
        benefits: [
          '游戏置顶24小时',
          '增加曝光度',
          '吸引更多参与者'
        ]
      },
      {
        id: 'game_pin_5',
        name: '游戏置顶 5次套餐',
        description: '5次游戏置顶机会，更优惠的价格',
        category: 'PRIVILEGE',
        price: 800,
        pointType: 'TRUST',
        icon: '📌',
        isAvailable: false,
        isLimited: false,
        benefits: [
          '5次置顶机会',
          '每次置顶24小时',
          '比单次购买节省20%'
        ]
      },
      {
        id: 'custom_badge',
        name: '自定义徽章',
        description: '设计专属个人徽章，展示你的独特个性',
        category: 'VIRTUAL',
        price: 1000,
        pointType: 'TRUST',
        icon: '🎖️',
        isAvailable: false,
        isLimited: false,
        requirements: {
          minLevel: 5,
          minTrustPoints: 500
        },
        benefits: [
          '专属个人徽章',
          '个性化设计',
          '永久展示',
          '彰显身份'
        ]
      },
      {
        id: 'username_color',
        name: '彩色用户名',
        description: '让你的用户名显示为特殊颜色，更加醒目',
        category: 'VIRTUAL',
        price: 600,
        pointType: 'PARTICIPATION',
        icon: '🌈',
        isAvailable: false,
        isLimited: false,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天有效
        benefits: [
          '用户名特殊颜色',
          '30天有效期',
          '多种颜色可选',
          '增加个人辨识度'
        ]
      },

      // 功能增强
      {
        id: 'extra_daily_games',
        name: '额外每日游戏次数 +5',
        description: '增加5次每日游戏创建次数，持续7天',
        category: 'PRIVILEGE',
        price: 400,
        pointType: 'PARTICIPATION',
        icon: '🎮',
        isAvailable: false,
        isLimited: false,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天有效
        benefits: [
          '每日游戏次数+5',
          '持续7天',
          '创建更多游戏',
          '提升活跃度'
        ]
      },
      {
        id: 'priority_support',
        name: '优先客服支持',
        description: '享受优先客服支持，问题更快解决',
        category: 'PRIVILEGE',
        price: 300,
        pointType: 'TRUST',
        icon: '🎧',
        isAvailable: false,
        isLimited: false,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天有效
        benefits: [
          '优先客服响应',
          '30天有效期',
          '专属客服通道',
          '问题快速解决'
        ]
      }
    ];

    let filteredItems = items;

    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    if (isAvailable !== undefined) {
      filteredItems = filteredItems.filter(item => item.isAvailable === isAvailable);
    }

    return filteredItems;
  }

  // 获取商品详情
  async getShopItem(itemId: string): Promise<ShopItem | null> {
    const items = await this.getShopItems();
    return items.find(item => item.id === itemId) || null;
  }

  // 检查用户是否可以兑换商品
  async canUserRedeemItem(userId: string, itemId: string): Promise<{
    canRedeem: boolean;
    reason?: string;
    userPoints?: any;
    requirements?: any;
  }> {
    const item = await this.getShopItem(itemId);
    if (!item) {
      return { canRedeem: false, reason: '商品不存在' };
    }

    if (!item.isAvailable) {
      return { canRedeem: false, reason: '商品暂时不可兑换' };
    }

    // 获取用户积分
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        participationPoints: true,
        trustPoints: true,
        laborPoints: true,
        isVip: true,
        totalGamesCreated: true,
        totalGamesJoined: true,
      }
    });

    if (!user) {
      return { canRedeem: false, reason: '用户不存在' };
    }

    // 检查积分是否足够
    let userPointsForItem = 0;
    switch (item.pointType) {
      case 'PARTICIPATION':
        userPointsForItem = user.participationPoints;
        break;
      case 'TRUST':
        userPointsForItem = user.trustPoints;
        break;
      case 'LABOR':
        userPointsForItem = user.laborPoints;
        break;
      case 'MIXED':
        userPointsForItem = user.participationPoints + user.laborPoints; // 信任积分不用于兑换
        break;
    }

    if (userPointsForItem < item.price) {
      return {
        canRedeem: false,
        reason: `${item.pointType}积分不足，需要${item.price}分，当前${userPointsForItem}分`,
        userPoints: {
          participation: user.participationPoints,
          trust: user.trustPoints,
          labor: user.laborPoints,
          required: item.price,
          type: item.pointType
        }
      };
    }

    // 检查其他要求
    if (item.requirements) {
      const { minLevel, minTrustPoints, isVipRequired } = item.requirements;

      if (minTrustPoints && user.trustPoints < minTrustPoints) {
        return {
          canRedeem: false,
          reason: `信任积分不足，需要${minTrustPoints}分，当前${user.trustPoints}分`
        };
      }

      if (isVipRequired && !user.isVip) {
        return {
          canRedeem: false,
          reason: '需要VIP会员才能兑换此商品'
        };
      }

      // 简单的等级计算（基于总游戏数）
      const userLevel = Math.floor((user.totalGamesCreated + user.totalGamesJoined) / 10) + 1;
      if (minLevel && userLevel < minLevel) {
        return {
          canRedeem: false,
          reason: `等级不足，需要${minLevel}级，当前${userLevel}级`
        };
      }
    }

    return { canRedeem: true };
  }

  // 兑换商品（暂时只记录，不实际扣除积分）
  async redeemItem(userId: string, itemId: string): Promise<{
    success: boolean;
    message: string;
    orderId?: string;
  }> {
    const canRedeem = await this.canUserRedeemItem(userId, itemId);
    
    if (!canRedeem.canRedeem) {
      return {
        success: false,
        message: canRedeem.reason || '无法兑换此商品'
      };
    }

    const item = await this.getShopItem(itemId);
    if (!item) {
      return {
        success: false,
        message: '商品不存在'
      };
    }

    // 暂时只返回成功消息，不实际扣除积分
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      message: `兑换申请已提交！订单号：${orderId}。由于功能正在完善中，积分暂未扣除，我们会尽快处理您的兑换申请。`,
      orderId
    };
  }

  // 获取用户兑换历史
  async getUserRedemptionHistory(userId: string): Promise<any[]> {
    // 暂时返回空数组，实际应该从数据库查询
    return [];
  }

  // 获取商城统计信息
  async getShopStats(): Promise<{
    totalItems: number;
    availableItems: number;
    categories: Array<{ category: string; count: number }>;
    popularItems: Array<{ itemId: string; name: string; redemptions: number }>;
  }> {
    const items = await this.getShopItems();
    
    const categories = items.reduce((acc, item) => {
      const existing = acc.find(c => c.category === item.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ category: item.category, count: 1 });
      }
      return acc;
    }, [] as Array<{ category: string; count: number }>);

    return {
      totalItems: items.length,
      availableItems: items.filter(item => item.isAvailable).length,
      categories,
      popularItems: [
        { itemId: 'vip_1_month', name: 'VIP会员 1个月', redemptions: 0 },
        { itemId: 'game_pin_1', name: '游戏置顶 1次', redemptions: 0 },
        { itemId: 'mug_classic', name: 'BetTogether 经典马克杯', redemptions: 0 }
      ]
    };
  }
}
