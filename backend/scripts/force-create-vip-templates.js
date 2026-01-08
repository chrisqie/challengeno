const { PrismaClient, VipTier } = require('@prisma/client');

const prisma = new PrismaClient();

async function forceCreateVipTemplates() {
  try {
    console.log('🚀 强制创建VIP模板...');

    // 1. 删除现有的VIP模板
    const deletedVip = await prisma.gameTemplate.deleteMany({
      where: { isVipOnly: true }
    });
    console.log(`✅ 删除了 ${deletedVip.count} 个现有VIP模板`);

    // 2. 创建VIP模板
    const vipTemplates = [
      {
        name: 'premium_fitness_tracker',
        title: '高级健身追踪',
        description: '专业级健身挑战，包含详细数据分析和个性化建议，通过科学的运动监测帮助您达到最佳健身效果',
        category: 'FITNESS',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 12,
        instructions: '使用专业健身app记录，提交详细的运动数据截图',
        exampleEvidence: '健身app显示心率、卡路里、运动轨迹的综合截图',
        isVipOnly: true,
        vipTier: VipTier.BASIC,
        uiTheme: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          accentColor: '#60A5FA',
          backgroundGradient: 'from-blue-50 to-indigo-100',
          cardStyle: 'premium',
          iconSet: 'fitness-pro'
        },
        features: {
          dataAnalytics: true,
          progressCharts: true,
          socialSharing: true,
          customReminders: true
        }
      },
      {
        name: 'mindfulness_journey',
        title: '正念冥想之旅',
        description: '21天正念冥想挑战，包含引导音频和进度追踪，帮助您建立内心平静和专注力',
        category: 'HEALTH',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 504, // 21天
        maxParticipants: 8,
        instructions: '每天完成15分钟正念冥想，记录心得体会',
        exampleEvidence: '冥想app完成记录截图，配上当日感悟',
        isVipOnly: true,
        vipTier: VipTier.PREMIUM,
        uiTheme: {
          primaryColor: '#10B981',
          secondaryColor: '#059669',
          accentColor: '#34D399',
          backgroundGradient: 'from-green-50 to-emerald-100',
          cardStyle: 'zen',
          iconSet: 'mindfulness'
        },
        features: {
          guidedAudio: true,
          progressJournal: true,
          moodTracking: true,
          communitySupport: true
        }
      },
      {
        name: 'elite_productivity',
        title: '精英生产力挑战',
        description: '高效时间管理和目标达成系统，适合追求卓越的用户，通过科学方法提升工作和生活效率',
        category: 'PERSONAL',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 720, // 30天
        maxParticipants: 6,
        instructions: '使用时间管理工具，每日完成设定目标并记录成果',
        exampleEvidence: '时间管理app截图，显示任务完成情况和时间分配',
        isVipOnly: true,
        vipTier: VipTier.ELITE,
        uiTheme: {
          primaryColor: '#F59E0B',
          secondaryColor: '#D97706',
          accentColor: '#FBBF24',
          backgroundGradient: 'from-yellow-50 to-amber-100',
          cardStyle: 'luxury',
          iconSet: 'productivity-elite'
        },
        features: {
          aiCoaching: true,
          personalizedPlans: true,
          advancedAnalytics: true,
          prioritySupport: true
        }
      },
      {
        name: 'vip_team_challenge',
        title: '团队协作挑战',
        description: '创建团队，与朋友一起完成协作目标，增强团队凝聚力和协作能力',
        category: 'PERSONAL',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 20, // VIP用户可以创建更大的游戏
        instructions: '邀请朋友组成团队，一起完成挑战。VIP用户可以创建更大规模的团队游戏',
        exampleEvidence: '团队活动照片、进度截图等',
        isVipOnly: true,
        vipTier: VipTier.BASIC,
        uiTheme: {
          primaryColor: '#8B5CF6',
          secondaryColor: '#7C3AED',
          accentColor: '#A78BFA',
          backgroundGradient: 'from-purple-50 to-violet-100',
          cardStyle: 'team',
          iconSet: 'team-collaboration'
        },
        features: {
          teamMode: true,
          moreParticipants: true,
          teamChat: true,
          leaderboard: true
        }
      }
    ];

    console.log(`📝 准备创建 ${vipTemplates.length} 个VIP模板...`);

    // 3. 逐个创建VIP模板
    for (const template of vipTemplates) {
      try {
        const created = await prisma.gameTemplate.create({
          data: template,
        });
        console.log(`✅ 创建成功: ${created.title} (${created.vipTier})`);
      } catch (error) {
        console.error(`❌ 创建失败: ${template.title}`, error.message);
      }
    }

    // 4. 验证创建结果
    const vipCount = await prisma.gameTemplate.count({
      where: { isVipOnly: true }
    });

    console.log(`\n🎉 VIP模板创建完成！总共 ${vipCount} 个VIP模板`);

    // 5. 显示所有VIP模板
    const allVipTemplates = await prisma.gameTemplate.findMany({
      where: { isVipOnly: true },
      select: {
        name: true,
        title: true,
        vipTier: true,
        isActive: true
      }
    });

    console.log('\n👑 VIP模板列表:');
    allVipTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} (${template.vipTier})`);
    });

  } catch (error) {
    console.error('❌ 强制创建VIP模板失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  forceCreateVipTemplates();
}

module.exports = { forceCreateVipTemplates };
