const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listAllUsers() {
  console.log('👥 列出所有用户...\n');

  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        isVip: true,
        vipExpiresAt: true,
        isAdmin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`找到 ${users.length} 个用户:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username}`);
      console.log(`   邮箱: ${user.email}`);
      console.log(`   VIP: ${user.isVip}`);
      console.log(`   VIP到期: ${user.vipExpiresAt || '无'}`);
      console.log(`   管理员: ${user.isAdmin}`);
      console.log(`   创建时间: ${user.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers();
