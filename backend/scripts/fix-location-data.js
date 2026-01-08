/**
 * 修复历史游戏数据的地理位置字段
 * 为没有地理位置限制的历史游戏设置合理的默认值
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixLocationData() {
  console.log('🔧 开始修复历史游戏数据的地理位置字段...');

  try {
    // 1. 统计当前数据情况
    const totalGames = await prisma.betGame.count();
    const gamesWithNoneLocation = await prisma.betGame.count({
      where: { locationRestriction: 'NONE' }
    });
    const gamesWithLocalLocation = await prisma.betGame.count({
      where: { locationRestriction: 'LOCAL' }
    });
    const gamesWithCustomLocation = await prisma.betGame.count({
      where: { locationRestriction: 'CUSTOM' }
    });

    console.log(`📊 数据统计:`);
    console.log(`   总游戏数: ${totalGames}`);
    console.log(`   无地理限制 (NONE): ${gamesWithNoneLocation}`);
    console.log(`   本地限制 (LOCAL): ${gamesWithLocalLocation}`);
    console.log(`   自定义限制 (CUSTOM): ${gamesWithCustomLocation}`);

    // 2. 为部分历史游戏添加地理位置限制，使Local标签有意义
    // 策略：将一些健身、学习类的游戏设置为LOCAL，增加Local标签的内容
    
    // 2.1 将部分FITNESS类游戏设置为LOCAL (30km内)
    const fitnessGamesUpdated = await prisma.betGame.updateMany({
      where: {
        AND: [
          { category: 'FITNESS' },
          { locationRestriction: 'NONE' },
          { maxParticipants: { lte: 8 } } // 小规模的健身挑战更适合本地
        ]
      },
      data: {
        locationRestriction: 'LOCAL',
        maxDistance: 30
      }
    });

    console.log(`✅ 更新了 ${fitnessGamesUpdated.count} 个健身游戏为本地挑战 (30km)`);

    // 2.2 将部分LEARNING类游戏设置为LOCAL (50km内)
    const learningGamesUpdated = await prisma.betGame.updateMany({
      where: {
        AND: [
          { category: 'LEARNING' },
          { locationRestriction: 'NONE' },
          { maxParticipants: { lte: 10 } } // 小规模的学习挑战
        ]
      },
      data: {
        locationRestriction: 'LOCAL',
        maxDistance: 50
      }
    });

    console.log(`✅ 更新了 ${learningGamesUpdated.count} 个学习游戏为本地挑战 (50km)`);

    // 2.3 将部分HEALTH类游戏设置为CUSTOM位置
    const healthGamesUpdated = await prisma.betGame.updateMany({
      where: {
        AND: [
          { category: 'HEALTH' },
          { locationRestriction: 'NONE' },
          { maxParticipants: { lte: 6 } } // 小规模的健康挑战
        ]
      },
      data: {
        locationRestriction: 'CUSTOM',
        customLocation: '社区健康中心周边'
      }
    });

    console.log(`✅ 更新了 ${healthGamesUpdated.count} 个健康游戏为自定义位置`);

    // 3. 统计更新后的数据
    const updatedStats = {
      none: await prisma.betGame.count({ where: { locationRestriction: 'NONE' } }),
      local: await prisma.betGame.count({ where: { locationRestriction: 'LOCAL' } }),
      custom: await prisma.betGame.count({ where: { locationRestriction: 'CUSTOM' } })
    };

    console.log(`📊 更新后数据统计:`);
    console.log(`   无地理限制 (NONE): ${updatedStats.none}`);
    console.log(`   本地限制 (LOCAL): ${updatedStats.local}`);
    console.log(`   自定义限制 (CUSTOM): ${updatedStats.custom}`);

    // 4. 验证Local标签现在应该有内容了
    const localGames = await prisma.betGame.findMany({
      where: {
        OR: [
          { locationRestriction: 'LOCAL' },
          { locationRestriction: 'CUSTOM' }
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        locationRestriction: true,
        maxDistance: true,
        customLocation: true
      },
      take: 5
    });

    console.log(`🎯 Local标签示例游戏:`);
    localGames.forEach(game => {
      const locationInfo = game.locationRestriction === 'LOCAL' 
        ? `本地 ${game.maxDistance}km`
        : `自定义: ${game.customLocation}`;
      console.log(`   - ${game.title} (${game.category}) - ${locationInfo}`);
    });

    console.log('✅ 历史数据修复完成！');
    console.log('💡 现在Local标签应该能显示有地理位置限制的游戏了');

  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  fixLocationData()
    .then(() => {
      console.log('🎉 脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { fixLocationData };
