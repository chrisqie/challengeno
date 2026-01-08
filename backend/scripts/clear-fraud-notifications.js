const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearFraudNotifications() {
  try {
    console.log('🧹 开始清理风控通知...\n');

    // 1. 统计风控通知数量
    const count = await prisma.notification.count({
      where: {
        type: 'SECURITY_ALERT',
        title: '检测到可疑互评行为'
      }
    });

    console.log(`📊 找到 ${count} 条风控通知`);

    if (count === 0) {
      console.log('✅ 没有需要清理的通知');
      return;
    }

    // 2. 删除所有风控通知
    const result = await prisma.notification.deleteMany({
      where: {
        type: 'SECURITY_ALERT',
        title: '检测到可疑互评行为'
      }
    });

    console.log(`\n✅ 成功删除 ${result.count} 条风控通知！\n`);

    // 3. 显示剩余通知统计
    const remaining = await prisma.notification.groupBy({
      by: ['type'],
      _count: true
    });

    console.log('📊 剩余通知统计:');
    remaining.forEach(item => {
      console.log(`  - ${item.type}: ${item._count} 条`);
    });

  } catch (error) {
    console.error('❌ 清理失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearFraudNotifications();

