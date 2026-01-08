import { PrismaClient, AchievementCategory, AchievementType, AchievementRarity, PointType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAchievements() {
  console.log('开始添加成就数据...');

  const achievements = [
    // 参与类成就
    {
      name: '新手挑战者',
      description: '完成第一个挑战游戏',
      icon: '🎯',
      category: AchievementCategory.PARTICIPATION,
      type: AchievementType.SPECIAL,
      condition: {
        type: 'special',
        field: 'firstParticipation',
        target: 1,
      },
      reward: {
        points: {
          type: PointType.PARTICIPATION,
          amount: 50,
        },
      },
      rarity: AchievementRarity.COMMON,
      sortOrder: 100,
    },
    {
      name: '挑战达人',
      description: '完成10个挑战游戏',
      icon: '🏆',
      category: AchievementCategory.PARTICIPATION,
      type: AchievementType.COUNT,
      condition: {
        type: 'count',
        field: 'gamesCompleted',
        target: 10,
      },
      reward: {
        points: {
          type: PointType.PARTICIPATION,
          amount: 200,
        },
      },
      rarity: AchievementRarity.RARE,
      sortOrder: 90,
    },
    {
      name: '挑战大师',
      description: '完成50个挑战游戏',
      icon: '👑',
      category: AchievementCategory.PARTICIPATION,
      type: AchievementType.COUNT,
      condition: {
        type: 'count',
        field: 'gamesCompleted',
        target: 50,
      },
      reward: {
        vip: {
          duration: 30, // 30天VIP
        },
      },
      rarity: AchievementRarity.EPIC,
      sortOrder: 80,
    },

    // 创建类成就
    {
      name: '创意发起人',
      description: '创建第一个挑战游戏',
      icon: '💡',
      category: AchievementCategory.CREATION,
      type: AchievementType.SPECIAL,
      condition: {
        type: 'special',
        field: 'firstGame',
        target: 1,
      },
      reward: {
        points: {
          type: PointType.PARTICIPATION,
          amount: 30,
        },
      },
      rarity: AchievementRarity.COMMON,
      sortOrder: 70,
    },
    {
      name: '游戏设计师',
      description: '创建10个挑战游戏',
      icon: '🎮',
      category: AchievementCategory.CREATION,
      type: AchievementType.COUNT,
      condition: {
        type: 'count',
        field: 'gamesCreated',
        target: 10,
      },
      reward: {
        points: {
          type: PointType.PARTICIPATION,
          amount: 150,
        },
      },
      rarity: AchievementRarity.RARE,
      sortOrder: 60,
    },

    // 社交类成就
    {
      name: '社交新星',
      description: '参与5个不同的挑战游戏',
      icon: '⭐',
      category: AchievementCategory.SOCIAL,
      type: AchievementType.COUNT,
      condition: {
        type: 'count',
        field: 'gamesJoined',
        target: 5,
      },
      reward: {
        points: {
          type: PointType.PARTICIPATION,
          amount: 100,
        },
      },
      rarity: AchievementRarity.COMMON,
      sortOrder: 50,
    },
    {
      name: '社区贡献者',
      description: '参与20个挑战游戏',
      icon: '🤝',
      category: AchievementCategory.SOCIAL,
      type: AchievementType.COUNT,
      condition: {
        type: 'count',
        field: 'gamesJoined',
        target: 20,
      },
      reward: {
        points: {
          type: PointType.TRUST,
          amount: 10,
        },
      },
      rarity: AchievementRarity.RARE,
      sortOrder: 40,
    },

    // 信用类成就
    {
      name: '诚信之星',
      description: '信任积分达到150分',
      icon: '✨',
      category: AchievementCategory.TRUST,
      type: AchievementType.THRESHOLD,
      condition: {
        type: 'threshold',
        field: 'trustPoints',
        target: 150,
        operator: 'gte',
      },
      reward: {
        badge: 'golden_username',
        special: '金色用户名',
      },
      rarity: AchievementRarity.EPIC,
      sortOrder: 30,
    },
    {
      name: '仲裁专家',
      description: '劳动积分达到100分',
      icon: '⚖️',
      category: AchievementCategory.TRUST,
      type: AchievementType.THRESHOLD,
      condition: {
        type: 'threshold',
        field: 'laborPoints',
        target: 100,
        operator: 'gte',
      },
      reward: {
        badge: 'arbitrator',
        special: '仲裁师徽章',
      },
      rarity: AchievementRarity.EPIC,
      sortOrder: 20,
    },

    // 里程碑成就
    {
      name: '积分富翁',
      description: '总积分达到1000分',
      icon: '💰',
      category: AchievementCategory.MILESTONE,
      type: AchievementType.THRESHOLD,
      condition: {
        type: 'threshold',
        field: 'totalPoints',
        target: 1000,
        operator: 'gte',
      },
      reward: {
        points: {
          type: PointType.PARTICIPATION,
          amount: 500,
        },
        vip: {
          duration: 7, // 7天VIP
        },
      },
      rarity: AchievementRarity.LEGENDARY,
      sortOrder: 10,
    },

    // 特殊成就
    {
      name: 'VIP会员',
      description: '成为VIP会员',
      icon: '👑',
      category: AchievementCategory.SPECIAL,
      type: AchievementType.SPECIAL,
      condition: {
        type: 'special',
        field: 'vipStatus',
        target: 1,
      },
      reward: {
        badge: 'vip_crown',
        special: 'VIP专属徽章',
      },
      rarity: AchievementRarity.RARE,
      sortOrder: 5,
    },
  ];

  for (const achievement of achievements) {
    try {
      const created = await prisma.achievement.create({
        data: {
          ...achievement,
          condition: achievement.condition as any,
          reward: achievement.reward as any,
        },
      });
      console.log(`✅ 创建成就: ${created.name}`);
    } catch (error) {
      console.error(`❌ 创建成就失败: ${achievement.name}`, error);
    }
  }

  console.log('成就数据添加完成！');
}

async function main() {
  try {
    await seedAchievements();
  } catch (error) {
    console.error('添加成就数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
