const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseDatabaseIssues() {
  console.log('🔍 开始诊断数据库问题...\n');

  try {
    // 1. 测试数据库连接
    console.log('1. 测试数据库连接...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ 数据库连接正常\n');

    // 2. 检查用户数据
    console.log('2. 检查用户数据...');
    const userCount = await prisma.user.count();
    console.log(`👥 用户总数: ${userCount}`);
    
    if (userCount > 0) {
      const recentUsers = await prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        }
      });
      console.log('最近的用户:');
      recentUsers.forEach(user => {
        console.log(`  - ${user.username} (${user.email}) - ${user.createdAt}`);
      });
    }
    console.log('');

    // 3. 检查游戏数据
    console.log('3. 检查游戏数据...');
    const gameCount = await prisma.betGame.count();
    console.log(`🎮 游戏总数: ${gameCount}`);

    if (gameCount > 0) {
      const recentGames = await prisma.betGame.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { username: true }
          }
        }
      });

      console.log('最近的游戏:');
      recentGames.forEach((game, index) => {
        console.log(`  ${index + 1}. ${game.title}`);
        console.log(`     ID: ${game.id}`);
        console.log(`     创建者: ${game.creator.username}`);
        console.log(`     状态: ${game.status}`);
        console.log(`     创建时间: ${game.createdAt}`);
        console.log(`     开始时间: ${game.startDate}`);
        console.log(`     结束时间: ${game.endDate}`);
        console.log('');
      });

      // 检查游戏状态分布
      const statusCounts = await prisma.betGame.groupBy({
        by: ['status'],
        _count: { status: true }
      });

      console.log('游戏状态分布:');
      statusCounts.forEach(({ status, _count }) => {
        console.log(`  ${status}: ${_count.status}个`);
      });
    } else {
      console.log('❌ 没有找到任何游戏数据！');
    }
    console.log('');

    // 4. 检查参与者数据
    console.log('4. 检查参与者数据...');
    const participantCount = await prisma.betParticipant.count();
    console.log(`👥 参与者记录总数: ${participantCount}`);

    if (participantCount > 0) {
      const recentParticipants = await prisma.betParticipant.findMany({
        take: 5,
        orderBy: { joinedAt: 'desc' },
        include: {
          user: { select: { username: true } },
          game: { select: { title: true } }
        }
      });

      console.log('最近的参与记录:');
      recentParticipants.forEach((participant, index) => {
        console.log(`  ${index + 1}. ${participant.user.username} 参与了 "${participant.game.title}"`);
        console.log(`     参与时间: ${participant.joinedAt}`);
        console.log(`     证据已提交: ${participant.evidenceSubmitted}`);
        console.log('');
      });
    }

    // 5. 检查游戏模板数据
    console.log('5. 检查游戏模板数据...');
    const templateCount = await prisma.gameTemplate.count();
    console.log(`📋 游戏模板总数: ${templateCount}`);

    if (templateCount > 0) {
      const templates = await prisma.gameTemplate.findMany({
        take: 3,
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          title: true,
          category: true,
          isActive: true
        }
      });

      console.log('活跃的游戏模板:');
      templates.forEach(template => {
        console.log(`  - ${template.title} (${template.category})`);
      });
    }
    console.log('');

    // 6. 检查数据库表结构
    console.log('6. 检查关键表是否存在...');
    const tables = [
      { name: 'User', model: 'user' },
      { name: 'BetGame', model: 'betGame' },
      { name: 'BetParticipant', model: 'betParticipant' },
      { name: 'GameTemplate', model: 'gameTemplate' },
      { name: 'PeerEvaluation', model: 'peerEvaluation' },
      { name: 'Notification', model: 'notification' },
      { name: 'Friendship', model: 'friendship' }
    ];

    for (const table of tables) {
      try {
        const count = await prisma[table.model].count();
        console.log(`✅ ${table.name} 表存在，记录数: ${count}`);
      } catch (error) {
        console.log(`❌ ${table.name} 表可能不存在或有问题: ${error.message}`);
      }
    }
    console.log('');

    // 7. 检查最近的错误或异常
    console.log('7. 检查数据完整性...');

    try {
      // 使用原生SQL查询检查孤立的参与者记录
      const orphanParticipants = await prisma.$queryRaw`
        SELECT bp.id, bp.game_id, bp.user_id
        FROM bet_participants bp
        LEFT JOIN bet_games bg ON bp.game_id = bg.id
        WHERE bg.id IS NULL
        LIMIT 5
      `;

      if (orphanParticipants.length > 0) {
        console.log(`⚠️ 发现 ${orphanParticipants.length} 个孤立的参与者记录`);
      } else {
        console.log('✅ 参与者数据完整性正常');
      }

      // 检查是否有游戏没有创建者
      const gamesWithoutCreator = await prisma.$queryRaw`
        SELECT bg.id, bg.title, bg.creator_id
        FROM bet_games bg
        LEFT JOIN users u ON bg.creator_id = u.id
        WHERE u.id IS NULL
        LIMIT 5
      `;

      if (gamesWithoutCreator.length > 0) {
        console.log(`⚠️ 发现 ${gamesWithoutCreator.length} 个没有创建者的游戏`);
      } else {
        console.log('✅ 游戏创建者数据完整性正常');
      }
    } catch (error) {
      console.log('⚠️ 数据完整性检查失败:', error.message);
    }

    console.log('\n🎉 数据库诊断完成！');

    // 8. 总结问题
    console.log('\n📋 问题总结:');
    if (gameCount === 0) {
      console.log('❌ 主要问题：游戏数据完全丢失');
      console.log('   可能原因：');
      console.log('   - 数据库被重置或清空');
      console.log('   - 数据库迁移问题');
      console.log('   - 数据库连接配置错误');
      console.log('   - 应用连接到了错误的数据库');
    } else {
      console.log('✅ 游戏数据存在，问题可能在应用层面');
      console.log('   需要检查：');
      console.log('   - API路由配置');
      console.log('   - 权限验证逻辑');
      console.log('   - 前端路由配置');
      console.log('   - 缓存问题');
    }

  } catch (error) {
    console.error('❌ 诊断过程中出现错误:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行诊断
diagnoseDatabaseIssues().catch(console.error);
