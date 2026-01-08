const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateReferralSystem() {
  try {
    console.log('🔄 开始推荐码系统数据库迁移...');

    // 检查是否需要迁移
    const existingUser = await prisma.user.findFirst({
      select: { referralCode: true }
    }).catch(() => null);

    if (existingUser && 'referralCode' in existingUser) {
      console.log('✅ 推荐码系统已存在，无需迁移');
      return;
    }

    console.log('📊 推送数据库模式更改...');
    
    // 这里应该运行 prisma db push 或 prisma migrate
    // 由于我们在脚本中，我们只能提示用户手动运行
    console.log('⚠️  请手动运行以下命令来更新数据库模式：');
    console.log('   cd /opt/bet-together/backend');
    console.log('   npx prisma db push');
    console.log('');
    console.log('然后重新运行此脚本来完成数据初始化');

    // 检查是否已经推送了模式
    try {
      await prisma.referralReward.findFirst();
      console.log('✅ 数据库模式已更新');
    } catch (error) {
      console.log('❌ 数据库模式尚未更新，请先运行 npx prisma db push');
      return;
    }

    // 为现有用户生成推荐码
    console.log('🔧 为现有用户生成推荐码...');
    
    const usersWithoutReferralCode = await prisma.user.findMany({
      where: {
        referralCode: null
      },
      select: {
        id: true,
        username: true
      }
    });

    console.log(`找到 ${usersWithoutReferralCode.length} 个需要生成推荐码的用户`);

    for (const user of usersWithoutReferralCode) {
      const referralCode = generateReferralCode(user.username);
      
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { referralCode }
        });
        console.log(`✅ 用户 ${user.username} 推荐码: ${referralCode}`);
      } catch (error) {
        // 如果推荐码重复，生成纯随机码
        const randomCode = generateRandomCode(8);
        await prisma.user.update({
          where: { id: user.id },
          data: { referralCode: randomCode }
        });
        console.log(`✅ 用户 ${user.username} 推荐码: ${randomCode} (随机)`);
      }
    }

    console.log('🎉 推荐码系统迁移完成！');
    
    // 显示统计信息
    const totalUsers = await prisma.user.count();
    const usersWithReferralCode = await prisma.user.count({
      where: { referralCode: { not: null } }
    });
    
    console.log(`📊 统计信息:`);
    console.log(`   总用户数: ${totalUsers}`);
    console.log(`   已有推荐码: ${usersWithReferralCode}`);
    console.log(`   覆盖率: ${((usersWithReferralCode / totalUsers) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ 迁移失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 生成推荐码
function generateReferralCode(username) {
  const prefix = username.substring(0, 4).toUpperCase();
  const randomPart = generateRandomCode(6);
  return `${prefix}${randomPart}`;
}

// 生成随机码
function generateRandomCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 运行迁移
if (require.main === module) {
  migrateReferralSystem()
    .then(() => {
      console.log('✅ 迁移脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 迁移脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { migrateReferralSystem };
