// 更多模板配置 - 健康生活类（冥想）、个人发展类、生活方式类、工作创业类

import { 
  TemplateConfigDefinition, 
  TemplateType, 
  TemplateConfig,
  HealthMeditationConfig,
  PersonalProductivityConfig,
  PersonalCreativityConfig,
  PersonalGratitudeConfig,
  LifestyleCookingConfig,
  LifestyleOrganizationConfig,
  WorkStartupConfig
} from '../types/templateConfig';

// 冥想练习配置
export const HEALTH_MEDITATION_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'MENTAL',
  sections: [
    {
      id: 'meditation_basics',
      title: '冥想基础',
      fields: [
        {
          id: 'experience',
          label: '冥想经验',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初学者', description: '从未尝试过冥想' },
            { value: 'occasional', label: '偶尔练习', description: '有过一些冥想体验' },
            { value: 'regular', label: '定期练习', description: '有一定的冥想基础' },
            { value: 'advanced', label: '资深练习者', description: '长期坚持冥想练习' }
          ],
          defaultValue: 'beginner'
        },
        {
          id: 'meditationType',
          label: '冥想类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'mindfulness', label: '正念冥想', description: '专注当下，观察呼吸' },
            { value: 'guided', label: '引导冥想', description: '跟随音频或视频指导' },
            { value: 'breathing', label: '呼吸冥想', description: '专注于呼吸节奏' },
            { value: 'body_scan', label: '身体扫描', description: '逐步放松身体各部位' },
            { value: 'loving_kindness', label: '慈心冥想', description: '培养慈悲和爱心' },
            { value: 'walking', label: '行走冥想', description: '在行走中保持觉知' }
          ],
          defaultValue: ['mindfulness']
        }
      ]
    },
    {
      id: 'meditation_goals',
      title: '冥想目标',
      fields: [
        {
          id: 'goals',
          label: '练习目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'stress_relief', label: '缓解压力', description: '减少焦虑和压力' },
            { value: 'focus', label: '提升专注力', description: '增强注意力和集中力' },
            { value: 'emotional_balance', label: '情绪平衡', description: '调节情绪，保持内心平静' },
            { value: 'sleep_quality', label: '改善睡眠', description: '提高睡眠质量' },
            { value: 'self_awareness', label: '自我觉察', description: '增强自我认知' },
            { value: 'spiritual_growth', label: '精神成长', description: '探索内在智慧' }
          ],
          defaultValue: ['stress_relief']
        },
        {
          id: 'duration',
          label: '冥想时长',
          type: 'select',
          required: true,
          options: [
            { value: '5_min', label: '5分钟' },
            { value: '10_min', label: '10分钟' },
            { value: '15_min', label: '15分钟' },
            { value: '20_min', label: '20分钟' },
            { value: '30_min', label: '30分钟' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: '10_min'
        }
      ]
    },
    {
      id: 'meditation_schedule',
      title: '冥想安排',
      fields: [
        {
          id: 'timeOfDay',
          label: '冥想时间',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'morning', label: '晨间冥想', description: '起床后，开始新的一天' },
            { value: 'lunch_break', label: '午休冥想', description: '午餐后的短暂休息' },
            { value: 'evening', label: '傍晚冥想', description: '下班后的放松时光' },
            { value: 'before_sleep', label: '睡前冥想', description: '准备进入睡眠状态' },
            { value: 'stress_moments', label: '压力时刻', description: '感到压力时随时练习' }
          ],
          defaultValue: ['morning']
        },
        {
          id: 'environment',
          label: '冥想环境',
          type: 'radio',
          required: true,
          options: [
            { value: 'quiet_room', label: '安静房间', description: '在家中安静的空间' },
            { value: 'nature', label: '自然环境', description: '公园、海边等自然场所' },
            { value: 'meditation_space', label: '专门冥想区', description: '设置专门的冥想角落' },
            { value: 'anywhere', label: '随时随地', description: '不限制环境，随时练习' }
          ],
          defaultValue: 'quiet_room'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const meditationConfig = config as HealthMeditationConfig;
    const duration = getDurationLabel(meditationConfig.duration);
    const mainType = meditationConfig.style?.[0] ? getMeditationTypeLabel(meditationConfig.style[0]) : '冥想';
    return `每日${duration}${mainType}练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const meditationConfig = config as HealthMeditationConfig;
    const goals = meditationConfig.goals?.map((goal: string) => getMeditationGoalLabel(goal)).join('、') || '身心健康';
    const types = meditationConfig.style?.map((type: string) => getMeditationTypeLabel(type)).join('、') || '多样化冥想';
    const environment = getMeditationEnvironmentLabel(meditationConfig.environment);
    
    return `通过${types}练习，在${environment}中实现${goals}的目标。每日坚持冥想，培养内在平静，提升生活质量和精神状态。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const meditationConfig = config as HealthMeditationConfig;
    const experience = meditationConfig.experience;
    
    if (experience === 'beginner') {
      return '每日提交冥想时间记录和简单的感受分享。建议使用冥想应用辅助练习，记录冥想过程中的体验和变化。';
    } else {
      return '每日记录冥想时长、类型和深度体验。分享冥想中的洞察和感悟，记录身心状态的变化和成长。';
    }
  }
};

// 效率提升配置
export const PERSONAL_PRODUCTIVITY_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'PRODUCTIVITY',
  sections: [
    {
      id: 'productivity_focus',
      title: '效率重点',
      fields: [
        {
          id: 'focusAreas',
          label: '提升领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'time_management', label: '时间管理', description: '优化时间分配和利用' },
            { value: 'task_organization', label: '任务整理', description: '系统化管理待办事项' },
            { value: 'focus_concentration', label: '专注力', description: '提升注意力和集中度' },
            { value: 'energy_management', label: '精力管理', description: '合理分配精力资源' },
            { value: 'habit_building', label: '习惯养成', description: '建立高效的工作习惯' },
            { value: 'digital_minimalism', label: '数字极简', description: '减少数字干扰' }
          ],
          defaultValue: ['time_management']
        },
        {
          id: 'methods',
          label: '效率方法',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'pomodoro', label: '番茄工作法', description: '25分钟专注+5分钟休息' },
            { value: 'gtd', label: 'GTD方法', description: '收集-整理-组织-回顾-执行' },
            { value: 'time_blocking', label: '时间块管理', description: '为任务分配固定时间段' },
            { value: 'eisenhower', label: '四象限法', description: '重要性和紧急性分类' },
            { value: 'deep_work', label: '深度工作', description: '长时间专注于重要任务' }
          ],
          defaultValue: ['pomodoro']
        }
      ]
    },
    {
      id: 'productivity_goals',
      title: '效率目标',
      fields: [
        {
          id: 'goals',
          label: '具体目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'reduce_procrastination', label: '减少拖延' },
            { value: 'increase_output', label: '提升产出' },
            { value: 'better_planning', label: '改善规划' },
            { value: 'work_life_balance', label: '工作生活平衡' },
            { value: 'stress_reduction', label: '减少工作压力' },
            { value: 'skill_development', label: '技能发展' }
          ],
          defaultValue: ['reduce_procrastination']
        },
        {
          id: 'measurement',
          label: '衡量方式',
          type: 'radio',
          required: true,
          options: [
            { value: 'task_completion', label: '任务完成率', description: '统计每日完成的任务数量' },
            { value: 'time_tracking', label: '时间记录', description: '记录各项活动的时间分配' },
            { value: 'focus_sessions', label: '专注时段', description: '记录深度工作的时间长度' },
            { value: 'energy_levels', label: '精力状态', description: '评估每日的精力水平' }
          ],
          defaultValue: 'task_completion'
        }
      ]
    },
    {
      id: 'productivity_tools',
      title: '工具支持',
      fields: [
        {
          id: 'tools',
          label: '使用工具',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'digital_calendar', label: '数字日历' },
            { value: 'task_apps', label: '任务管理应用' },
            { value: 'note_taking', label: '笔记工具' },
            { value: 'time_tracker', label: '时间追踪器' },
            { value: 'paper_planner', label: '纸质规划本' },
            { value: 'habit_tracker', label: '习惯追踪器' }
          ],
          defaultValue: ['digital_calendar']
        },
        {
          id: 'reviewFrequency',
          label: '回顾频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每日回顾' },
            { value: 'weekly', label: '每周回顾' },
            { value: 'bi_weekly', label: '双周回顾' },
            { value: 'monthly', label: '每月回顾' }
          ],
          defaultValue: 'weekly'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const productivityConfig = config as PersonalProductivityConfig;
    const mainArea = productivityConfig.areas?.[0] ? getProductivityAreaLabel(productivityConfig.areas[0]) : '效率';
    const method = productivityConfig.methods?.[0] ? getProductivityMethodLabel(productivityConfig.methods[0]) : '';
    return `${mainArea}${method}提升挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const productivityConfig = config as PersonalProductivityConfig;
    const areas = productivityConfig.areas?.map((area: string) => getProductivityAreaLabel(area)).join('、') || '个人效率';
    const methods = productivityConfig.methods?.map((method: string) => getProductivityMethodLabel(method)).join('、') || '科学方法';
    const goals = productivityConfig.goals?.map((goal: string) => getProductivityGoalLabel(goal)).join('、') || '效率提升';
    
    return `通过${methods}等科学方法，重点提升${areas}，实现${goals}的目标。系统化地改善工作和生活效率，建立可持续的高效习惯。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const productivityConfig = config as PersonalProductivityConfig;
    const measurement = productivityConfig.timeBlocks;
    
    if (measurement === 'time_tracking') {
      return '每日记录时间分配和使用效率，提交时间追踪截图或记录表。分享时间管理心得和效率提升的具体体验。';
    } else if (measurement === 'task_completion') {
      return '每日记录任务完成情况和效率状态，提交任务清单或完成截图。分享效率方法的使用体验和改进建议。';
    } else {
      return '每日记录效率实践和成果，提交相关截图或记录。分享效率提升的方法和心得体会。';
    }
  }
};

// 标签映射函数
function getDurationLabel(value: string): string {
  const labels: Record<string, string> = {
    '5_min': '5分钟',
    '10_min': '10分钟',
    '15_min': '15分钟',
    '20_min': '20分钟',
    '30_min': '30分钟',
    'flexible': '灵活时长'
  };
  return labels[value] || value;
}

function getMeditationTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'mindfulness': '正念冥想',
    'guided': '引导冥想',
    'breathing': '呼吸冥想',
    'body_scan': '身体扫描',
    'loving_kindness': '慈心冥想',
    'walking': '行走冥想'
  };
  return labels[value] || value;
}

function getMeditationGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'stress_relief': '缓解压力',
    'focus': '提升专注力',
    'emotional_balance': '情绪平衡',
    'sleep_quality': '改善睡眠',
    'self_awareness': '自我觉察',
    'spiritual_growth': '精神成长'
  };
  return labels[value] || value;
}

function getMeditationEnvironmentLabel(value: string): string {
  const labels: Record<string, string> = {
    'quiet_room': '安静房间',
    'nature': '自然环境',
    'meditation_space': '专门冥想区',
    'anywhere': '随时随地'
  };
  return labels[value] || value;
}

function getProductivityAreaLabel(value: string): string {
  const labels: Record<string, string> = {
    'time_management': '时间管理',
    'task_organization': '任务整理',
    'focus_concentration': '专注力',
    'energy_management': '精力管理',
    'habit_building': '习惯养成',
    'digital_minimalism': '数字极简'
  };
  return labels[value] || value;
}

function getProductivityMethodLabel(value: string): string {
  const labels: Record<string, string> = {
    'pomodoro': '番茄工作法',
    'gtd': 'GTD',
    'time_blocking': '时间块',
    'eisenhower': '四象限',
    'deep_work': '深度工作'
  };
  return labels[value] || value;
}

function getProductivityGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'reduce_procrastination': '减少拖延',
    'increase_output': '提升产出',
    'better_planning': '改善规划',
    'work_life_balance': '工作生活平衡',
    'stress_reduction': '减少压力',
    'skill_development': '技能发展'
  };
  return labels[value] || value;
}

// 创意表达配置
export const PERSONAL_CREATIVITY_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'CREATIVITY',
  sections: [
    {
      id: 'creativity_type',
      title: '创意类型',
      fields: [
        {
          id: 'creativeFields',
          label: '创意领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'writing', label: '写作创作', description: '小说、诗歌、散文、剧本等' },
            { value: 'visual_art', label: '视觉艺术', description: '绘画、设计、摄影等' },
            { value: 'music', label: '音乐创作', description: '作曲、编曲、演奏等' },
            { value: 'digital_art', label: '数字艺术', description: '数字绘画、3D建模等' },
            { value: 'craft', label: '手工艺术', description: '陶艺、编织、木工等' },
            { value: 'performance', label: '表演艺术', description: '舞蹈、戏剧、演讲等' }
          ],
          defaultValue: ['writing']
        },
        {
          id: 'experience',
          label: '创作经验',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初学者', description: '刚开始尝试创作' },
            { value: 'hobbyist', label: '业余爱好者', description: '有一定创作经验' },
            { value: 'semi_professional', label: '半专业', description: '有较丰富的创作经验' },
            { value: 'professional', label: '专业创作者', description: '以创作为职业或主要技能' }
          ],
          defaultValue: 'hobbyist'
        }
      ]
    },
    {
      id: 'creativity_goals',
      title: '创作目标',
      fields: [
        {
          id: 'goals',
          label: '创作目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'skill_improvement', label: '技能提升', description: '提高创作技巧和水平' },
            { value: 'self_expression', label: '自我表达', description: '通过创作表达内心想法' },
            { value: 'stress_relief', label: '压力释放', description: '通过创作缓解压力' },
            { value: 'portfolio_building', label: '作品集建设', description: '积累创作作品' },
            { value: 'income_generation', label: '收入来源', description: '通过创作获得收入' },
            { value: 'community_sharing', label: '社区分享', description: '与他人分享创作成果' }
          ],
          defaultValue: ['self_expression']
        },
        {
          id: 'frequency',
          label: '创作频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每日创作' },
            { value: '5_times_week', label: '每周5次' },
            { value: '3_times_week', label: '每周3次' },
            { value: 'weekly', label: '每周1次' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: 'daily'
        }
      ]
    },
    {
      id: 'creativity_practice',
      title: '创作实践',
      fields: [
        {
          id: 'duration',
          label: '创作时长',
          type: 'select',
          required: true,
          options: [
            { value: '15_min', label: '15分钟' },
            { value: '30_min', label: '30分钟' },
            { value: '60_min', label: '1小时' },
            { value: '90_min', label: '1.5小时' },
            { value: '120_min', label: '2小时' },
            { value: 'flexible', label: '灵活时长' }
          ],
          defaultValue: '30_min'
        },
        {
          id: 'inspiration',
          label: '灵感来源',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'daily_life', label: '日常生活观察' },
            { value: 'nature', label: '自然环境' },
            { value: 'books_media', label: '书籍影视' },
            { value: 'music', label: '音乐启发' },
            { value: 'dreams', label: '梦境想象' },
            { value: 'emotions', label: '情感体验' },
            { value: 'random_prompts', label: '随机主题' }
          ],
          defaultValue: ['daily_life']
        },
        {
          id: 'sharing',
          label: '分享方式',
          type: 'radio',
          required: true,
          options: [
            { value: 'private', label: '私人记录', description: '仅自己保存和欣赏' },
            { value: 'friends', label: '朋友分享', description: '与朋友圈分享' },
            { value: 'community', label: '社区发布', description: '在创作社区发布' },
            { value: 'public', label: '公开展示', description: '在公共平台展示' }
          ],
          defaultValue: 'friends'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const creativityConfig = config as PersonalCreativityConfig;
    const mainField = creativityConfig.mediums?.[0] ? getCreativeFieldLabel(creativityConfig.mediums[0]) : '创意';
    const duration = getDurationLabel(creativityConfig.frequency);
    return `每日${duration}${mainField}创作`;
  },
  generateDescription: (config: TemplateConfig) => {
    const creativityConfig = config as PersonalCreativityConfig;
    const fields = creativityConfig.mediums?.map((field: string) => getCreativeFieldLabel(field)).join('、') || '多元化创作';
    const goals = creativityConfig.goals?.map((goal: string) => getCreativityGoalLabel(goal)).join('、') || '创意表达';
    const inspiration = creativityConfig.inspiration?.map((source: string) => getInspirationLabel(source)).join('、') || '多样化灵感';

    return `通过${fields}的方式，从${inspiration}中汲取灵感，实现${goals}的目标。每日坚持创作，培养创意思维，提升艺术表达能力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const creativityConfig = config as PersonalCreativityConfig;
    const sharing = creativityConfig.sharing;

    if (sharing === 'public') {
      return '每日提交创作作品和创作过程记录，可以是照片、视频或文字描述。分享创作灵感来源和技巧心得，与社区互动交流。';
    } else if (sharing === 'private') {
      return '每日记录创作过程和作品，提交创作时间证明和简单的作品展示。重点记录创作体验和个人成长感受。';
    } else {
      return '每日提交创作作品或过程记录，分享创作心得和灵感来源。记录创作技能的提升和创意思维的发展。';
    }
  }
};

// 感恩日记配置
export const PERSONAL_GRATITUDE_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'MINDFULNESS',
  sections: [
    {
      id: 'gratitude_focus',
      title: '感恩重点',
      fields: [
        {
          id: 'focusAreas',
          label: '感恩领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'relationships', label: '人际关系', description: '家人、朋友、同事的支持' },
            { value: 'health', label: '身体健康', description: '身体状况和健康体验' },
            { value: 'achievements', label: '个人成就', description: '工作学习中的进步和成果' },
            { value: 'daily_moments', label: '日常美好', description: '生活中的小确幸' },
            { value: 'opportunities', label: '机会体验', description: '学习和成长的机会' },
            { value: 'nature', label: '自然环境', description: '自然美景和环境' }
          ],
          defaultValue: ['relationships']
        },
        {
          id: 'depth',
          label: '记录深度',
          type: 'radio',
          required: true,
          options: [
            { value: 'simple', label: '简单记录', description: '3-5个感恩事项的简单列举' },
            { value: 'detailed', label: '详细描述', description: '深入描述感恩的原因和感受' },
            { value: 'reflective', label: '反思性记录', description: '结合个人成长的深度反思' }
          ],
          defaultValue: 'detailed'
        }
      ]
    },
    {
      id: 'gratitude_practice',
      title: '感恩实践',
      fields: [
        {
          id: 'format',
          label: '记录形式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'written_journal', label: '文字日记' },
            { value: 'voice_memo', label: '语音记录' },
            { value: 'photo_diary', label: '图片日记' },
            { value: 'video_log', label: '视频记录' },
            { value: 'art_expression', label: '艺术表达' }
          ],
          defaultValue: ['written_journal']
        },
        {
          id: 'timeOfDay',
          label: '记录时间',
          type: 'radio',
          required: true,
          options: [
            { value: 'morning', label: '晨间记录', description: '起床后回顾昨日感恩' },
            { value: 'evening', label: '睡前记录', description: '睡前总结当日感恩' },
            { value: 'lunch', label: '午间记录', description: '午休时间的感恩练习' },
            { value: 'flexible', label: '灵活时间', description: '根据心情和时间灵活安排' }
          ],
          defaultValue: 'evening'
        },
        {
          id: 'itemCount',
          label: '感恩事项数量',
          type: 'select',
          required: true,
          options: [
            { value: '3_items', label: '3件事' },
            { value: '5_items', label: '5件事' },
            { value: '7_items', label: '7件事' },
            { value: '10_items', label: '10件事' },
            { value: 'unlimited', label: '不限数量' }
          ],
          defaultValue: '3_items'
        }
      ]
    },
    {
      id: 'gratitude_goals',
      title: '感恩目标',
      fields: [
        {
          id: 'goals',
          label: '练习目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'positive_mindset', label: '积极心态', description: '培养更积极的生活态度' },
            { value: 'stress_reduction', label: '减少焦虑', description: '通过感恩缓解压力和焦虑' },
            { value: 'relationship_improvement', label: '改善关系', description: '增进与他人的关系' },
            { value: 'self_awareness', label: '自我认知', description: '提升对生活的觉察力' },
            { value: 'happiness_boost', label: '提升幸福感', description: '增加生活满意度' },
            { value: 'mindfulness', label: '正念生活', description: '更加专注当下' }
          ],
          defaultValue: ['positive_mindset']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const gratitudeConfig = config as PersonalGratitudeConfig;

    // 修复标题生成逻辑，避免出现"edetailed感恩日记"的问题
    console.log('🔍 感恩日记标题生成调试:', {
      原始配置: gratitudeConfig,
      depth: gratitudeConfig.depth,
      timeOfDay: gratitudeConfig.timeOfDay
    });

    // 统一使用现有的映射函数，确保一致性
    const count = getItemCountLabel(gratitudeConfig.depth || '3_items');
    const time = getTimeOfDayLabel(gratitudeConfig.timeOfDay?.[0] || 'evening');

    const title = `${time}${count}感恩日记`;
    console.log('📝 生成的标题:', title);

    return title;
  },
  generateDescription: (config: TemplateConfig) => {
    const gratitudeConfig = config as PersonalGratitudeConfig;
    const areas = gratitudeConfig.categories?.map((area: string) => getGratitudeFocusLabel(area)).join('、') || '生活各方面';
    const goals = gratitudeConfig.reflection?.map((goal: string) => getGratitudeGoalLabel(goal)).join('、') || '积极心态';
    const format = getGratitudeFormatLabel(gratitudeConfig.format) || '多样化记录';

    return `通过${format}的方式，重点关注${areas}的感恩体验，实现${goals}的目标。每日坚持感恩练习，培养积极心态，提升生活幸福感。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const gratitudeConfig = config as PersonalGratitudeConfig;
    const depth = gratitudeConfig.depth;

    if (depth === 'reflective') {
      return '每日提交深度感恩记录，包含感恩事项、原因分析和个人反思。分享感恩练习对心态和生活的积极影响。';
    } else if (depth === 'simple') {
      return '每日提交简单的感恩清单，记录当天值得感恩的事情。可以是文字、图片或语音形式的记录。';
    } else {
      return '每日提交详细的感恩记录，描述感恩事项的具体情况和内心感受。分享感恩练习的体验和收获。';
    }
  }
};

// 创意相关标签映射
function getCreativeFieldLabel(value: string): string {
  const labels: Record<string, string> = {
    'writing': '写作创作',
    'visual_art': '视觉艺术',
    'music': '音乐创作',
    'digital_art': '数字艺术',
    'craft': '手工艺术',
    'performance': '表演艺术'
  };
  return labels[value] || value;
}

function getCreativityGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'skill_improvement': '技能提升',
    'self_expression': '自我表达',
    'stress_relief': '压力释放',
    'portfolio_building': '作品集建设',
    'income_generation': '收入来源',
    'community_sharing': '社区分享'
  };
  return labels[value] || value;
}

function getInspirationLabel(value: string): string {
  const labels: Record<string, string> = {
    'daily_life': '日常生活',
    'nature': '自然环境',
    'books_media': '书籍影视',
    'music': '音乐',
    'dreams': '梦境想象',
    'emotions': '情感体验',
    'random_prompts': '随机主题'
  };
  return labels[value] || value;
}

// 感恩相关标签映射
function getGratitudeFocusLabel(value: string): string {
  const labels: Record<string, string> = {
    'relationships': '人际关系',
    'health': '身体健康',
    'achievements': '个人成就',
    'daily_moments': '日常美好',
    'opportunities': '机会体验',
    'nature': '自然环境'
  };
  return labels[value] || value;
}

function getGratitudeFormatLabel(value: string): string {
  const labels: Record<string, string> = {
    'written_journal': '文字日记',
    'voice_memo': '语音记录',
    'photo_diary': '图片日记',
    'video_log': '视频记录',
    'art_expression': '艺术表达'
  };
  return labels[value] || value;
}

function getGratitudeGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'positive_mindset': '积极心态',
    'stress_reduction': '减少焦虑',
    'relationship_improvement': '改善关系',
    'self_awareness': '自我认知',
    'happiness_boost': '提升幸福感',
    'mindfulness': '正念生活'
  };
  return labels[value] || value;
}

function getItemCountLabel(value: string): string {
  const labels: Record<string, string> = {
    '3_items': '3件事',
    '5_items': '5件事',
    '7_items': '7件事',
    '10_items': '10件事',
    'unlimited': '不限数量'
  };
  return labels[value] || value;
}

function getTimeOfDayLabel(value: string): string {
  const labels: Record<string, string> = {
    'morning': '晨间',
    'evening': '睡前',
    'lunch': '午间',
    'flexible': '灵活时间'
  };
  return labels[value] || value;
}
