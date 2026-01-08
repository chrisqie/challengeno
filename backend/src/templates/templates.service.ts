import { Injectable, OnModuleInit, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameCategory, EvidenceType, VipTier, DifficultyLevel, RiskLevel } from '@prisma/client';
import { READING_CHALLENGE_CONFIG, READING_EVIDENCE_CONFIG } from './types/template-config.types';

export interface TemplateFilters {
  category?: GameCategory;
  subcategory?: string;
  difficultyLevel?: DifficultyLevel;
  riskLevel?: RiskLevel;
  isQuickStart?: boolean;
  isVipOnly?: boolean;
  vipTier?: VipTier;
  language?: string; // Language code: 'en', 'es', 'ja'
}

@Injectable()
export class TemplatesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultTemplates();
  }

  // 强制重新初始化模板（用于开发环境）
  async forceReinitializeTemplates() {
    console.log('🔄 强制重新初始化模板...');

    try {
      // 删除所有现有模板
      const deleteResult = await this.prisma.gameTemplate.deleteMany({});
      console.log(`🗑️ 已删除 ${deleteResult.count} 个现有模板`);

      // 强制重新创建模板（跳过检查）
      await this.createDefaultTemplates();

      // 检查创建结果
      const finalCount = await this.prisma.gameTemplate.count();
      console.log(`✅ 模板重新初始化完成，当前共有 ${finalCount} 个模板`);

      return { success: true, count: finalCount };
    } catch (error) {
      console.error('❌ 模板初始化失败:', error);
      throw error;
    }
  }

  // 获取模板数量
  async getTemplateCount() {
    return await this.prisma.gameTemplate.count();
  }

  async findAll(userVipTier?: VipTier | null, filters?: TemplateFilters) {
    const whereClause: any = {
      isActive: true,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.subcategory && { subcategory: filters.subcategory }),
      ...(filters?.difficultyLevel && { difficultyLevel: filters.difficultyLevel }),
      ...(filters?.riskLevel && { riskLevel: filters.riskLevel }),
      ...(filters?.isQuickStart !== undefined && { isQuickStart: filters.isQuickStart }),
      ...(filters?.isVipOnly !== undefined && { isVipOnly: filters.isVipOnly }),
      ...(filters?.vipTier && { vipTier: filters.vipTier })
    };

    // 获取所有活跃模板
    const allTemplates = await this.prisma.gameTemplate.findMany({
      where: whereClause,
      orderBy: [
        { isQuickStart: 'desc' }, // 快速开始模板优先
        { isVipOnly: 'asc' },     // 免费模板优先
        { usageCount: 'desc' },   // 使用次数多的优先
        { vipTier: 'asc' },       // 低等级VIP模板优先
        { name: 'asc' }
      ],
    });

    // 所有用户都能看到所有模板（包括VIP模板）
    // 但是会在前端标识哪些需要VIP权限
    const language = filters?.language || 'en'; // Default to English

    return allTemplates.map(template => {
      // 添加用户是否有权限使用此模板的标识
      const canUse = this.canUserUseTemplate(template, userVipTier);

      // Get translated fields based on language
      const translatedTemplate = this.getTranslatedTemplate(template, language);

      return {
        ...template,
        ...translatedTemplate, // Override with translated fields
        canUse, // 用户是否可以使用此模板
        requiresVip: template.isVipOnly, // 是否需要VIP
        requiredVipTier: template.vipTier // 需要的VIP等级
      };
    });
  }

  // Get translated template fields based on language
  private getTranslatedTemplate(template: any, language: string) {
    const translations: any = {};

    // Title translation
    if (template.titleTranslations && template.titleTranslations[language]) {
      translations.title = template.titleTranslations[language];
    }

    // Description translation
    if (template.descriptionTranslations && template.descriptionTranslations[language]) {
      translations.description = template.descriptionTranslations[language];
    }

    // Instructions translation
    if (template.instructionsTranslations && template.instructionsTranslations[language]) {
      translations.instructions = template.instructionsTranslations[language];
    }

    // Example evidence translation
    if (template.exampleEvidenceTranslations && template.exampleEvidenceTranslations[language]) {
      translations.exampleEvidence = template.exampleEvidenceTranslations[language];
    }

    return translations;
  }

  // 检查用户是否可以使用模板
  private canUserUseTemplate(template: any, userVipTier?: VipTier | null): boolean {
    // 免费模板所有人都能用
    if (!template.isVipOnly) {
      return true;
    }

    // VIP模板需要VIP权限
    if (!userVipTier) {
      return false;
    }

    // 没有指定等级的VIP模板，所有VIP都能用
    if (!template.vipTier) {
      return true;
    }

    // 检查用户VIP等级是否足够
    const tierLevels = {
      [VipTier.BASIC]: 1,
      [VipTier.PREMIUM]: 2,
      [VipTier.ELITE]: 3
    };

    const userLevel = tierLevels[userVipTier] || 0;
    const requiredLevel = tierLevels[template.vipTier] || 0;

    return userLevel >= requiredLevel;
  }

  async findById(id: string) {
    return this.prisma.gameTemplate.findUnique({
      where: { id },
    });
  }

  async findByCategory(category: GameCategory, subcategory?: string, userVipTier?: VipTier | null) {
    const whereClause: any = {
      category,
      isActive: true,
      ...(subcategory && { subcategory })
    };

    const templates = await this.prisma.gameTemplate.findMany({
      where: whereClause,
      orderBy: [
        { isQuickStart: 'desc' },
        { usageCount: 'desc' },
        { name: 'asc' }
      ],
    });

    return templates.map(template => ({
      ...template,
      canUse: this.canUserUseTemplate(template, userVipTier),
      requiresVip: template.isVipOnly,
      requiredVipTier: template.vipTier
    }));
  }

  // 获取快速开始模板
  async getQuickStartTemplates(userVipTier?: VipTier | null) {
    return this.findAll(userVipTier, { isQuickStart: true });
  }

  // 获取分类统计
  async getCategoryStats(userVipTier?: VipTier | null) {
    const whereClause: any = {
      isActive: true
    };

    const stats = await this.prisma.gameTemplate.groupBy({
      by: ['category', 'subcategory'],
      where: whereClause,
      _count: {
        id: true
      },
      orderBy: {
        category: 'asc'
      }
    });

    // 按大分类组织数据
    const categoryStats = stats.reduce((acc, stat) => {
      if (!acc[stat.category]) {
        acc[stat.category] = {
          category: stat.category,
          totalTemplates: 0,
          subcategories: {}
        };
      }

      acc[stat.category].totalTemplates += stat._count.id;
      acc[stat.category].subcategories[stat.subcategory] = stat._count.id;

      return acc;
    }, {} as any);

    return Object.values(categoryStats);
  }

  // 搜索模板
  async searchTemplates(query: string, userVipTier?: VipTier | null) {
    const templates = await this.prisma.gameTemplate.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { subcategory: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { usageCount: 'desc' },
      take: 20
    });

    return templates.map(template => ({
      ...template,
      canUse: this.canUserUseTemplate(template, userVipTier),
      requiresVip: template.isVipOnly,
      requiredVipTier: template.vipTier
    }));
  }

  // 更新模板使用次数
  async incrementUsageCount(templateId: string) {
    await this.prisma.gameTemplate.update({
      where: { id: templateId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    });
  }

  private async seedDefaultTemplates() {
    // 检查是否已有模板，如果有则跳过初始化
    const existingTemplatesCount = await this.prisma.gameTemplate.count();
    if (existingTemplatesCount > 0) {
      console.log(`✅ 已存在 ${existingTemplatesCount} 个模板，跳过初始化`);
      return;
    }

    await this.createDefaultTemplates();
  }

  // 直接创建默认模板（不检查是否已存在）
  private async createDefaultTemplates() {
    console.log('🌱 开始创建默认模板...');
    let successCount = 0;
    let failCount = 0;

    const templates = [
      {
        name: 'daily_exercise',
        title: '每日运动挑战',
        description: '承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯',
        category: GameCategory.FITNESS,
        subcategory: 'FITNESS_CARDIO',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 6,
        instructions: '每天拍摄运动照片或视频作为证据，包括运动类型和时长',
        exampleEvidence: '跑步30分钟的照片，显示运动app记录',
      },
      {
        name: 'early_wake_up',
        title: '早起挑战',
        description: '承诺每天早上6点前起床，培养早睡早起的健康作息习惯，提高一天的工作和学习效率，享受清晨的宁静时光',
        category: GameCategory.HEALTH,
        subcategory: 'HEALTH_SLEEP',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 8,
        instructions: '每天早上6点前拍摄起床照片，显示时间',
        exampleEvidence: '显示时间的起床自拍照',
      },
      // 学习成长类模板
      {
        name: 'daily_reading',
        title: '每日阅读挑战',
        description: '承诺每天阅读至少30分钟，培养良好的阅读习惯，提升知识储备和思维能力',
        category: GameCategory.LEARNING,
        subcategory: 'LEARNING_READING',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 10,
        instructions: '每天拍摄正在阅读的照片，包括书籍封面和阅读环境',
        exampleEvidence: '手持书籍阅读的照片，显示书名和页数',
      },
      {
        name: 'language_learning',
        title: '外语学习打卡',
        description: '每天坚持学习外语，通过持续练习提高语言水平，可以是背单词、听力练习或口语对话',
        category: GameCategory.LEARNING,
        subcategory: 'LEARNING_LANGUAGE',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 8,
        instructions: '拍摄学习app界面、笔记或练习材料的照片',
        exampleEvidence: '单词本、学习app进度截图或口语练习视频',
      },
      {
        name: 'skill_practice',
        title: '技能练习挑战',
        description: '每天练习一项技能，如乐器演奏、绘画、编程或手工制作，通过持续练习提升专业能力',
        category: GameCategory.LEARNING,
        subcategory: 'LEARNING_SKILL',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 6,
        instructions: '拍摄练习过程或作品的照片/视频',
        exampleEvidence: '弹奏乐器的视频、绘画作品或代码截图',
      },
      // 健身运动类模板
      {
        name: 'running_challenge',
        title: '跑步训练计划',
        description: '制定跑步训练计划，逐步提升跑步距离和速度，增强心肺功能和体能',
        category: GameCategory.FITNESS,
        subcategory: 'FITNESS_CARDIO',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 504, // 21天
        maxParticipants: 12,
        instructions: '每次跑步后拍摄运动app记录或跑步路线截图',
        exampleEvidence: '跑步app显示距离、时间和路线的截图',
      },
      {
        name: 'gym_workout',
        title: '健身房训练',
        description: '定期进行力量训练和器械锻炼，塑造身材，增强肌肉力量和耐力',
        category: GameCategory.FITNESS,
        subcategory: 'FITNESS_STRENGTH',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 8,
        instructions: '拍摄健身房训练照片，包括使用的器械和训练动作',
        exampleEvidence: '在健身房进行器械训练的照片',
      },
      {
        name: 'yoga_practice',
        title: '瑜伽冥想练习',
        description: '每天进行瑜伽练习，提高身体柔韧性，缓解压力，达到身心平衡',
        category: GameCategory.FITNESS,
        subcategory: 'FITNESS_YOGA',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 10,
        instructions: '拍摄瑜伽练习照片或视频，展示瑜伽动作',
        exampleEvidence: '瑜伽垫上练习瑜伽动作的照片',
      },
      // 个人发展类模板
      {
        name: 'productivity_boost',
        title: '效率提升挑战',
        description: '通过时间管理技巧和工作方法优化，提高工作和学习效率',
        category: GameCategory.PERSONAL,
        subcategory: 'PERSONAL_PRODUCTIVITY',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 8,
        instructions: '拍摄时间管理工具、待办清单或工作成果的照片',
        exampleEvidence: '完成的任务清单或时间管理app截图',
      },
      {
        name: 'creative_expression',
        title: '创意表达挑战',
        description: '每天进行创意活动，如绘画、写作、摄影或手工制作，激发创造力',
        category: GameCategory.PERSONAL,
        subcategory: 'PERSONAL_CREATIVITY',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 10,
        instructions: '拍摄创作过程或作品的照片',
        exampleEvidence: '绘画作品、手工制品或摄影作品',
      },
      {
        name: 'water_intake',
        title: '每日饮水',
        description: '承诺每天喝足8杯水（约2000毫升），保持身体充足的水分摄入，促进新陈代谢，维护身体健康和皮肤状态',
        category: GameCategory.HEALTH,
        subcategory: 'HEALTH_DIET',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 12,
        instructions: '每天记录饮水量，拍摄水杯或饮水app截图',
        exampleEvidence: '显示当日饮水量的app截图',
      },
      // 生活方式类模板
      {
        name: 'cooking_challenge',
        title: '烹饪技能提升',
        description: '每天尝试制作不同的菜品，提升烹饪技能，享受美食制作的乐趣',
        category: GameCategory.LIFESTYLE,
        subcategory: 'LIFESTYLE_COOKING',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 8,
        instructions: '拍摄烹饪过程和完成的菜品照片',
        exampleEvidence: '制作完成的菜品照片，展示色香味',
      },
      {
        name: 'home_organization',
        title: '居家整理挑战',
        description: '每天整理家中的一个区域，创造整洁有序的生活环境',
        category: GameCategory.LIFESTYLE,
        subcategory: 'LIFESTYLE_HOME',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 10,
        instructions: '拍摄整理前后的对比照片',
        exampleEvidence: '整理后的房间或储物空间照片',
      },
      {
        name: 'gardening_hobby',
        title: '园艺种植体验',
        description: '种植花草或蔬菜，体验园艺的乐趣，观察植物的生长过程',
        category: GameCategory.LIFESTYLE,
        subcategory: 'LIFESTYLE_HOME',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 672, // 28天
        maxParticipants: 6,
        instructions: '拍摄植物生长过程的照片',
        exampleEvidence: '种子发芽、植物生长的阶段性照片',
      },
      // 社交娱乐类模板
      {
        name: 'social_connection',
        title: '社交联系挑战',
        description: '每天主动联系一位朋友或家人，增进人际关系，扩展社交圈',
        category: GameCategory.SOCIAL,
        subcategory: 'SOCIAL_FRIENDSHIP',
        evidenceType: EvidenceType.TEXT,
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 12,
        instructions: '记录每天的社交活动和感受',
        exampleEvidence: '与朋友聊天的截图或聚会照片（保护隐私）',
      },
      {
        name: 'gratitude_journal',
        title: '感恩日记记录',
        description: '每天记录三件感恩的事情，培养积极心态，提升幸福感',
        category: GameCategory.PERSONAL,
        subcategory: 'PERSONAL_PRODUCTIVITY',
        evidenceType: EvidenceType.TEXT,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 15,
        instructions: '每天写下感恩的事情和感受',
        exampleEvidence: '感恩日记的文字记录',
      },
      {
        name: 'meditation',
        title: '冥想练习',
        description: '承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式',
        category: GameCategory.HEALTH,
        subcategory: 'HEALTH_MENTAL',
        evidenceType: EvidenceType.PHOTO,
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
        category: GameCategory.PERSONAL,
        subcategory: 'PERSONAL_PRODUCTIVITY',
        evidenceType: EvidenceType.PHOTO,
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
        category: GameCategory.WEATHER,
        evidenceType: EvidenceType.TEXT,
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 20,
        instructions: '每天提交对次日天气的预测，包括温度和天气状况',
        exampleEvidence: '明天最高温度25°C，多云转晴',
      },
      {
        name: 'language_learning_advanced',
        title: '语言学习打卡',
        description: '承诺每天学习外语30分钟，通过持续的语言学习提高外语水平，拓展国际视野，为未来的学习和工作打下坚实基础',
        category: GameCategory.LEARNING,
        subcategory: 'LEARNING_LANGUAGE',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336,
        maxParticipants: 15,
        instructions: '每天拍摄学习进度截图或学习笔记',
        exampleEvidence: '语言学习app显示今日完成30分钟学习的截图',
      },
      // 工作类模板 - 创业项目
      {
        name: 'startup_daily_progress',
        title: '创业项目日进展',
        description: '每天推进创业项目，记录进展和成果，保持创业动力和执行力',
        category: GameCategory.WORK,
        subcategory: 'WORK_STARTUP',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 6,
        instructions: '拍摄工作进展、产品开发或商务会议的照片',
        exampleEvidence: '代码提交记录、产品原型或会议讨论照片',
      },
      {
        name: 'business_plan_development',
        title: '商业计划完善',
        description: '每天完善商业计划的一个部分，系统性地构建创业项目的商业模式',
        category: GameCategory.WORK,
        subcategory: 'WORK_STARTUP',
        evidenceType: EvidenceType.TEXT,
        isAgeRestricted: false,
        defaultDurationHours: 504, // 21天
        maxParticipants: 8,
        instructions: '记录每天完善的商业计划内容和思考',
        exampleEvidence: '商业计划文档截图或思维导图',
      },
      {
        name: 'networking_challenge',
        title: '商务社交拓展',
        description: '每天主动联系一位行业人士或潜在合作伙伴，扩展商务网络',
        category: GameCategory.WORK,
        subcategory: 'WORK_STARTUP',
        evidenceType: EvidenceType.TEXT,
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 10,
        instructions: '记录联系的人员和交流内容（保护隐私）',
        exampleEvidence: '商务交流记录或会议安排截图',
      },
      // 社交类模板
      {
        name: 'friend_meetup_challenge',
        title: '朋友聚会计划',
        description: '定期组织朋友聚会，增进友谊，创造美好回忆',
        category: GameCategory.SOCIAL,
        subcategory: 'SOCIAL_FRIENDSHIP',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 12,
        instructions: '拍摄聚会照片，记录美好时光',
        exampleEvidence: '朋友聚会的合影或活动照片',
      },
      {
        name: 'community_volunteer',
        title: '社区志愿服务',
        description: '参与社区志愿活动，帮助他人，回馈社会',
        category: GameCategory.SOCIAL,
        subcategory: 'SOCIAL_COMMUNITY',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 15,
        instructions: '拍摄志愿服务活动照片',
        exampleEvidence: '参与志愿活动的照片或服务证明',
      },
      {
        name: 'family_bonding',
        title: '家庭亲情时光',
        description: '每天安排时间与家人相处，增进家庭关系，创造温馨时光',
        category: GameCategory.SOCIAL,
        subcategory: 'SOCIAL_FAMILY',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 20,
        instructions: '拍摄与家人相处的温馨照片',
        exampleEvidence: '家庭聚餐、游戏或聊天的照片',
      },
      // 娱乐类模板
      {
        name: 'movie_marathon',
        title: '电影观赏计划',
        description: '按计划观看经典电影或热门影片，丰富文化生活，拓展视野',
        category: GameCategory.ENTERTAINMENT,
        subcategory: 'ENTERTAINMENT_MEDIA',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 15,
        instructions: '拍摄观影环境或电影海报照片',
        exampleEvidence: '电影票根、观影环境或影评笔记',
      },
      {
        name: 'gaming_achievement',
        title: '游戏成就挑战',
        description: '在喜欢的游戏中完成特定成就或挑战，享受游戏乐趣',
        category: GameCategory.ENTERTAINMENT,
        subcategory: 'ENTERTAINMENT_GAMING',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 12,
        instructions: '拍摄游戏成就或进度截图',
        exampleEvidence: '游戏成就截图或游戏进度照片',
      },
      {
        name: 'music_discovery',
        title: '音乐探索之旅',
        description: '每天发现和欣赏新的音乐作品，扩展音乐品味',
        category: GameCategory.ENTERTAINMENT,
        subcategory: 'ENTERTAINMENT_MUSIC',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 20,
        instructions: '拍摄音乐播放界面或音乐相关照片',
        exampleEvidence: '音乐app播放截图或音乐会照片',
      },
      // 生活方式类模板
      {
        name: 'minimalist_lifestyle',
        title: '极简生活实践',
        description: '践行极简主义生活方式，减少物质负担，专注重要事物',
        category: GameCategory.LIFESTYLE,
        subcategory: 'LIFESTYLE_HOME',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 10,
        instructions: '拍摄整理后的简洁空间照片',
        exampleEvidence: '整理后的房间或物品收纳照片',
      },
      {
        name: 'local_exploration',
        title: '本地探索发现',
        description: '探索居住城市的新地方，发现身边的美好',
        category: GameCategory.LIFESTYLE,
        subcategory: 'LIFESTYLE_TRAVEL',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168, // 7天
        maxParticipants: 15,
        instructions: '拍摄探索的新地点照片',
        exampleEvidence: '新发现的咖啡厅、公园或景点照片',
      },
      // 学习成长类 - 补充模板
      {
        name: 'programming_practice',
        title: '编程技能提升',
        description: '每天练习编程，完成算法题或项目开发，提升技术能力',
        category: GameCategory.LEARNING,
        subcategory: 'LEARNING_SKILL',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 8,
        instructions: '拍摄代码截图或项目进展照片',
        exampleEvidence: '代码编辑器截图或项目运行结果',
      },
      {
        name: 'exam_preparation',
        title: '考试备考计划',
        description: '制定并执行考试复习计划，系统性地准备重要考试',
        category: GameCategory.LEARNING,
        subcategory: 'LEARNING_EXAM',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 672, // 28天
        maxParticipants: 15,
        instructions: '拍摄学习资料、笔记或复习进度照片',
        exampleEvidence: '复习笔记、教材或模拟考试成绩',
      },
      // 健康类 - 心理健康模板
      {
        name: 'stress_management',
        title: '压力管理挑战',
        description: '学习和实践压力管理技巧，保持心理平衡和情绪稳定',
        category: GameCategory.HEALTH,
        subcategory: 'HEALTH_MENTAL',
        evidenceType: EvidenceType.TEXT,
        isAgeRestricted: false,
        defaultDurationHours: 336, // 14天
        maxParticipants: 12,
        instructions: '记录压力管理方法和效果',
        exampleEvidence: '情绪日记或压力管理技巧记录',
      },
      // 基础模板 - 确保每个分类都有
      {
        name: 'basic_fitness',
        title: '基础健身挑战',
        description: '每天进行基础健身运动，包括俯卧撑、仰卧起坐等',
        category: GameCategory.FITNESS,
        subcategory: 'FITNESS_STRENGTH',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 8,
        instructions: '拍摄健身运动照片',
        exampleEvidence: '做俯卧撑或其他健身动作的照片',
      },
      {
        name: 'basic_personal',
        title: '个人成长挑战',
        description: '每天进行自我反思和个人成长活动',
        category: GameCategory.PERSONAL,
        subcategory: 'PERSONAL_GROWTH',
        evidenceType: EvidenceType.TEXT,
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 6,
        instructions: '写下每天的成长感悟',
        exampleEvidence: '今天学到了什么新知识或技能',
      },
      {
        name: 'basic_lifestyle',
        title: '生活方式改善',
        description: '改善日常生活习惯，提升生活质量',
        category: GameCategory.LIFESTYLE,
        subcategory: 'LIFESTYLE_HOME',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 8,
        instructions: '拍摄生活改善的照片',
        exampleEvidence: '整理房间、健康饮食等照片',
      },
      // 通用挑战模板
      {
        name: 'general_challenge',
        title: '通用挑战',
        description: '完全自定义的挑战，适用于任何类型的个人目标或习惯养成',
        category: GameCategory.CUSTOM,
        subcategory: 'GENERAL',
        evidenceType: EvidenceType.PHOTO,
        isAgeRestricted: false,
        defaultDurationHours: 168,
        maxParticipants: 8,
        instructions: '按照挑战要求提交相应证据',
        exampleEvidence: '根据挑战内容提供相关证据',
      },
    ];

    // 创建所有模板
    for (const template of templates) {
      try {
        // 设置一些模板为快速开始模板（使用模板的name字段）
        const quickStartTemplates = [
          'daily_exercise', 'early_wake_up', 'daily_reading', 'gratitude_journal', 'daily_water'
        ];

        const templateData = {
          ...template,
          difficultyLevel: DifficultyLevel.BEGINNER,
          riskLevel: RiskLevel.LOW,
          isQuickStart: quickStartTemplates.includes(template.name),
          isVipOnly: false,
          vipTier: null,
          isActive: true,
          usageCount: 0,
          successRate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await this.prisma.gameTemplate.create({
          data: templateData,
        });
        successCount++;
        console.log(`✅ 创建模板 [${successCount}]: ${template.name} (${template.subcategory})`);
      } catch (error) {
        failCount++;
        console.error(`❌ 创建模板失败 [${failCount}] ${template.name}:`, error.message);
        console.error('详细错误:', error);
      }
    }

    console.log(`✅ 模板创建完成: 成功 ${successCount} 个, 失败 ${failCount} 个`);
    return { successCount, failCount };
  }
}
