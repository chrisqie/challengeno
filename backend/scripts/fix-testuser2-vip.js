const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixTestuser2Vip() {
  console.log('🔧 修复testuser2的VIP状态...\n');

  try {
    // 1. 检查testuser2当前状态
    const user = await prisma.user.findUnique({
      where: { username: 'testuser2' },
      select: {
        id: true,
        username: true,
        isVip: true,
        vipExpiresAt: true,
        isAdmin: true
      }
    });

    if (!user) {
      console.log('❌ testuser2用户不存在');
      return;
    }

    console.log('📊 testuser2当前状态:');
    console.log(`- isVip: ${user.isVip}`);
    console.log(`- vipExpiresAt: ${user.vipExpiresAt}`);
    console.log(`- isAdmin: ${user.isAdmin}`);

    // 2. 检查VIP订阅记录
    const subscriptions = await prisma.vipSubscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📋 VIP订阅记录 (${subscriptions.length}个):`);
    subscriptions.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.tier} - ${sub.isActive ? '活跃' : '非活跃'}`);
      console.log(`   开始: ${sub.startDate}`);
      console.log(`   结束: ${sub.endDate}`);
      console.log(`   当前时间: ${new Date()}`);
      console.log(`   是否过期: ${sub.endDate < new Date() ? '是' : '否'}`);
    });

    // 3. 清除testuser2的VIP状态
    console.log('\n🧹 清除testuser2的VIP状态...');
    
    // 删除所有VIP订阅记录
    const deletedSubs = await prisma.vipSubscription.deleteMany({
      where: { userId: user.id }
    });
    console.log(`✅ 删除了 ${deletedSubs.count} 个VIP订阅记录`);

    // 更新用户VIP状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVip: false,
        vipExpiresAt: null
      }
    });
    console.log('✅ 用户VIP状态已清除');

    // 4. 验证修复结果
    const updatedUser = await prisma.user.findUnique({
      where: { username: 'testuser2' },
      select: {
        username: true,
        isVip: true,
        vipExpiresAt: true
      }
    });

    console.log('\n🎯 修复后状态:');
    console.log(`- isVip: ${updatedUser.isVip}`);
    console.log(`- vipExpiresAt: ${updatedUser.vipExpiresAt}`);

    if (!updatedUser.isVip && !updatedUser.vipExpiresAt) {
      console.log('\n🎉 testuser2现在是纯粹的普通用户！');
    } else {
      console.log('\n⚠️ 修复可能不完整，请检查');
    }

  } catch (error) {
    console.error('❌ 修复失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTestuser2Vip();
