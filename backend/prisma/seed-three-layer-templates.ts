import { PrismaClient, GameCategory, EvidenceType, DifficultyLevel, RiskLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始添加三层模板数据...');

  // 添加快捷模板（零配置）
  const quickTemplates = [
    // 学习类
    {
      name: 'quick_language_learning',
      title: '英语学习挑战',
      description: '每天学习英语30分钟，通过背单词和练习口语提升英语水平。',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_LANGUAGE',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168, // 7天
      maxParticipants: 8,
      instructions: '每天提交学习截图或练习记录，包括学习时长和内容。',
      exampleEvidence: '英语学习app的学习记录截图',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_daily_reading',
      title: '每日阅读30分钟',
      description: '每天阅读30分钟，培养良好的阅读习惯，提升知识储备。',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_READING',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄阅读照片，包括书籍封面和阅读进度。',
      exampleEvidence: '正在阅读的书籍照片配上阅读笔记',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_skill_practice',
      title: '技能练习挑战',
      description: '每天练习一项技能30分钟，如编程、绘画、乐器等。',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_SKILL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天提交练习成果照片或视频，展示练习过程和进步。',
      exampleEvidence: '练习作品照片或练习过程视频',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 健身类
    {
      name: 'quick_gym_workout',
      title: '健身房训练',
      description: '每天进行45分钟健身房训练，包括力量训练和有氧运动。',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_STRENGTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天拍摄健身房训练照片，包括器械使用和运动记录。',
      exampleEvidence: '健身房训练照片和运动app记录截图',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.MEDIUM
    },
    {
      name: 'quick_running_challenge',
      title: '每日跑步5公里',
      description: '每天跑步5公里，提升心肺功能和身体素质。',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_CARDIO',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天提交跑步路线截图和完成时间记录。',
      exampleEvidence: '跑步app的路线和时间记录截图',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.MEDIUM
    },
    {
      name: 'quick_yoga_practice',
      title: '瑜伽冥想练习',
      description: '每天进行30分钟瑜伽练习，放松身心，提升柔韧性。',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_YOGA',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄瑜伽练习照片或视频，展示动作和练习时长。',
      exampleEvidence: '瑜伽练习照片和练习app记录',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 健康类
    {
      name: 'quick_early_wake_up',
      title: '6点早起健康挑战',
      description: '从7:00起床调整到6:00起床，通过提前睡觉等方式保证充足睡眠。',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_SLEEP',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天提交起床时间证明和晨间活动照片，展示早起后的积极状态。',
      exampleEvidence: '显示时间的起床自拍照和晨间活动照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_water_intake',
      title: '每日饮水2升挑战',
      description: '每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_DIET',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天记录饮水量并拍摄水杯照片，展示饮水进度。',
      exampleEvidence: '饮水记录app截图和水杯照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_meditation',
      title: '每日冥想15分钟',
      description: '每天进行15分钟冥想练习，缓解压力，提升专注力。',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_MENTAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天拍摄冥想环境照片和冥想app记录截图。',
      exampleEvidence: '冥想app的练习记录截图',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 个人成长类
    {
      name: 'quick_productivity_boost',
      title: '效率提升挑战',
      description: '每天使用番茄工作法完成3个专注时段，提升工作效率。',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_PRODUCTIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天提交番茄工作法app记录截图和完成任务清单。',
      exampleEvidence: '番茄工作法app记录和任务完成截图',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_creativity',
      title: '创意表达挑战',
      description: '每天进行30分钟创意活动，如写作、绘画、音乐创作等。',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_CREATIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天分享创意作品照片或视频，展示创作过程和成果。',
      exampleEvidence: '创意作品照片和创作过程记录',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_gratitude',
      title: '感恩日记挑战',
      description: '每天写下3件感恩的事情，培养积极心态和感恩意识。',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_GROWTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄感恩日记照片，分享感恩的事情和感受。',
      exampleEvidence: '手写感恩日记照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 生活方式类
    {
      name: 'quick_cooking',
      title: '每日健康烹饪',
      description: '每天自己烹饪一餐健康食物，提升烹饪技能和饮食质量。',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_COOKING',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天拍摄烹饪过程和成品照片，分享食谱和制作心得。',
      exampleEvidence: '烹饪过程和成品照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_organization',
      title: '整理收纳挑战',
      description: '每天整理一个区域，保持生活空间整洁有序。',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOME',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天拍摄整理前后对比照片，展示整理成果。',
      exampleEvidence: '整理前后对比照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 工作类
    {
      name: 'quick_startup',
      title: '创业项目每日进展',
      description: '每天推进创业项目，完成设定的里程碑任务。',
      category: GameCategory.WORK,
      subcategory: 'WORK_STARTUP',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 4,
      instructions: '每天提交项目进展截图和完成任务记录。',
      exampleEvidence: '项目管理工具截图和任务完成记录',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.MEDIUM
    }
  ];

  // 添加通用模板
  const generalTemplate = {
    name: 'general_custom',
    title: '通用自定义挑战',
    description: '完全自定义的挑战模板，适合特殊需求和创意挑战。',
    category: GameCategory.PERSONAL,
    subcategory: 'PERSONAL_GROWTH',
    evidenceType: EvidenceType.PHOTO,
    isAgeRestricted: false,
    defaultDurationHours: 168,
    maxParticipants: 8,
    instructions: '根据自定义配置提交相应的证据材料。',
    exampleEvidence: '根据挑战内容提交相关照片或视频',
    isActive: true,
    isQuickStart: false,
    difficultyLevel: DifficultyLevel.BEGINNER,
    riskLevel: RiskLevel.LOW
  };

  // 批量创建快捷模板
  for (const template of quickTemplates) {
    await prisma.gameTemplate.create({
      data: template
    });
    console.log(`✅ 创建快捷模板: ${template.title}`);
  }

  // 创建通用模板
  await prisma.gameTemplate.create({
    data: generalTemplate
  });
  console.log(`✅ 创建通用模板: ${generalTemplate.title}`);

  console.log('三层模板数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
