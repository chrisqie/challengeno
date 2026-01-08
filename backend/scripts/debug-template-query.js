const { PrismaClient, VipTier } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugTemplateQuery() {
  try {
    console.log('🔍 调试模板查询逻辑...');

    // 1. 模拟admin用户的VIP检测
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

    console.log('👤 Admin用户信息:');
    console.log(`   - ID: ${admin.id}`);
    console.log(`   - 用户名: ${admin.username}`);
    console.log(`   - VIP状态: ${admin.isVip}`);
    console.log(`   - VIP过期时间: ${admin.vipExpiresAt}`);
    console.log(`   - 管理员: ${admin.isAdmin}`);

    // 2. 模拟VIP等级检测逻辑
    let userVipTier = null;
    if (admin?.isVip && (!admin.vipExpiresAt || admin.vipExpiresAt > new Date())) {
      if (admin.isAdmin) {
        userVipTier = 'ELITE';
      } else {
        userVipTier = 'BASIC';
      }
    }

    console.log(`\n🔧 检测到的VIP等级: ${userVipTier}`);

    // 3. 模拟查询条件构建
    const where = { isActive: true };
    
    if (!userVipTier) {
      where.isVipOnly = false;
      console.log('\n❌ 用户不是VIP，只查询免费模板');
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
      console.log('\n✅ 用户是VIP，查询所有可用模板');
    }

    console.log('\n📋 查询条件:');
    console.log(JSON.stringify(where, null, 2));

    // 4. 执行查询
    const templates = await prisma.gameTemplate.findMany({
      where,
      orderBy: [
        { isVipOnly: 'asc' },
        { vipTier: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log(`\n📊 查询结果: ${templates.length} 个模板`);

    const freeTemplates = templates.filter(t => !t.isVipOnly);
    const vipTemplates = templates.filter(t => t.isVipOnly);

    console.log(`   - 免费模板: ${freeTemplates.length} 个`);
    console.log(`   - VIP模板: ${vipTemplates.length} 个`);

    console.log('\n📋 所有查询到的模板:');
    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} ${template.isVipOnly ? `(VIP-${template.vipTier})` : '(免费)'}`);
    });

    // 5. 直接查询所有VIP模板（不使用条件）
    console.log('\n🔍 直接查询所有VIP模板:');
    const allVipTemplates = await prisma.gameTemplate.findMany({
      where: { isVipOnly: true, isActive: true },
      select: {
        id: true,
        name: true,
        title: true,
        vipTier: true
      }
    });

    console.log(`直接查询到 ${allVipTemplates.length} 个VIP模板:`);
    allVipTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} (${template.vipTier})`);
    });

    // 6. 测试VIP等级匹配
    console.log('\n🧪 测试VIP等级匹配:');
    for (const vipTemplate of allVipTemplates) {
      const matches = userVipTier === 'ELITE' || 
                     (userVipTier === 'PREMIUM' && ['PREMIUM', 'BASIC'].includes(vipTemplate.vipTier)) ||
                     (userVipTier === 'BASIC' && vipTemplate.vipTier === 'BASIC') ||
                     vipTemplate.vipTier === null;
      
      console.log(`   - ${vipTemplate.title} (${vipTemplate.vipTier}): ${matches ? '✅ 匹配' : '❌ 不匹配'}`);
    }

  } catch (error) {
    console.error('❌ 调试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  debugTemplateQuery();
}

module.exports = { debugTemplateQuery };
