const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugTemplates() {
  try {
    console.log('🔍 开始调试模板数据...');

    // 1. 检查所有模板
    const allTemplates = await prisma.gameTemplate.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        isVipOnly: true,
        vipTier: true,
        isActive: true
      }
    });

    console.log(`📊 数据库中总共有 ${allTemplates.length} 个模板:`);
    allTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title}`);
      console.log(`   - name: ${template.name}`);
      console.log(`   - isVipOnly: ${template.isVipOnly}`);
      console.log(`   - vipTier: ${template.vipTier}`);
      console.log(`   - isActive: ${template.isActive}`);
      console.log('');
    });

    // 2. 检查VIP模板
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
    vipTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} (${template.vipTier})`);
    });

    // 3. 检查admin用户
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: {
        id: true,
        username: true,
        isVip: true,
        vipExpiresAt: true,
        isAdmin: true
      }
    });

    console.log('\n👤 Admin用户信息:');
    if (admin) {
      console.log(`   - ID: ${admin.id}`);
      console.log(`   - 用户名: ${admin.username}`);
      console.log(`   - 是否VIP: ${admin.isVip}`);
      console.log(`   - VIP过期时间: ${admin.vipExpiresAt}`);
      console.log(`   - 是否管理员: ${admin.isAdmin}`);
    } else {
      console.log('   - 未找到admin用户');
    }

    // 4. 模拟API调用逻辑
    console.log('\n🔧 模拟API调用逻辑:');
    if (admin) {
      let userVipTier = null;
      
      // 检查VIP是否有效
      if (admin.isVip && (!admin.vipExpiresAt || admin.vipExpiresAt > new Date())) {
        // 管理员默认为最高等级VIP
        if (admin.isAdmin) {
          userVipTier = 'ELITE';
        } else {
          userVipTier = 'BASIC';
        }
      }

      console.log(`   - 检测到的VIP等级: ${userVipTier}`);

      // 模拟查询逻辑
      const where = { isActive: true };
      
      if (!userVipTier) {
        where.isVipOnly = false;
      } else {
        where.OR = [
          { isVipOnly: false },
          {
            isVipOnly: true,
            OR: [
              { vipTier: null },
              { vipTier: userVipTier },
              ...(userVipTier === 'ELITE' ? [
                { vipTier: 'PREMIUM' },
                { vipTier: 'BASIC' }
              ] : userVipTier === 'PREMIUM' ? [
                { vipTier: 'BASIC' }
              ] : [])
            ]
          }
        ];
      }

      console.log('   - 查询条件:', JSON.stringify(where, null, 2));

      const filteredTemplates = await prisma.gameTemplate.findMany({
        where,
        select: {
          id: true,
          name: true,
          title: true,
          isVipOnly: true,
          vipTier: true
        },
        orderBy: [
          { isVipOnly: 'asc' },
          { vipTier: 'asc' },
          { name: 'asc' }
        ]
      });

      console.log(`   - 过滤后的模板数量: ${filteredTemplates.length}`);
      console.log('   - 模板列表:');
      filteredTemplates.forEach((template, index) => {
        console.log(`     ${index + 1}. ${template.title} ${template.isVipOnly ? `(VIP-${template.vipTier})` : '(免费)'}`);
      });
    }

  } catch (error) {
    console.error('❌ 调试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  debugTemplates();
}

module.exports = { debugTemplates };
