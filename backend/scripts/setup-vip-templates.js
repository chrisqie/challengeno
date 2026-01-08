const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupVipTemplates() {
  console.log('🎯 开始设置VIP模板...');

  try {
    // 1. 检查当前模板状态
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

    console.log(`📊 当前总模板数: ${allTemplates.length}`);
    
    const vipTemplates = allTemplates.filter(t => t.isVipOnly);
    console.log(`👑 当前VIP模板数: ${vipTemplates.length}`);

    if (vipTemplates.length > 0) {
      console.log('📋 现有VIP模板:');
      vipTemplates.forEach(t => {
        console.log(`  - ${t.title} (${t.vipTier || 'BASIC'})`);
      });
    }

    // 2. 如果VIP模板少于3个，创建更多
    if (vipTemplates.length < 3) {
      console.log('\n🔧 VIP模板数量不足，开始设置...');

      // 选择一些现有模板升级为VIP
      const templatesToUpgrade = [
        {
          name: 'language_learning',
          vipTier: 'BASIC',
          newTitle: '语言学习打卡 (VIP专享)',
          newDescription: '承诺每天学习外语30分钟，VIP用户享受学习进度分析和个性化建议',
          newMaxParticipants: 20
        },
        {
          name: 'weather_prediction', 
          vipTier: 'BASIC',
          newTitle: '天气预测挑战 (VIP专享)',
          newDescription: '预测未来一周的天气情况，VIP用户可参与更大规模的预测竞赛',
          newMaxParticipants: 25
        }
      ];

      // 3. 升级现有模板为VIP
      for (const upgrade of templatesToUpgrade) {
        try {
          const existing = await prisma.gameTemplate.findUnique({
            where: { name: upgrade.name }
          });

          if (existing && !existing.isVipOnly) {
            await prisma.gameTemplate.update({
              where: { name: upgrade.name },
              data: {
                isVipOnly: true,
                vipTier: upgrade.vipTier,
                title: upgrade.newTitle,
                description: upgrade.newDescription,
                maxParticipants: upgrade.newMaxParticipants,
                updatedAt: new Date()
              }
            });
            console.log(`✅ 升级为VIP模板: ${upgrade.newTitle}`);
          } else if (existing && existing.isVipOnly) {
            console.log(`⚠️  已是VIP模板，跳过: ${existing.title}`);
          } else {
            console.log(`❌ 模板不存在，跳过: ${upgrade.name}`);
          }
        } catch (error) {
          console.error(`❌ 升级模板失败 ${upgrade.name}:`, error.message);
        }
      }

      // 4. 创建全新的VIP模板
      const newVipTemplates = [
        {
          name: 'vip_premium_fitness',
          title: '高级健身追踪 (VIP专享)',
          description: '专业级健身挑战，包含详细数据分析和个性化建议，VIP用户专享高级功能',
          category: 'FITNESS',
          evidenceType: 'PHOTO',
          isAgeRestricted: false,
          defaultDurationHours: 336, // 14天
          maxParticipants: 20,
          instructions: '使用专业健身app记录，提交详细的运动数据截图。VIP用户可享受数据分析和进度追踪功能。',
          exampleEvidence: '健身app显示心率、卡路里、运动轨迹的综合截图',
          isVipOnly: true,
          vipTier: 'BASIC',
          isActive: true,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'vip_team_challenge',
          title: '团队协作挑战 (VIP专享)',
          description: '创建团队，与朋友一起完成协作目标，VIP用户可创建更大规模的团队游戏',
          category: 'PERSONAL',
          evidenceType: 'PHOTO',
          isAgeRestricted: false,
          defaultDurationHours: 168, // 7天
          maxParticipants: 30, // VIP用户可以创建更大的游戏
          instructions: '邀请朋友组成团队，一起完成挑战。VIP用户可以创建更大规模的团队游戏，享受团队管理功能。',
          exampleEvidence: '团队活动照片、进度截图、团队讨论记录等',
          isVipOnly: true,
          vipTier: 'PREMIUM',
          isActive: true,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // 5. 创建新VIP模板
      for (const template of newVipTemplates) {
        try {
          const existing = await prisma.gameTemplate.findUnique({
            where: { name: template.name }
          });

          if (!existing) {
            await prisma.gameTemplate.create({
              data: template
            });
            console.log(`✅ 创建新VIP模板: ${template.title}`);
          } else {
            console.log(`⚠️  模板已存在，跳过: ${template.title}`);
          }
        } catch (error) {
          console.error(`❌ 创建模板失败 ${template.title}:`, error.message);
        }
      }
    }

    // 6. 最终统计
    const finalTemplates = await prisma.gameTemplate.findMany({
      where: { isActive: true },
      select: {
        name: true,
        title: true,
        isVipOnly: true,
        vipTier: true
      }
    });

    const finalVipTemplates = finalTemplates.filter(t => t.isVipOnly);
    
    console.log('\n📊 最终统计:');
    console.log(`总模板数: ${finalTemplates.length}`);
    console.log(`VIP模板数: ${finalVipTemplates.length}`);
    console.log(`普通模板数: ${finalTemplates.length - finalVipTemplates.length}`);

    console.log('\n👑 VIP模板列表:');
    finalVipTemplates.forEach(t => {
      console.log(`  - ${t.title} (${t.vipTier || 'BASIC'})`);
    });

    console.log('\n🎉 VIP模板设置完成！');

  } catch (error) {
    console.error('❌ 设置VIP模板失败:', error);
    throw error;
  }
}

async function main() {
  try {
    await setupVipTemplates();
  } catch (error) {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
