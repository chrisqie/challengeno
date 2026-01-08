const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('开始创建管理员用户...');

    // 检查是否已存在管理员
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('管理员用户已存在，更新管理员权限...');
      
      // 更新现有用户为管理员
      await prisma.user.update({
        where: { username: 'admin' },
        data: {
          isAdmin: true,
          adminRole: 'SUPER_ADMIN',
          adminCreatedAt: new Date(),
        }
      });
      
      console.log('管理员权限更新完成！');
    } else {
      // 创建新的管理员用户
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@bet-together.com',
          fullName: 'System Administrator',
          dateOfBirth: new Date('1990-01-01'),
          passwordHash: hashedPassword,
          isAdmin: true,
          adminRole: 'SUPER_ADMIN',
          adminCreatedAt: new Date(),
          participationPoints: 0,
          trustPoints: 100,
          laborPoints: 0,
          totalGamesCreated: 0,
          totalGamesJoined: 0,
          gamesCompleted: 0,
          isVip: false,
        }
      });

      console.log('管理员用户创建成功！');
      console.log('用户名: admin');
      console.log('密码: admin123');
      console.log('用户ID:', admin.id);
    }

  } catch (error) {
    console.error('创建管理员用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
