const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateExistingGames() {
  console.log('🚀 开始更新现有游戏的时间字段...');

  try {
    // 检查数据库连接
    console.log('📋 检查数据库连接...');
    await prisma.$connect();

    // 查找所有现有游戏
    console.log('📊 查找现有游戏...');
    const existingGames = await prisma.betGame.findMany({
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        evidenceDeadline: true,
        joinDeadline: true,
        reviewDeadline: true,
        arbitrationDeadline: true,
      }
    });

    console.log(`📈 找到 ${existingGames.length} 个游戏`);

    // 过滤出需要更新的游戏（新字段为null的）
    const gamesToUpdate = existingGames.filter(game => 
      !game.joinDeadline || !game.reviewDeadline || !game.arbitrationDeadline
    );

    console.log(`🔄 需要更新 ${gamesToUpdate.length} 个游戏的时间字段`);

    if (gamesToUpdate.length === 0) {
      console.log('✅ 所有游戏的时间字段都已设置，无需更新');
      return;
    }

    let updatedCount = 0;
    for (const game of gamesToUpdate) {
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

        // 只更新缺失的字段
        const updateData = {};
        if (!game.joinDeadline) updateData.joinDeadline = joinDeadline;
        if (!game.reviewDeadline) updateData.reviewDeadline = reviewDeadline;
        if (!game.arbitrationDeadline) updateData.arbitrationDeadline = arbitrationDeadline;

        await prisma.betGame.update({
          where: { id: game.id },
          data: updateData
        });

        updatedCount++;
        console.log(`✅ 更新游戏 "${game.title}" (${game.id}) - ${updatedCount}/${gamesToUpdate.length}`);
      } catch (error) {
        console.error(`❌ 更新游戏 ${game.id} 失败:`, error.message);
      }
    }

    // 检查可以关闭的游戏
    console.log('🔍 检查可以关闭的游戏...');
    const completedGames = await prisma.betGame.findMany({
      where: {
        status: 'COMPLETED',
        arbitrationDeadline: {
          lt: new Date() // 仲裁期已过
        }
      },
      select: {
        id: true,
        title: true,
        arbitrationDeadline: true
      }
    });

    console.log('🎉 游戏时间字段更新完成！');
    console.log('📊 更新统计:');
    console.log(`   - 成功更新了 ${updatedCount} 个游戏的时间字段`);
    console.log(`   - 发现 ${completedGames.length} 个可以关闭的游戏`);
    
    if (completedGames.length > 0) {
      console.log('');
      console.log('📋 可以关闭的游戏列表:');
      completedGames.forEach(game => {
        console.log(`   - ${game.title} (${game.id}) - 仲裁截止: ${game.arbitrationDeadline.toLocaleString()}`);
      });
    }

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
    console.error('❌ 更新过程中出现错误:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行更新
updateExistingGames()
  .catch((error) => {
    console.error('💥 更新失败:', error);
    process.exit(1);
  });
