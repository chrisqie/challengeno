import { PrismaClient, PointType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedShopItems() {
  console.log('开始添加商城商品...');

  const shopItems = [
    // 数字商品
    {
      name: 'VIP会员体验券',
      description: '7天VIP会员体验，享受所有VIP特权',
      category: 'digital',
      pointType: PointType.PARTICIPATION,
      pointCost: 500,
      stock: -1, // 无限库存
      sortOrder: 100,
    },
    {
      name: '积分加速卡',
      description: '获得积分时额外获得50%奖励，持续24小时',
      category: 'digital',
      pointType: PointType.TRUST,
      pointCost: 200,
      stock: -1,
      sortOrder: 90,
    },
    {
      name: '游戏创建次数+5',
      description: '增加5次每日游戏创建次数',
      category: 'digital',
      pointType: PointType.PARTICIPATION,
      pointCost: 300,
      stock: -1,
      sortOrder: 80,
    },

    // 实物商品
    {
      name: '定制马克杯',
      description: 'Bet Together专属定制马克杯，高品质陶瓷材质',
      category: 'physical',
      pointType: PointType.LABOR,
      pointCost: 1000,
      stock: 50,
      sortOrder: 70,
    },
    {
      name: '品牌T恤',
      description: 'Bet Together品牌T恤，100%纯棉，多种尺码可选',
      category: 'physical',
      pointType: PointType.LABOR,
      pointCost: 1500,
      stock: 30,
      sortOrder: 60,
    },
    {
      name: '精美笔记本',
      description: '高品质笔记本，适合记录挑战目标和心得',
      category: 'physical',
      pointType: PointType.PARTICIPATION,
      pointCost: 800,
      stock: 100,
      sortOrder: 50,
    },

    // VIP特权
    {
      name: 'VIP基础会员 1个月',
      description: '1个月VIP基础会员，享受基础VIP特权',
      category: 'vip',
      pointType: PointType.TRUST,
      pointCost: 2000,
      stock: -1,
      sortOrder: 40,
    },
    {
      name: 'VIP高级会员 1个月',
      description: '1个月VIP高级会员，享受高级VIP特权',
      category: 'vip',
      pointType: PointType.LABOR,
      pointCost: 3000,
      stock: -1,
      sortOrder: 30,
    },

    // 特殊商品
    {
      name: '专属头像框',
      description: '限量版专属头像框，彰显您的独特身份',
      category: 'special',
      pointType: PointType.TRUST,
      pointCost: 1200,
      stock: 20,
      sortOrder: 20,
    },
    {
      name: '成就徽章礼包',
      description: '包含5个稀有成就徽章，提升个人档案魅力',
      category: 'special',
      pointType: PointType.PARTICIPATION,
      pointCost: 600,
      stock: 50,
      sortOrder: 10,
    },
  ];

  for (const item of shopItems) {
    try {
      const created = await prisma.shopItem.create({
        data: item,
      });
      console.log(`✅ 创建商品: ${created.name}`);
    } catch (error) {
      console.error(`❌ 创建商品失败: ${item.name}`, error);
    }
  }

  console.log('商城商品添加完成！');
}

async function main() {
  try {
    await seedShopItems();
  } catch (error) {
    console.error('添加商城数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
