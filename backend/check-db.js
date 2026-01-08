const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 检查数据库状态...\n');

    // 检查用户数量
    const userCount = await prisma.user.count();
    console.log(`👥 用户数量: ${userCount}`);

    // 检查游戏数量
    const gameCount = await prisma.betGame.count();
    console.log(`🎮 游戏数量: ${gameCount}`);

    if (gameCount > 0) {
      // 显示最近的几个游戏
      const recentGames = await prisma.betGame.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              username: true,
            },
          },
        },
      });

      console.log('\n📋 最近的游戏:');
      recentGames.forEach((game, index) => {
        console.log(`${index + 1}. ${game.title} (创建者: ${game.creator.username}, 状态: ${game.status})`);
      });

      // 检查游戏状态分布
      const statusCounts = await prisma.betGame.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      });

      console.log('\n📊 游戏状态分布:');
      statusCounts.forEach(({ status, _count }) => {
        console.log(`${status}: ${_count.status}个`);
      });
    }

    // 检查参与者数量
    const participantCount = await prisma.betParticipant.count();
    console.log(`\n👤 参与者记录数量: ${participantCount}`);

    // 测试API查询条件
    console.log('\n🔍 测试API查询条件...');
    const apiQuery = await prisma.betGame.findMany({
      where: {
        status: {
          in: ['OPEN', 'IN_PROGRESS'],
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            trustPoints: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 20,
    });

    console.log(`📊 API查询结果: ${apiQuery.length} 个游戏`);
    if (apiQuery.length > 0) {
      console.log('前3个游戏:');
      apiQuery.slice(0, 3).forEach((game, index) => {
        console.log(`${index + 1}. ${game.title} (状态: ${game.status}, 创建者: ${game.creator.username})`);
      });
    }

  } catch (error) {
    console.error('❌ 数据库检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
