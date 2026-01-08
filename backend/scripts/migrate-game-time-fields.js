const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateGameTimeFields() {
  console.log('🚀 开始迁移游戏时间字段...');

  try {
    // 1. 检查数据库连接
    console.log('📋 检查数据库连接...');
    await prisma.$connect();

    // 2. 更新现有游戏的时间字段
    console.log('📊 查找需要更新的游戏...');

    // 先查找所有现有游戏（不使用新字段过滤）
    const existingGames = await prisma.betGame.findMany({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        evidenceDeadline: true,
      }
    });

    console.log(`📈 找到 ${existingGames.length} 个游戏需要更新时间字段`);

    let updatedCount = 0;
    for (const game of existingGames) {
      try {
        // 计算新的时间字段
        const startDate = new Date(game.startDate);
        const endDate = new Date(game.endDate);
        const evidenceDeadline = new Date(game.evidenceDeadline);

        // joinDeadline = startDate - 1小时（给用户1小时加入时间）
        const joinDeadline = new Date(startDate.getTime() - 60 * 60 * 1000);

        // reviewDeadline = evidenceDeadline + 48小时
        const reviewDeadline = new Date(evidenceDeadline.getTime() + 48 * 60 * 60 * 1000);

        // arbitrationDeadline = reviewDeadline + 7天
        const arbitrationDeadline = new Date(reviewDeadline.getTime() + 7 * 24 * 60 * 60 * 1000);

        await prisma.betGame.update({
          where: { id: game.id },
          data: {
            joinDeadline,
            reviewDeadline,
            arbitrationDeadline,
          }
        });

        updatedCount++;
        console.log(`✅ 更新游戏 ${game.id} 的时间字段 (${updatedCount}/${existingGames.length})`);
      } catch (error) {
        console.error(`❌ 更新游戏 ${game.id} 失败:`, error.message);
      }
    }

    // 3. 更新游戏状态枚举（添加CLOSED状态）
    console.log('🔄 更新游戏状态枚举...');
    
    // 注意：Prisma会自动处理枚举更新，这里只是确保数据一致性
    const completedGames = await prisma.betGame.findMany({
      where: {
        status: 'COMPLETED',
        arbitrationDeadline: {
          lt: new Date() // 仲裁期已过
        }
      }
    });

    console.log(`📋 找到 ${completedGames.length} 个应该关闭的游戏`);

    // 暂时不自动更新为CLOSED状态，等待手动确认
    // for (const game of completedGames) {
    //   await prisma.betGame.update({
    //     where: { id: game.id },
    //     data: { status: 'CLOSED' }
    //   });
    // }

    console.log('🎉 游戏时间字段迁移完成！');
    console.log('📊 迁移统计:');
    console.log(`   - 成功更新了 ${updatedCount} 个游戏的时间字段`);
    console.log(`   - 发现 ${completedGames.length} 个可以关闭的游戏`);
    console.log('');
    console.log('⚠️  注意事项:');
    console.log('   1. 现有游戏的joinDeadline被设置为startDate前1小时');
    console.log('   2. reviewDeadline被设置为evidenceDeadline后48小时');
    console.log('   3. arbitrationDeadline被设置为reviewDeadline后7天');
    console.log('   4. 请检查这些时间设置是否合理');
    console.log('');
    console.log('🔄 下一步操作:');
    console.log('   1. 重启后端服务: pm2 restart bet-together-backend');
    console.log('   2. 编译前端: cd frontend && npm run build');
    console.log('   3. 测试新的时间流程功能');

  } catch (error) {
    console.error('❌ 迁移过程中出现错误:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行迁移
migrateGameTimeFields()
  .catch((error) => {
    console.error('💥 迁移失败:', error);
    process.exit(1);
  });
