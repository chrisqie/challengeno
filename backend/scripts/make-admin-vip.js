const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdminVip() {
  try {
    console.log('🚀 开始为管理员添加VIP权限...');

    // 查找admin用户
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!admin) {
      console.log('❌ 未找到admin用户');
      return;
    }

    // 设置VIP权限 - 精英会员，永不过期
    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: {
        isVip: true,
        vipExpiresAt: new Date('2030-12-31'), // 设置一个很远的过期时间
      }
    });

    console.log('✅ 管理员VIP权限设置成功！');
    console.log(`📊 用户信息:`);
    console.log(`   - 用户名: ${updatedAdmin.username}`);
    console.log(`   - VIP状态: ${updatedAdmin.isVip ? '是' : '否'}`);
    console.log(`   - VIP过期时间: ${updatedAdmin.vipExpiresAt}`);

  } catch (error) {
    console.error('❌ 设置管理员VIP权限失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  makeAdminVip();
}

module.exports = { makeAdminVip };
