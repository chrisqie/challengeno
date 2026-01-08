const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🚀 开始创建管理员账号...');

    // 检查是否已存在admin用户
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('⚠️  admin用户已存在，正在更新管理员权限...');
      
      // 更新现有用户为管理员
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          isAdmin: true,
          adminRole: 'SUPER_ADMIN',
        }
      });
      
      console.log('✅ admin用户已更新为超级管理员');
      return;
    }

    // 创建新的管理员账号
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@bet-together.com',
        fullName: 'System Administrator',
        passwordHash: hashedPassword,
        dateOfBirth: new Date('1990-01-01'),
        isAdmin: true,
        adminRole: 'SUPER_ADMIN',
        participationPoints: 1000,
        trustPoints: 1000,
        laborPoints: 1000,
      }
    });

    console.log('✅ 管理员账号创建成功！');
    console.log('📋 账号信息：');
    console.log(`   用户名: ${admin.username}`);
    console.log(`   邮箱: ${admin.email}`);
    console.log(`   密码: admin123`);
    console.log(`   管理员角色: ${admin.adminRole}`);
    console.log('');
    console.log('🔐 请登录后立即修改密码！');

  } catch (error) {
    console.error('❌ 创建管理员失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  createAdmin();
}

module.exports = { createAdmin };
