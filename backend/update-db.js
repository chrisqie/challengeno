const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDatabase() {
  try {
    console.log('🔄 更新数据库结构...');

    // 检查是否需要为现有游戏设置默认的privacyMode
    const gamesWithoutPrivacy = await prisma.betGame.count({
      where: {
        privacyMode: null,
      },
    });

    if (gamesWithoutPrivacy > 0) {
      console.log(`📝 为 ${gamesWithoutPrivacy} 个游戏设置默认隐私模式为 PUBLIC`);
      
      await prisma.betGame.updateMany({
        where: {
          privacyMode: null,
        },
        data: {
          privacyMode: 'PUBLIC',
        },
      });
      
      console.log('✅ 隐私模式更新完成');
    } else {
      console.log('✅ 所有游戏都已设置隐私模式');
    }

    console.log('🎉 数据库更新完成！');

  } catch (error) {
    console.error('❌ 数据库更新失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDatabase();
