import { PrismaClient, GameCategory, EvidenceType, DifficultyLevel, RiskLevel, VipTier } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 综合模板系统
 * 
 * 结构：
 * - 6大分类：HEALTH, FITNESS, LEARNING, PERSONAL, LIFESTYLE, WORK
 * - 每个分类3个小分类
 * - 每个小分类至少1个模板
 * - 额外的快捷模板（高频场景）
 * - VIP专属模板
 * 
 * 总计：约70-80个模板
 */

async function main() {
  console.log('🌱 开始创建综合模板系统...');

  // ============================================
  // 1. 健康类模板 (HEALTH)
  // ============================================
  const healthTemplates = [
    // 1.1 睡眠管理 (HEALTH_SLEEP)
    {
      name: 'health_sleep_early',
      title: '早睡早起挑战',
      description: '每天晚上10点前睡觉，早上6点前起床，养成健康作息习惯',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_SLEEP',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168, // 7天
      maxParticipants: 10,
      instructions: '每天晚上拍摄睡前照片（显示时间），早上拍摄起床照片（显示时间）',
      exampleEvidence: '晚上9:50的睡前照片，早上5:55的起床照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'health_sleep_quality',
      title: '睡眠质量优化',
      description: '优化睡眠环境和习惯：固定作息、睡前仪式、环境调整，全面提升睡眠质量',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_SLEEP',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 336, // 14天
      maxParticipants: 8,
      instructions: '记录睡眠时间、睡眠质量、睡前活动，使用睡眠监测app追踪数据',
      exampleEvidence: '睡眠日记+睡眠监测数据+睡眠环境照片',
      isActive: true,
      isQuickStart: false,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 1.2 饮食健康 (HEALTH_DIET)
    {
      name: 'health_diet_water',
      title: '每日饮水2升',
      description: '每天喝足2000毫升水，保持身体充足水分',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_DIET',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄饮水记录或饮水app截图',
      exampleEvidence: '饮水app显示今日已饮水2000ml的截图',
      isActive: true,
      isQuickStart: true, // 快捷模板
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'health_diet_balanced',
      title: '均衡饮食挑战',
      description: '每天摄入蔬菜、水果、蛋白质、碳水化合物，营养均衡',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_DIET',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天拍摄三餐照片，展示营养搭配',
      exampleEvidence: '早餐：全麦面包+鸡蛋+牛奶+水果的照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'health_diet_no_sugar',
      title: '戒糖挑战',
      description: '一周内不摄入添加糖，包括甜品、饮料、零食',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_DIET',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天拍摄饮食照片，证明无糖摄入',
      exampleEvidence: '三餐照片，无甜品、无含糖饮料',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.MEDIUM
    },

    // 1.3 心理健康 (HEALTH_MENTAL)
    {
      name: 'health_mental_meditation',
      title: '每日冥想15分钟',
      description: '每天进行15分钟正念冥想，缓解压力，提高专注力',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_MENTAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄冥想环境或冥想app记录',
      exampleEvidence: '冥想app显示完成15分钟冥想的截图',
      isActive: true,
      isQuickStart: true, // 快捷模板
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'health_mental_gratitude',
      title: '感恩日记挑战',
      description: '每天记录3件感恩的事情，培养积极心态',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_MENTAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天拍摄感恩日记照片',
      exampleEvidence: '日记本上写着"今天感恩：1.健康的身体 2.家人的陪伴 3.工作的机会"',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'health_mental_digital_detox',
      title: '数字排毒挑战',
      description: '每天减少2小时屏幕时间，远离社交媒体',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_MENTAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天截图手机屏幕使用时间，证明减少使用',
      exampleEvidence: '手机屏幕使用时间对比截图，显示减少2小时',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
  ];

  // ============================================
  // 2. 健身类模板 (FITNESS)
  // ============================================
  const fitnessTemplates = [
    // 2.1 有氧运动 (FITNESS_CARDIO)
    {
      name: 'fitness_cardio_running',
      title: '每日跑步5公里',
      description: '每天跑步5公里，提升心肺功能和耐力',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_CARDIO',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄跑步app记录截图，显示距离和时间',
      exampleEvidence: '跑步app显示5.2公里，用时30分钟的截图',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'fitness_cardio_steps',
      title: '每日万步挑战',
      description: '每天走路10000步，保持活力',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_CARDIO',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 15,
      instructions: '每天拍摄步数app截图',
      exampleEvidence: '手机健康app显示今日步数10523步',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'fitness_cardio_cycling',
      title: '骑行挑战',
      description: '每天骑行10公里，享受户外运动',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_CARDIO',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天拍摄骑行app记录或骑行照片',
      exampleEvidence: '骑行app显示10.5公里，用时35分钟',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 2.2 力量训练 (FITNESS_STRENGTH)
    {
      name: 'fitness_strength_gym',
      title: '健身房力量训练',
      description: '系统的健身房力量训练：器械训练、自由重量、复合动作，全面提升肌肉力量和体能',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_STRENGTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每次训练拍摄健身房照片或训练记录，记录训练动作、组数、重量',
      exampleEvidence: '健身房器械训练照片+训练日志+体能数据',
      isActive: true,
      isQuickStart: false,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.MEDIUM
    },
    {
      name: 'fitness_strength_pushups',
      title: '俯卧撑挑战',
      description: '每天完成50个俯卧撑，提升上肢力量',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_STRENGTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄俯卧撑训练照片或视频',
      exampleEvidence: '俯卧撑训练照片，配上完成数量记录',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 2.3 柔韧性训练 (FITNESS_FLEXIBILITY)
    {
      name: 'fitness_flexibility_yoga',
      title: '瑜伽练习挑战',
      description: '每天30分钟瑜伽练习，提高柔韧性和平衡',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_FLEXIBILITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄瑜伽练习照片或app记录',
      exampleEvidence: '瑜伽垫上练习照片，或瑜伽app完成记录',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'fitness_flexibility_stretching',
      title: '拉伸训练',
      description: '每天15分钟全身拉伸，缓解肌肉紧张',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_FLEXIBILITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄拉伸训练照片',
      exampleEvidence: '拉伸动作照片，显示时间',
      isActive: true,
      isQuickStart: false,  // 精细模板，有详细配置选项
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
  ];

  // ============================================
  // 3. 学习类模板 (LEARNING)
  // ============================================
  const learningTemplates = [
    // 3.1 语言学习 (LEARNING_LANGUAGE)
    {
      name: 'learning_language_english',
      title: '英语学习打卡',
      description: '每天学习英语30分钟，背单词、练听力、学语法',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_LANGUAGE',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 15,
      instructions: '每天拍摄学习app截图或学习笔记照片',
      exampleEvidence: '英语学习app显示今日学习30分钟的截图',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'learning_language_speaking',
      title: '口语练习挑战',
      description: '每天练习口语15分钟，提升表达能力',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_LANGUAGE',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄口语练习app记录或练习视频截图',
      exampleEvidence: '口语练习app显示完成15分钟练习',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 3.2 技能提升 (LEARNING_SKILL)
    {
      name: 'learning_skill_programming',
      title: '编程学习挑战',
      description: '每天编程练习1小时，提升技术能力',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_SKILL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄代码编辑器截图或学习平台进度',
      exampleEvidence: 'VS Code编辑器截图，显示今日编写的代码',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'learning_skill_design',
      title: '设计技能提升',
      description: '每天练习设计30分钟，学习PS、AI等工具',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_SKILL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄设计作品或学习进度',
      exampleEvidence: 'Photoshop界面截图，展示今日设计作品',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'learning_skill_music',
      title: '乐器练习挑战',
      description: '每天练习乐器30分钟，提升音乐技能',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_SKILL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天拍摄练习照片或视频截图',
      exampleEvidence: '弹钢琴的照片，配上练习时长记录',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 3.3 阅读习惯 (LEARNING_READING)
    {
      name: 'learning_reading_daily',
      title: '每日阅读30分钟',
      description: '每天阅读30分钟，培养阅读习惯',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_READING',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 15,
      instructions: '每天拍摄阅读照片，包括书籍和阅读进度',
      exampleEvidence: '正在阅读的书籍照片，配上阅读笔记',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'learning_reading_book',
      title: '一周读完一本书',
      description: '一周内读完一本书，提升知识储备',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_READING',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄阅读进度，最后提交读书笔记',
      exampleEvidence: '书籍封面+阅读进度+读书笔记照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
  ];

  // ============================================
  // 4. 个人成长类模板 (PERSONAL)
  // ============================================
  const personalTemplates = [
    // 4.1 效率提升 (PERSONAL_PRODUCTIVITY)
    {
      name: 'personal_productivity_pomodoro',
      title: '番茄工作法挑战',
      description: '每天使用番茄工作法完成4个番茄钟（2小时专注工作）',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_PRODUCTIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄番茄钟app记录截图',
      exampleEvidence: '番茄钟app显示今日完成4个番茄钟',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'personal_productivity_todo',
      title: '每日任务清单',
      description: '每天制定并完成至少5项任务',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_PRODUCTIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄任务清单和完成情况',
      exampleEvidence: '待办事项app显示5项任务已完成',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 4.2 创意表达 (PERSONAL_CREATIVITY)
    {
      name: 'personal_creativity_writing',
      title: '每日写作挑战',
      description: '每天写作500字，记录生活或创作故事',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_CREATIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄写作内容照片或字数统计',
      exampleEvidence: '写作app显示今日写作523字',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'personal_creativity_drawing',
      title: '每日绘画练习',
      description: '每天绘画30分钟，提升艺术创作能力',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_CREATIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '每天拍摄绘画作品照片',
      exampleEvidence: '今日绘画作品照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 4.3 自我提升 (PERSONAL_GROWTH)
    {
      name: 'personal_growth_reflection',
      title: '每日反思日记',
      description: '每天写反思日记，总结经验教训',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_GROWTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄反思日记照片',
      exampleEvidence: '日记本上的反思内容照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'personal_growth_learning',
      title: '每日学习新知识',
      description: '每天学习一个新知识点，持续成长',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_GROWTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄学习笔记或知识卡片',
      exampleEvidence: '今日学习的新知识笔记照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
  ];

  // ============================================
  // 5. 生活方式类模板 (LIFESTYLE)
  // ============================================
  const lifestyleTemplates = [
    // 5.1 居家生活 (LIFESTYLE_HOME)
    {
      name: 'lifestyle_home_cleaning',
      title: '每日整理收纳',
      description: '每天整理家中一个区域，保持整洁有序',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOME',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄整理前后对比照片',
      exampleEvidence: '书桌整理前后对比照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'lifestyle_home_cooking',
      title: '每日健康烹饪',
      description: '每天自己做饭，享受烹饪乐趣',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOME',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄烹饪过程或成品照片',
      exampleEvidence: '今日烹饪的菜品照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 5.2 社交活动 (LIFESTYLE_SOCIAL)
    {
      name: 'lifestyle_social_connection',
      title: '每日社交联系',
      description: '每天主动联系一位朋友或家人，增进感情',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_SOCIAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄聊天记录截图（隐藏隐私信息）',
      exampleEvidence: '与朋友的聊天记录截图',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'lifestyle_social_volunteer',
      title: '志愿服务挑战',
      description: '参与社区志愿活动，帮助他人',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_SOCIAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 336, // 14天
      maxParticipants: 8,
      instructions: '拍摄志愿服务活动照片',
      exampleEvidence: '参与社区清洁活动的照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 5.3 兴趣爱好 (LIFESTYLE_HOBBY)
    {
      name: 'lifestyle_hobby_photography',
      title: '每日摄影练习',
      description: '每天拍摄一张有意义的照片，提升摄影技能',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOBBY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天提交一张摄影作品',
      exampleEvidence: '今日拍摄的风景/人物/静物照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'lifestyle_hobby_movie',
      title: '电影观赏计划',
      description: '每周观看2部经典电影，丰富文化生活',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOBBY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 15,
      instructions: '拍摄观影照片或影评笔记',
      exampleEvidence: '电影海报+观影感想照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
  ];

  // ============================================
  // 6. 职业发展类模板 (WORK)
  // ============================================
  const careerTemplates = [
    // 6.1 创业项目 (CAREER_STARTUP)
    {
      name: 'career_startup_progress',
      title: '创业项目日进展',
      description: '每天推进创业项目，记录进展和成果',
      category: GameCategory.WORK,
      subcategory: 'CAREER_STARTUP',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天拍摄工作进展截图或成果照片',
      exampleEvidence: '项目进度表截图或产品原型照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.MEDIUM
    },
    {
      name: 'career_startup_plan',
      title: '商业计划完善',
      description: '每天完善商业计划的一个部分',
      category: GameCategory.WORK,
      subcategory: 'CAREER_STARTUP',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 6,
      instructions: '每天拍摄商业计划文档截图',
      exampleEvidence: '商业计划书某章节截图',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.MEDIUM
    },

    // 6.2 职场社交 (CAREER_NETWORKING)
    {
      name: 'career_networking_linkedin',
      title: '职场社交拓展',
      description: '每天主动联系一位行业人士，扩展人脉',
      category: GameCategory.WORK,
      subcategory: 'CAREER_NETWORKING',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '拍摄社交平台互动截图（隐藏隐私）',
      exampleEvidence: 'LinkedIn消息截图',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 6.3 职业技能 (CAREER_SKILLS)
    {
      name: 'career_skills_certification',
      title: '职业认证学习',
      description: '每天学习职业认证课程1小时',
      category: GameCategory.WORK,
      subcategory: 'CAREER_SKILLS',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄学习平台进度截图',
      exampleEvidence: '在线课程学习进度截图',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'career_skills_presentation',
      title: '演讲技能提升',
      description: '每天练习演讲15分钟，提升表达能力',
      category: GameCategory.WORK,
      subcategory: 'CAREER_SKILLS',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 8,
      instructions: '拍摄演讲练习视频截图或笔记',
      exampleEvidence: '演讲稿或练习视频截图',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
  ];

  // ============================================
  // 7. 额外的高频快捷模板
  // ============================================
  const quickStartTemplates = [
    // 健康快捷模板
    {
      name: 'quick_morning_routine',
      title: '晨间仪式养成',
      description: '每天早上完成固定的晨间仪式：起床、喝水、拉伸、冥想',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_MENTAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 15,
      instructions: '每天拍摄晨间仪式完成照片',
      exampleEvidence: '晨间拉伸照片+冥想照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_no_junk_food',
      title: '戒零食挑战',
      description: '一周内不吃任何零食和垃圾食品',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_DIET',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄三餐照片，证明无零食',
      exampleEvidence: '健康三餐照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 健身快捷模板
    {
      name: 'quick_plank_challenge',
      title: '平板支撑挑战',
      description: '每天平板支撑累计3分钟，增强核心力量',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_STRENGTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄平板支撑照片或计时器',
      exampleEvidence: '平板支撑姿势照片+计时器显示3分钟',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_stairs_climbing',
      title: '爬楼梯挑战',
      description: '每天爬楼梯10层，简单有效的有氧运动',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_CARDIO',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 15,
      instructions: '每天拍摄楼梯照片或运动app记录',
      exampleEvidence: '楼梯间照片+运动app显示爬楼10层',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 学习快捷模板
    {
      name: 'quick_vocabulary',
      title: '每日背单词50个',
      description: '每天背诵50个新单词，快速扩充词汇量',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_LANGUAGE',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 20,
      instructions: '每天拍摄单词app学习记录',
      exampleEvidence: '单词app显示今日学习50个单词',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_podcast_learning',
      title: '每日播客学习',
      description: '每天听一期教育类播客，利用碎片时间学习',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_SKILL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄播客app播放记录',
      exampleEvidence: '播客app显示今日收听完成',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 个人成长快捷模板
    {
      name: 'quick_no_phone_morning',
      title: '早晨不看手机',
      description: '每天早上起床后1小时内不看手机',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_PRODUCTIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 10,
      instructions: '每天拍摄手机屏幕使用时间截图',
      exampleEvidence: '屏幕使用时间显示早上7-8点无使用记录',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_compliment',
      title: '每日赞美他人',
      description: '每天真诚赞美至少一个人，传播正能量',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_GROWTH',
      evidenceType: EvidenceType.TEXT,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 15,
      instructions: '每天记录赞美的内容和对方反应',
      exampleEvidence: '今日赞美：称赞同事的工作成果，对方很开心',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },

    // 生活方式快捷模板
    {
      name: 'quick_bed_making',
      title: '每日整理床铺',
      description: '每天早上整理床铺，从小事开始养成好习惯',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOME',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 20,
      instructions: '每天拍摄整理好的床铺照片',
      exampleEvidence: '整洁的床铺照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'quick_family_time',
      title: '每日家庭时光',
      description: '每天至少30分钟高质量陪伴家人',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_SOCIAL',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 168,
      maxParticipants: 12,
      instructions: '每天拍摄家庭活动照片',
      exampleEvidence: '与家人一起用餐/聊天/游戏的照片',
      isActive: true,
      isQuickStart: true,
      difficultyLevel: DifficultyLevel.BEGINNER,
      riskLevel: RiskLevel.LOW
    },
  ];

  // ============================================
  // 8. VIP专属模板 (已删除，VIP功能通过通用模板实现)
  // ============================================
  const vipTemplates: any[] = [];

  // ============================================
  // 9. 精细模板（更多选项和配置）
  // ============================================
  const advancedTemplates = [
    // 健康精细模板
    {
      name: 'advanced_intermittent_fasting',
      title: '间歇性断食计划',
      description: '16:8间歇性断食，每天16小时断食，8小时进食窗口',
      category: GameCategory.HEALTH,
      subcategory: 'HEALTH_DIET',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: true,
      defaultDurationHours: 336, // 14天
      maxParticipants: 6,
      instructions: '每天记录进食时间窗口，拍摄饮食照片',
      exampleEvidence: '进食时间记录：12:00-20:00，三餐照片',
      isActive: true,
      isVipOnly: true,
      vipTier: VipTier.BASIC,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.MEDIUM
    },

    // 健身精细模板
    {
      name: 'advanced_marathon_training',
      title: '马拉松训练计划',
      description: '12周马拉松训练计划，逐步提升跑步能力',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_CARDIO',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 2016, // 12周
      maxParticipants: 6,
      instructions: '每次训练记录距离、配速、心率',
      exampleEvidence: '跑步app详细数据截图',
      isActive: true,
      isVipOnly: true,
      vipTier: VipTier.BASIC,
      difficultyLevel: DifficultyLevel.EXPERT,
      riskLevel: RiskLevel.MEDIUM
    },
    {
      name: 'advanced_muscle_building',
      title: '增肌训练计划',
      description: '系统的增肌训练：力量训练+营养补充+充足休息',
      category: GameCategory.FITNESS,
      subcategory: 'FITNESS_STRENGTH',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 672, // 4周
      maxParticipants: 6,
      instructions: '记录训练计划、饮食摄入、体重变化',
      exampleEvidence: '训练记录+饮食照片+体重数据',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.MEDIUM
    },

    // 学习精细模板
    {
      name: 'advanced_language_fluency',
      title: '语言流利度提升',
      description: '全方位语言学习：听说读写全面提升',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_LANGUAGE',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 672,
      maxParticipants: 8,
      instructions: '每天完成听力、口语、阅读、写作练习',
      exampleEvidence: '各项练习完成记录截图',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'advanced_book_club',
      title: '读书会挑战',
      description: '深度阅读+讨论分享，每周读完一本书并分享心得',
      category: GameCategory.LEARNING,
      subcategory: 'LEARNING_READING',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 672,
      maxParticipants: 10,
      instructions: '每周提交读书笔记和讨论记录',
      exampleEvidence: '读书笔记+讨论截图',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 个人成长精细模板
    {
      name: 'advanced_habit_stacking',
      title: '习惯叠加计划',
      description: '同时养成多个好习惯，通过习惯叠加提升效率',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_PRODUCTIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 336,
      maxParticipants: 8,
      instructions: '每天完成习惯清单，记录完成情况',
      exampleEvidence: '习惯追踪表照片',
      isActive: true,
      isVipOnly: true,
      vipTier: VipTier.BASIC,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'advanced_creative_project',
      title: '创意项目完成',
      description: '完成一个完整的创意项目：写作、绘画、音乐等',
      category: GameCategory.PERSONAL,
      subcategory: 'PERSONAL_CREATIVITY',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 672,
      maxParticipants: 6,
      instructions: '每天记录项目进展，最后提交完整作品',
      exampleEvidence: '项目进度照片+最终作品',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.LOW
    },

    // 生活方式精细模板
    {
      name: 'advanced_minimalism',
      title: '极简生活挑战',
      description: '30天极简生活：断舍离、减少物欲、专注重要事物',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOME',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 720, // 30天
      maxParticipants: 8,
      instructions: '每天记录断舍离进展，拍摄整理成果',
      exampleEvidence: '整理前后对比照片',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },
    {
      name: 'advanced_sustainable_living',
      title: '可持续生活方式',
      description: '践行环保生活：减少塑料、垃圾分类、节能减排',
      category: GameCategory.LIFESTYLE,
      subcategory: 'LIFESTYLE_HOME',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 336,
      maxParticipants: 10,
      instructions: '每天记录环保行动',
      exampleEvidence: '环保行动照片：自带购物袋、垃圾分类等',
      isActive: true,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      riskLevel: RiskLevel.LOW
    },

    // 职业发展精细模板
    {
      name: 'advanced_side_hustle',
      title: '副业启动计划',
      description: '启动并运营一个副业项目，增加收入来源',
      category: GameCategory.WORK,
      subcategory: 'CAREER_STARTUP',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 672,
      maxParticipants: 6,
      instructions: '每天记录副业进展和收入',
      exampleEvidence: '项目进展截图+收入记录',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.MEDIUM
    },
    {
      name: 'advanced_leadership_development',
      title: '领导力提升计划',
      description: '系统提升领导力：沟通、决策、团队管理',
      category: GameCategory.WORK,
      subcategory: 'CAREER_SKILLS',
      evidenceType: EvidenceType.PHOTO,
      isAgeRestricted: false,
      defaultDurationHours: 672,
      maxParticipants: 8,
      instructions: '每天完成领导力练习，记录实践成果',
      exampleEvidence: '领导力实践记录+团队反馈',
      isActive: true,
      difficultyLevel: DifficultyLevel.ADVANCED,
      riskLevel: RiskLevel.LOW
    },
  ];

  // 通用模板（VIP专享）
  const generalTemplate = {
    name: 'general_custom',
    title: '通用自定义挑战',
    description: '完全自定义的挑战模板，适合特殊需求和创意挑战。VIP专享功能，提供最大的灵活性。',
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
    riskLevel: RiskLevel.LOW,
    isVipOnly: true,
    vipTier: VipTier.BASIC
  };

  // 添加所有模板到总列表
  const allTemplatesArray = [
    ...healthTemplates,
    ...fitnessTemplates,
    ...learningTemplates,
    ...personalTemplates,
    ...lifestyleTemplates,
    ...careerTemplates,
    ...quickStartTemplates,
    ...advancedTemplates,
    ...vipTemplates,
    generalTemplate  // 添加通用模板
  ];

  // 批量创建或更新模板
  for (const template of allTemplatesArray) {
    try {
      await prisma.gameTemplate.upsert({
        where: { name: template.name },
        update: template as any,
        create: template as any
      });
      console.log(`✅ 创建/更新模板: ${template.title} (${template.subcategory})`);
    } catch (error: any) {
      console.error(`❌ 处理模板失败: ${template.name}`, error.message);
    }
  }

  console.log('');
  console.log('✅ 综合模板系统创建完成！');
  console.log('');
  console.log('📊 模板统计：');
  console.log(`   - 健康类 (HEALTH): ${healthTemplates.length} 个`);
  console.log(`   - 健身类 (FITNESS): ${fitnessTemplates.length} 个`);
  console.log(`   - 学习类 (LEARNING): ${learningTemplates.length} 个`);
  console.log(`   - 个人成长类 (PERSONAL): ${personalTemplates.length} 个`);
  console.log(`   - 生活方式类 (LIFESTYLE): ${lifestyleTemplates.length} 个`);
  console.log(`   - 职业发展类 (WORK): ${careerTemplates.length} 个`);
  console.log(`   - 快捷模板: ${quickStartTemplates.length} 个`);
  console.log(`   - 精细模板: ${advancedTemplates.length} 个`);
  console.log(`   - VIP专属: ${vipTemplates.length + 1} 个（含通用模板）`);
  console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   📦 总计: ${allTemplatesArray.length} 个模板`);
  console.log('');
  console.log('📋 覆盖情况：');
  console.log('   ✅ 6个大分类 × 3个小分类 = 18个小分类');
  console.log('   ✅ 每个小分类至少1个模板');
  console.log('   ✅ 高频场景有多个快捷模板');
  console.log('   ✅ 深度用户有精细模板');
  console.log('   ✅ VIP用户有专属高级功能');
  console.log('');
  console.log('🎯 商业化策略：');
  console.log('   💚 普通用户：');
  console.log('      - 可使用所有免费模板（基础+快捷+精细）');
  console.log('      - 满足日常挑战需求');
  console.log('   💎 VIP用户：');
  console.log('      - 通用自定义模板（完全自由配置）');
  console.log('      - 高级专属模板（间歇性断食、马拉松等）');
  console.log('      - 团队协作挑战（更大规模）');
  console.log('      - 私密房间（邀请制）');
  console.log('      - 更高参与人数上限');
  console.log('   🚀 引导策略：');
  console.log('      - 免费模板提供优质体验');
  console.log('      - 特殊需求引导升级VIP');
  console.log('      - VIP功能突出高级感和专属性');
}

main()
  .catch((e) => {
    console.error('❌ 模板初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

