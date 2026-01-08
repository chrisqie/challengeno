const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetAdminPassword() {
  try {
    console.log('🔐 重置管理员密码\n');

    // 1. 输入新密码
    const newPassword = await question('请输入新密码（至少8位）: ');
    
    if (newPassword.length < 8) {
      console.log('❌ 密码长度必须至少8位！');
      process.exit(1);
    }

    const confirmPassword = await question('请再次输入新密码: ');
    
    if (newPassword !== confirmPassword) {
      console.log('❌ 两次输入的密码不一致！');
      process.exit(1);
    }

    // 2. 查找 admin 用户
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: 'admin' },
          { isAdmin: true }
        ]
      }
    });

    if (!adminUser) {
      console.log('❌ 未找到管理员用户！');
      process.exit(1);
    }

    console.log(`\n找到管理员用户: ${adminUser.username} (${adminUser.email || 'no email'})`);

    // 3. 加密新密码
    console.log('\n正在加密密码...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. 更新密码
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        passwordHash: hashedPassword,
        updatedAt: new Date()
      }
    });

    console.log('\n✅ 管理员密码已成功重置！');
    console.log(`用户名: ${adminUser.username}`);
    console.log('新密码: ********\n');
    console.log('⚠️  请妥善保管新密码！\n');

  } catch (error) {
    console.error('❌ 重置密码失败:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

resetAdminPassword();

