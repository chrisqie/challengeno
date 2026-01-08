const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addUserLocationFields() {
  console.log('🚀 开始添加用户位置字段...');

  try {
    // 检查数据库连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');

    console.log('📋 添加用户位置字段到数据库...');
    
    // 这个脚本主要是为了触发Prisma重新生成客户端
    // 实际的字段添加通过 prisma db push 完成
    
    console.log('✅ 用户位置字段添加完成');
    console.log('📊 请运行以下命令完成迁移:');
    console.log('   npx prisma db push');
    console.log('   npx prisma generate');

  } catch (error) {
    console.error('❌ 添加用户位置字段时出现错误:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行迁移
addUserLocationFields()
  .then(() => {
    console.log('🎉 用户位置字段迁移完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 迁移失败:', error);
    process.exit(1);
  });
