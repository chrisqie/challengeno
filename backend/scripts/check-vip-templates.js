const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkVipTemplates() {
  try {
    console.log('🔍 检查VIP模板数据...');

    // 1. 检查所有模板
    const allTemplates = await prisma.gameTemplate.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        isVipOnly: true,
        vipTier: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 数据库中总共有 ${allTemplates.length} 个模板:`);
    allTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title}`);
      console.log(`   - name: ${template.name}`);
      console.log(`   - isVipOnly: ${template.isVipOnly}`);
      console.log(`   - vipTier: ${template.vipTier}`);
      console.log(`   - isActive: ${template.isActive}`);
      console.log(`   - 创建时间: ${template.createdAt}`);
      console.log('');
    });

    // 2. 专门查询VIP模板
    const vipTemplates = await prisma.gameTemplate.findMany({
      where: { isVipOnly: true },
      select: {
        id: true,
        name: true,
        title: true,
        vipTier: true,
        isActive: true
      }
    });

    console.log(`👑 VIP模板数量: ${vipTemplates.length}`);
    if (vipTemplates.length > 0) {
      vipTemplates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.title} (${template.vipTier})`);
      });
    } else {
      console.log('❌ 数据库中没有VIP模板！');
    }

    // 3. 检查最近的模板创建记录
    const recentTemplates = await prisma.gameTemplate.findMany({
      select: {
        name: true,
        title: true,
        isVipOnly: true,
        vipTier: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('\n📅 最近创建的5个模板:');
    recentTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} - ${template.createdAt} ${template.isVipOnly ? '(VIP)' : '(免费)'}`);
    });

    // 4. 检查是否有重复的模板名称
    const duplicateNames = await prisma.gameTemplate.groupBy({
      by: ['name'],
      _count: {
        name: true
      },
      having: {
        name: {
          _count: {
            gt: 1
          }
        }
      }
    });

    if (duplicateNames.length > 0) {
      console.log('\n⚠️  发现重复的模板名称:');
      duplicateNames.forEach(item => {
        console.log(`   - ${item.name}: ${item._count.name} 个`);
      });
    }

  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  checkVipTemplates();
}

module.exports = { checkVipTemplates };
