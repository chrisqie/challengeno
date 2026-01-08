const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 检查数据库数据...\n');

  try {
    // 检查用户数量
    const userCount = await prisma.user.count();
    console.log(`👥 用户总数: ${userCount}`);

    // 检查游戏数量
    const gameCount = await prisma.betGame.count();
    console.log(`🎮 游戏总数: ${gameCount}`);

    if (gameCount > 0) {
      // 显示最近的几个游戏
      const recentGames = await prisma.betGame.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { username: true }
          }
        }
      });

      console.log('\n📋 最近的游戏:');
      recentGames.forEach(game => {
        console.log(`  • ${game.title} (${game.status}) - 创建者: ${game.creator.username}`);
        console.log(`    ID: ${game.id}`);
        console.log(`    创建时间: ${game.createdAt}`);
        console.log('');
      });
    }

    // 检查参与者数量
    const participantCount = await prisma.betParticipant.count();
    console.log(`👥 参与者记录总数: ${participantCount}`);

    // 检查质疑数量
    const disputeCount = await prisma.gameDispute.count();
    console.log(`⚖️ 质疑记录总数: ${disputeCount}`);

    // 检查仲裁请求数量
    const arbitrationCount = await prisma.arbitrationRequest.count();
    console.log(`🏛️ 仲裁请求总数: ${arbitrationCount}`);

  } catch (error) {
    console.error('❌ 检查数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
