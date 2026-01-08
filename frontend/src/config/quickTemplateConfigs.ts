import { TemplateType } from '../types/templateConfig';

// 快捷模板配置 - 零配置，预设最佳实践
export interface QuickTemplateConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  subcategory: string;
  templateType: TemplateType.QUICK_START;
  // 预设的配置值，用户无需选择
  presetConfig: Record<string, any>;
}

// 快捷模板配置定义
export const QUICK_TEMPLATE_CONFIGS: Record<string, QuickTemplateConfig> = {
  // 学习成长类
  'quick_language_learning': {
    id: 'quick_language_learning',
    name: 'quick_language_learning',
    title: '英语单词每日学习',
    description: '每天学习20个英语单词，通过词汇卡片的方式，提升英语词汇量。适合初学者，循序渐进地建立英语基础。',
    instructions: '每天提交学习截图，包含学习内容和时长记录',
    category: 'LEARNING',
    subcategory: 'LANGUAGE',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      language: 'english',
      type: 'vocabulary',
      level: 'beginner',
      dailyGoal: '20_words',
      duration: '30_min',
      method: 'flashcards'
    }
  },

  'quick_daily_reading': {
    id: 'quick_daily_reading',
    name: 'quick_daily_reading',
    title: '每日30分钟阅读习惯',
    description: '每天阅读30分钟，通过阅读小说和散文，在安静环境中专心阅读，培养良好的阅读习惯，拓展知识视野。',
    instructions: '在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。',
    category: 'LEARNING',
    subcategory: 'READING',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      duration: '30_min',
      goals: ['knowledge'],
      genres: ['fiction', 'essay'],
      format: ['physical_book'],
      environment: 'quiet',
      tracking: 'notes'
    }
  },

  'quick_skill_practice': {
    id: 'quick_skill_practice',
    name: 'quick_skill_practice',
    title: '编程技能每日练习',
    description: '针对初学者设计的编程练习计划，主要目标是技能提升。通过系统性的练习和学习，逐步提升技能水平。',
    instructions: '每日进行编程练习，可以是算法题、项目开发或新技术学习。提交代码截图、项目进度或学习笔记，记录技术成长过程。',
    category: 'LEARNING',
    subcategory: 'SKILL',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      skillType: 'programming',
      experience: 'beginner',
      duration: '60_min',
      goals: ['skill_improvement'],
      frequency: 'daily',
      resources: 'online_course'
    }
  },

  // 健身运动类
  'quick_gym_workout': {
    id: 'quick_gym_workout',
    name: 'quick_gym_workout',
    title: '健身房增肌训练',
    description: '新手水平的力量训练，重点锻炼胸肌、背肌，每次训练60分钟，主要目标是增肌塑形、提升力量。',
    instructions: '每次训练后提交训练动作照片和器械使用记录，包含训练内容、使用重量和训练感受',
    category: 'FITNESS',
    subcategory: 'STRENGTH',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      type: 'strength',
      experience: 'beginner',
      duration: '60_min',
      frequency: 'every_other_day',
      targetMuscle: ['chest', 'back'],
      goals: ['build_muscle', 'increase_strength'],
      equipment: 'gym'
    }
  },

  'quick_running_challenge': {
    id: 'quick_running_challenge',
    name: 'quick_running_challenge',
    title: '每日3公里跑步',
    description: '中级水平的有氧跑步，每次跑步3公里，配速6分钟每公里，主要目标是减重减脂和提升耐力。',
    instructions: '根据个人能力调整跑步强度，保持规律训练。提交跑步记录截图，包含基本的距离和时间信息，记录身体感受和进步情况。',
    category: 'FITNESS',
    subcategory: 'CARDIO',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      type: 'outdoor',
      experience: 'intermediate',
      distance: '3km',
      pace: '6_min_km',
      frequency: 'daily',
      goals: ['lose_weight', 'endurance'],
      terrain: 'road'
    }
  },

  'quick_yoga_practice': {
    id: 'quick_yoga_practice',
    name: 'quick_yoga_practice',
    title: '晨间瑜伽练习',
    description: '初学者水平的哈他瑜伽，每次练习30分钟，在早晨进行，主要目标是身体柔韧性和内心平静。',
    instructions: '练习前进行简单热身，注意呼吸与动作的配合，不要勉强做高难度动作。提交练习照片或视频，展示瑜伽动作，记录练习感受和身体变化。',
    category: 'FITNESS',
    subcategory: 'FLEXIBILITY',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      style: 'hatha',
      experience: 'beginner',
      duration: '30_min',
      timeOfDay: 'morning',
      goals: ['flexibility', 'peace'],
      environment: 'home'
    }
  },

  // 健康生活类
  'quick_early_wake_up': {
    id: 'quick_early_wake_up',
    name: 'quick_early_wake_up',
    title: '6点早起健康挑战',
    description: '从7:00起床调整到6:00起床，通过提前睡觉等方式保证充足睡眠。通过早起实现晨练运动的目标，养成健康的作息习惯。',
    instructions: '每天提交起床时间证明和晨间活动照片，记录早起的收获和感受。坚持记录睡眠质量和精神状态的变化，分享早起生活的积极影响。',
    category: 'HEALTH',
    subcategory: 'SLEEP',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      currentTime: '7:00',
      targetTime: '6:00',
      motivation: ['exercise'],
      challenges: ['wake_difficulty'],
      support: 'early_sleep',
      rewards: ['breakfast_treat', 'progress_tracking']
    }
  },

  'quick_water_intake': {
    id: 'quick_water_intake',
    name: 'quick_water_intake',
    title: '每日2L健康饮水挑战',
    description: '从目前的1.5-2L提升到每日2L饮水量，通过手机应用提醒的方式，实现身体健康的健康目标。科学饮水，养成良好的饮水习惯。',
    instructions: '每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。',
    category: 'HEALTH',
    subcategory: 'DIET',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      currentIntake: '1.5-2L',
      targetAmount: '2L',
      motivation: ['health'],
      reminders: ['phone_app'],
      tracking: 'app',
      challenges: ['forget']
    }
  },

  'quick_meditation': {
    id: 'quick_meditation',
    name: 'quick_meditation',
    title: '每日10分钟正念冥想',
    description: '每天进行10分钟的正念冥想练习，在安静环境中，通过引导音频的方式，实现减压放松和专注力提升的目标。',
    instructions: '在安静的环境中进行冥想练习，可以使用冥想应用或音频指导。提交冥想时长记录和练习感受，分享内心的平静体验。',
    category: 'HEALTH',
    subcategory: 'MENTAL',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      style: ['mindfulness'],
      duration: '10_min',
      timeOfDay: ['morning'],
      environment: 'quiet',
      guidance: 'guided_audio',
      goals: ['stress_relief', 'focus']
    }
  },

  // 个人发展类
  'quick_productivity_boost': {
    id: 'quick_productivity_boost',
    name: 'quick_productivity_boost',
    title: '番茄工作法效率提升',
    description: '使用番茄工作法进行时间管理，每天安排4个时间块，主要目标是提升专注力和工作效率。通过系统性的时间管理，实现个人效率的显著提升。',
    instructions: '使用番茄工作法进行工作，每25分钟为一个番茄时间，休息5分钟。提交工作时长记录和完成任务截图，记录专注度和效率提升情况。',
    category: 'PERSONAL',
    subcategory: 'PRODUCTIVITY',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      method: 'pomodoro',
      timeBlocks: '4_blocks',
      goals: ['focus', 'efficiency'],
      tools: 'timer_app',
      tracking: 'task_completion',
      environment: 'quiet_space'
    }
  },

  'quick_creativity': {
    id: 'quick_creativity',
    name: 'quick_creativity',
    title: '每日绘画创作练习',
    description: '每天进行绘画创作，每次30分钟，主要目标是创意表达和技能提升。通过持续的创作练习，培养艺术感知力和创造力。',
    instructions: '每天进行绘画创作，可以是素描、水彩或数字绘画。提交创作作品照片和创作过程记录，分享创作灵感和技法心得。',
    category: 'PERSONAL',
    subcategory: 'CREATIVITY',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      mediums: ['drawing'],
      frequency: 'daily',
      duration: '30_min',
      goals: ['expression', 'skill'],
      style: 'realistic',
      tools: 'traditional'
    }
  },

  'quick_gratitude': {
    id: 'quick_gratitude',
    name: 'quick_gratitude',
    title: '感恩日记记录',
    description: '每天晚上记录3件感恩的事情，涵盖人际关系、个人成长、生活体验等方面，通过文字记录的方式，培养积极心态和感恩意识。',
    instructions: '每天晚上花5-10分钟记录感恩日记，写下当天值得感恩的事情。提交日记照片或文字记录，分享感恩心得和积极体验。',
    category: 'PERSONAL',
    subcategory: 'MINDFULNESS',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      depth: '3_items',
      timeOfDay: ['evening'],
      categories: ['relationships', 'growth', 'experiences'],
      format: 'written',
      reflection: ['daily_review'],
      duration: '10_min'
    }
  },

  // 生活方式类
  'quick_cooking': {
    id: 'quick_cooking',
    name: 'quick_cooking',
    title: '家常菜烹饪挑战',
    description: '每天制作一道家常菜，主要目标是提升厨艺和享受烹饪乐趣。通过实践不同菜谱，掌握基本烹饪技巧，培养健康的饮食习惯。',
    instructions: '每天制作一道菜品，可以是家常菜、汤品或小食。提交烹饪过程照片和成品图片，记录制作心得和味道评价。',
    category: 'LIFESTYLE',
    subcategory: 'COOKING',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      difficulty: 'beginner',
      goals: ['skill_improvement', 'enjoyment'],
      dietary: ['balanced'],
      frequency: 'daily',
      mealType: 'dinner',
      cuisine: 'chinese'
    }
  },

  'quick_organization': {
    id: 'quick_organization',
    name: 'quick_organization',
    title: '居家整理收纳',
    description: '每天整理一个区域，使用断舍离的方法，主要目标是创造整洁空间和提升生活质量。通过系统性的整理，营造舒适的居住环境。',
    instructions: '每天选择一个区域进行整理，可以是衣柜、书桌、厨房等。提交整理前后对比照片，记录整理方法和空间改善效果。',
    category: 'LIFESTYLE',
    subcategory: 'ORGANIZATION',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      methods: ['decluttering'],
      frequency: 'daily',
      areas: ['bedroom', 'living_room'],
      goals: ['clean_space', 'efficiency'],
      approach: 'gradual',
      timeCommitment: '30_min'
    }
  },

  // 工作发展类
  'quick_startup': {
    id: 'quick_startup',
    name: 'quick_startup',
    title: '科技互联网想法阶段创业日志',
    description: '科技互联网领域的想法阶段创业项目，重点关注市场调研、产品规划。每日投入2-3小时，系统性地推进项目发展，记录创业历程中的挑战、收获和成长。',
    instructions: '每天记录创业进展，包括市场调研、产品开发、团队建设等方面。提交工作记录、学习笔记或项目截图，分享创业心得和阶段性成果。',
    category: 'WORK',
    subcategory: 'STARTUP',
    templateType: TemplateType.QUICK_START,
    presetConfig: {
      stage: 'idea',
      industry: 'tech',
      focus: ['market_research', 'product_planning'],
      goals: ['validation', 'planning'],
      timeCommitment: '2-3_hours',
      challenges: ['market_uncertainty'],
      support: ['online_resources']
    }
  }
};

// 获取快捷模板配置
export function getQuickTemplateConfig(templateId: string): QuickTemplateConfig | undefined {
  return QUICK_TEMPLATE_CONFIGS[templateId];
}

// 获取所有快捷模板
export function getAllQuickTemplates(): QuickTemplateConfig[] {
  return Object.values(QUICK_TEMPLATE_CONFIGS);
}

// 按分类获取快捷模板
export function getQuickTemplatesByCategory(category: string): QuickTemplateConfig[] {
  return Object.values(QUICK_TEMPLATE_CONFIGS).filter(config => config.category === category);
}
