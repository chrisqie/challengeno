const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearTemplates() {
  try {
    console.log('🗑️ 清除现有模板数据...');
    
    // 删除所有模板
    const result = await prisma.gameTemplate.deleteMany({});
    
    console.log(`✅ 已删除 ${result.count} 个模板`);
    console.log('💡 重启服务后将自动重新创建模板');
    
  } catch (error) {
    console.error('❌ 清除模板失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearTemplates();
