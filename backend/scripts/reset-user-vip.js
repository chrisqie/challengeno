const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetUserVip() {
  console.log('🔧 重置用户VIP状态...\n');

  try {
    // 1. 清除testuser2的VIP状态（确保是普通用户）
    await prisma.user.update({
      where: { username: 'testuser2' },
      data: {
        isVip: false,
        vipExpiresAt: null
      }
    });
    console.log('✅ testuser2 VIP状态已清除');

    // 2. 清除vipbasic的VIP状态
    await prisma.user.update({
      where: { username: 'vipbasic' },
      data: {
        isVip: false,
        vipExpiresAt: null
      }
    });
    console.log('✅ vipbasic VIP状态已清除');

    // 3. 删除所有VIP订阅记录
    await prisma.vipSubscription.deleteMany({});
    console.log('✅ 所有VIP订阅记录已清除');

    // 4. 确认admin用户状态
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: { isAdmin: true, isVip: true }
    });
    
    if (!admin.isAdmin) {
      await prisma.user.update({
        where: { username: 'admin' },
        data: { isAdmin: true }
      });
      console.log('✅ admin管理员状态已确认');
    }

    console.log('\n🎯 重置完成！现在用户状态应该是:');
    console.log('- admin: 管理员 (自动获得ELITE VIP权限)');
    console.log('- testuser2: 普通用户 (无VIP权限)');
    console.log('- vipbasic: 普通用户 (等待升级为VIP)');

  } catch (error) {
    console.error('❌ 重置失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserVip();
