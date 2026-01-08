const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTemplates() {
  try {
    console.log('🔍 检查模板数据...\n');

    // 1. 统计模板总数
    const totalCount = await prisma.gameTemplate.count();
    console.log(`📊 模板总数: ${totalCount}`);

    if (totalCount === 0) {
      console.log('❌ 数据库中没有模板数据！');
      console.log('💡 请运行以下命令初始化模板：');
      console.log('   POST http://your-server/api/templates/dev/reinitialize');
      return;
    }

    // 2. 按分类统计
    console.log('\n📂 按分类统计:');
    const categories = await prisma.gameTemplate.groupBy({
      by: ['category'],
      _count: true,
    });
    categories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat._count} 个模板`);
    });

    // 3. 列出所有模板
    console.log('\n📋 所有模板列表:');
    const templates = await prisma.gameTemplate.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        category: true,
        subcategory: true,
        isActive: true,
        isQuickStart: true,
        isVipOnly: true,
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    templates.forEach((template, index) => {
      const badges = [];
      if (template.isQuickStart) badges.push('⚡快速');
      if (template.isVipOnly) badges.push('👑VIP');
      if (!template.isActive) badges.push('❌未激活');
      
      console.log(`   ${index + 1}. [${template.category}] ${template.title}`);
      console.log(`      ID: ${template.id}`);
      console.log(`      子分类: ${template.subcategory || '无'}`);
      if (badges.length > 0) {
        console.log(`      标签: ${badges.join(' ')}`);
      }
      console.log('');
    });

    // 4. 检查快速开始模板
    const quickStartCount = await prisma.gameTemplate.count({
      where: { isQuickStart: true }
    });
    console.log(`⚡ 快速开始模板: ${quickStartCount} 个`);

    // 5. 检查VIP模板
    const vipCount = await prisma.gameTemplate.count({
      where: { isVipOnly: true }
    });
    console.log(`👑 VIP专属模板: ${vipCount} 个`);

    // 6. 检查未激活模板
    const inactiveCount = await prisma.gameTemplate.count({
      where: { isActive: false }
    });
    if (inactiveCount > 0) {
      console.log(`⚠️  未激活模板: ${inactiveCount} 个`);
    }

    console.log('\n✅ 检查完成！');

  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplates();

