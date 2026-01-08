const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestData() {
  console.log('🎮 创建质疑和仲裁系统测试数据...\n');

  try {
    // 创建测试用户
    const users = [];
    const usernames = ['testuser1', 'testuser2', 'testuser3', 'testuser4', 'admin'];
    
    for (const username of usernames) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
          data: {
            username,
            email: `${username}@test.com`,
            fullName: `Test User ${username.slice(-1)}`,
            dateOfBirth: new Date('1990-01-01'),
            passwordHash: hashedPassword,
            isAdmin: username === 'admin',
            trustPoints: 100,
          }
        });
        users.push(user);
        console.log(`✅ 创建用户: ${username}`);
      } else {
        users.push(existingUser);
        console.log(`ℹ️  用户已存在: ${username}`);
      }
    }

    // 创建一个已完成的测试游戏
    const creator = users[0];
    const participants = users.slice(0, 4); // 前4个用户参与

    const game = await prisma.betGame.create({
      data: {
        title: '质疑测试游戏',
        description: '这是一个用于测试质疑和仲裁功能的游戏',
        creatorId: creator.id,
        stakeType: 'MONEY',
        betAmount: 100,
        evidenceType: 'PHOTO',
        evidenceInstructions: '请提交完成任务的照片证据',
        maxParticipants: 4,
        currentParticipants: 4,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
        endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
        evidenceDeadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
        status: 'COMPLETED',
        category: 'FITNESS',
        visibility: 'PUBLIC',
      }
    });

    console.log(`✅ 创建游戏: ${game.title} (ID: ${game.id})`);

    // 创建参与者记录
    for (const user of participants) {
      await prisma.betParticipant.create({
        data: {
          gameId: game.id,
          userId: user.id,
          evidenceSubmitted: true,
          evidenceType: 'PHOTO',
          evidenceContent: 'https://example.com/evidence.jpg',
          evidenceSubmittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          selfReportedSuccess: Math.random() > 0.5, // 随机成功/失败
          finalResult: Math.random() > 0.3 ? 'SUCCESS' : 'FAILURE',
          completionVerified: true,
        }
      });
    }

    console.log(`✅ 创建 ${participants.length} 个参与者记录`);

    // 创建一些互评记录
    for (let i = 0; i < participants.length; i++) {
      for (let j = 0; j < participants.length; j++) {
        if (i !== j) {
          await prisma.peerEvaluation.create({
            data: {
              gameId: game.id,
              evaluatorId: participants[i].id,
              evaluatedId: participants[j].id,
              evaluation: Math.random() > 0.5 ? 'SUCCESS' : 'FAILURE',
              reasoning: '基于提交的证据进行评价',
            }
          });
        }
      }
    }

    console.log(`✅ 创建互评记录`);

    console.log('\n🎯 测试数据创建完成！');
    console.log('\n📋 测试步骤:');
    console.log('1. 登录任意测试用户 (testuser1-4, 密码: password123)');
    console.log(`2. 访问游戏详情页: /game/${game.id}`);
    console.log('3. 点击"查看证据汇总"按钮');
    console.log('4. 在证据汇总页面测试质疑功能');
    console.log('5. 当质疑数达到阈值时测试仲裁申请');
    console.log('6. 使用admin账户访问 /admin/arbitrations 处理仲裁');
    console.log('\n🔑 管理员账户: admin / password123');

    return {
      gameId: game.id,
      users: users.map(u => ({ id: u.id, username: u.username }))
    };

  } catch (error) {
    console.error('❌ 创建测试数据失败:', error);
    throw error;
  }
}

async function main() {
  try {
    const result = await createTestData();
    console.log('\n✅ 测试数据创建成功');
    console.log('游戏ID:', result.gameId);
    console.log('用户列表:', result.users);
  } catch (error) {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
