const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserStatus() {
  console.log('🔍 检查用户VIP状态...\n');

  try {
    // 检查所有用户的VIP状态
    const users = await prisma.user.findMany({
      where: {
        username: {
          in: ['admin', 'testuser2', 'vipbasic']
        }
      },
      select: {
        username: true,
        isVip: true,
        vipExpiresAt: true,
        isAdmin: true
      }
    });

    console.log('用户VIP状态:');
    users.forEach(user => {
      console.log(`- ${user.username}:`);
      console.log(`  isVip: ${user.isVip}`);
      console.log(`  vipExpiresAt: ${user.vipExpiresAt}`);
      console.log(`  isAdmin: ${user.isAdmin}`);
      console.log('');
    });

    // 检查VIP订阅记录
    const subscriptions = await prisma.vipSubscription.findMany({
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    console.log('VIP订阅记录:');
    subscriptions.forEach(sub => {
      console.log(`- ${sub.user.username}: ${sub.tier} (${sub.isActive ? '活跃' : '非活跃'})`);
      console.log(`  开始: ${sub.startDate}`);
      console.log(`  结束: ${sub.endDate}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserStatus();
