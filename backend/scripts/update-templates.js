const { PrismaClient, VipTier } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateTemplates() {
  try {
    console.log('🚀 开始更新游戏模板...');

    // 删除现有模板
    await prisma.gameTemplate.deleteMany({});
    console.log('✅ 已清除现有模板');

    // 直接创建模板数据
    const templates = [
      {
        name: 'daily_exercise',
        title: '每日运动挑战',
        description: '承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯',
        category: 'FITNESS',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 6,
        instructions: '每天拍摄运动照片或视频作为证据，包括运动类型和时长',
        exampleEvidence: '跑步30分钟的照片，显示运动app记录',
      },
      {
        name: 'early_wake_up',
        title: '早起挑战',
        description: '承诺每天早上6点前起床，培养早睡早起的健康作息习惯，提高一天的工作和学习效率，享受清晨的宁静时光',
        category: 'HEALTH',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 8,
        instructions: '每天早上6点前拍摄起床照片，显示时间',
        exampleEvidence: '显示时间的起床自拍照',
      },
      {
        name: 'reading_habit',
        title: '每日阅读',
        description: '承诺每天阅读至少30分钟，培养良好的阅读习惯，通过持续学习提升个人知识储备和思维能力，享受阅读带来的精神财富',
        category: 'LEARNING',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 336,
        maxParticipants: 10,
        instructions: '每天拍摄阅读照片，包括书籍和阅读时长记录',
        exampleEvidence: '正在阅读的书籍照片，配上阅读笔记',
      },
      {
        name: 'water_intake',
        title: '每日饮水',
        description: '承诺每天喝足8杯水（约2000毫升），保持身体充足的水分摄入，促进新陈代谢，维护身体健康和皮肤状态',
        category: 'HEALTH',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 12,
        instructions: '每天记录饮水量，拍摄水杯或饮水app截图',
        exampleEvidence: '显示当日饮水量的app截图',
      },
      {
        name: 'meditation',
        title: '冥想练习',
        description: '承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式',
        category: 'HEALTH',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 336,
        maxParticipants: 8,
        instructions: '每天拍摄冥想环境或冥想app记录',
        exampleEvidence: '冥想app显示完成15分钟冥想的截图',
      },
      {
        name: 'no_social_media',
        title: '戒断社交媒体',
        description: '承诺一周内不使用社交媒体平台，减少数字设备依赖，专注于现实生活中的人际交往和个人成长，提高生活质量',
        category: 'PERSONAL',
        evidenceType: 'PHOTO',
        isAgeRestricted: true,
        defaultDurationHours: 168,
        maxParticipants: 6,
        instructions: '每天截图手机使用时间，证明未使用社交媒体',
        exampleEvidence: '手机屏幕使用时间截图，显示社交媒体使用时间为0',
      },
      {
        name: 'weather_prediction',
        title: '天气预测挑战',
        description: '预测未来一周的天气情况，锻炼观察能力和逻辑推理能力，通过关注天气变化提高对自然环境的敏感度和预测准确性',
        category: 'WEATHER',
        evidenceType: 'TEXT',
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 20,
        instructions: '每天提交对次日天气的预测，包括温度和天气状况',
        exampleEvidence: '明天最高温度25°C，多云转晴',
      },
      {
        name: 'language_learning',
        title: '语言学习打卡',
        description: '承诺每天学习外语30分钟，通过持续的语言学习提高外语水平，拓展国际视野，为未来的学习和工作打下坚实基础',
        category: 'LEARNING',
        evidenceType: 'PHOTO',
        isAgeRestricted: false,
        defaultDurationHours: 336,
        maxParticipants: 15,
        instructions: '每天拍摄学习进度截图或学习笔记',
        exampleEvidence: '语言学习app显示今日完成30分钟学习的截图',
      },
    ];

    // VIP专属模板
    const vipTemplates = [
      {
        name: 'premium_fitness_tracker',
        title: '高级健身追踪',
        description: '专业级健身挑战，包含详细数据分析和个性化建议',
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
        description: '21天正念冥想挑战，包含引导音频和进度追踪',
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
        description: '高效时间管理和目标达成系统，适合追求卓越的用户',
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
        description: '创建团队，与朋友一起完成协作目标，增强团队凝聚力',
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

    // 创建普通模板
    for (const template of templates) {
      await prisma.gameTemplate.create({
        data: template,
      });
    }

    // 创建VIP模板
    for (const template of vipTemplates) {
      await prisma.gameTemplate.create({
        data: template,
      });
    }
    console.log('✅ 模板更新完成！');

    // 显示更新后的模板数量
    const count = await prisma.gameTemplate.count();
    console.log(`📊 总共创建了 ${count} 个模板`);

  } catch (error) {
    console.error('❌ 更新模板失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updateTemplates();
}

module.exports = { updateTemplates };
