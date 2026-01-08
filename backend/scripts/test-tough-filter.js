/**
 * 测试Tough标签过滤逻辑
 * 验证哪些游戏会被归类为"艰难挑战"
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testToughFilter() {
  console.log('🧪 测试Tough标签过滤逻辑...');

  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 模拟后端的Tough过滤条件
    const toughConditions = {
      OR: [
        // 持续时间 >= 7天 (从现在开始计算，游戏结束时间距离现在至少7天)
        {
          AND: [
            { endDate: { gte: sevenDaysFromNow } },
            { startDate: { lte: now } } // 确保游戏已经开始或即将开始
          ]
        },
        // 参与人数要求 >= 10人
        {
          maxParticipants: { gte: 10 }
        },
        // 困难类别
        {
          category: {
            in: ['FITNESS', 'LEARNING', 'HEALTH', 'PERSONAL']
          }
        }
      ]
    };

    // 获取符合Tough条件的游戏
    const toughGames = await prisma.betGame.findMany({
      where: {
        AND: [
          // 只显示开放和进行中的游戏
          {
            status: {
              in: ['OPEN', 'IN_PROGRESS']
            }
          },
          toughConditions
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        maxParticipants: true,
        startDate: true,
        endDate: true,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log(`🎯 找到 ${toughGames.length} 个符合Tough条件的游戏:`);
    
    toughGames.forEach((game, index) => {
      const duration = Math.ceil((new Date(game.endDate) - new Date(game.startDate)) / (1000 * 60 * 60 * 24));
      const daysFromNow = Math.ceil((new Date(game.endDate) - now) / (1000 * 60 * 60 * 24));
      
      let reason = [];
      
      // 检查符合条件的原因
      if (daysFromNow >= 7) {
        reason.push(`持续${duration}天`);
      }
      if (game.maxParticipants >= 10) {
        reason.push(`需要${game.maxParticipants}人`);
      }
      if (['FITNESS', 'LEARNING', 'HEALTH', 'PERSONAL'].includes(game.category)) {
        reason.push(`困难类别(${game.category})`);
      }

      console.log(`   ${index + 1}. ${game.title}`);
      console.log(`      类别: ${game.category} | 状态: ${game.status}`);
      console.log(`      参与人数: ${game.maxParticipants} | 持续天数: ${duration}`);
      console.log(`      符合原因: ${reason.join(', ')}`);
      console.log('');
    });

    // 分别统计各个条件的游戏数量
    const longDurationGames = await prisma.betGame.count({
      where: {
        AND: [
          { status: { in: ['OPEN', 'IN_PROGRESS'] } },
          { endDate: { gte: sevenDaysFromNow } },
          { startDate: { lte: now } }
        ]
      }
    });

    const highParticipantGames = await prisma.betGame.count({
      where: {
        AND: [
          { status: { in: ['OPEN', 'IN_PROGRESS'] } },
          { maxParticipants: { gte: 10 } }
        ]
      }
    });

    const difficultCategoryGames = await prisma.betGame.count({
      where: {
        AND: [
          { status: { in: ['OPEN', 'IN_PROGRESS'] } },
          { category: { in: ['FITNESS', 'LEARNING', 'HEALTH', 'PERSONAL'] } }
        ]
      }
    });

    console.log(`📊 Tough条件分析:`);
    console.log(`   长持续时间游戏 (≥7天): ${longDurationGames}`);
    console.log(`   高参与人数游戏 (≥10人): ${highParticipantGames}`);
    console.log(`   困难类别游戏: ${difficultCategoryGames}`);
    console.log(`   总计符合Tough条件: ${toughGames.length}`);

    // 如果Tough游戏太少，给出建议
    if (toughGames.length < 3) {
      console.log('');
      console.log('⚠️  Tough标签游戏数量较少，建议调整过滤条件:');
      console.log('   1. 降低持续时间要求 (从7天改为5天)');
      console.log('   2. 降低参与人数要求 (从10人改为8人)');
      console.log('   3. 增加更多困难类别');
    }

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testToughFilter()
    .then(() => {
      console.log('🎉 测试完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 测试失败:', error);
      process.exit(1);
    });
}

module.exports = { testToughFilter };
