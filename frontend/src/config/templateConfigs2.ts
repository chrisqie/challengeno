// 更多模板配置 - 学习成长类、健康生活类、个人发展类

import { 
  TemplateConfigDefinition, 
  TemplateType, 
  TemplateConfig,
  LearningReadingConfig,
  LearningSkillConfig,
  HealthWakeUpConfig,
  HealthWaterConfig,
  HealthMeditationConfig,
  PersonalProductivityConfig,
  PersonalCreativityConfig,
  PersonalGratitudeConfig
} from '../types/templateConfig';

// 每日阅读配置
export const LEARNING_READING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'READING',
  sections: [
    {
      id: 'reading_preferences',
      title: '阅读偏好',
      fields: [
        {
          id: 'genres',
          label: '阅读类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'fiction', label: '小说文学', description: '小说、散文、诗歌等文学作品' },
            { value: 'non_fiction', label: '非虚构类', description: '传记、历史、科普等' },
            { value: 'business', label: '商业管理', description: '商业、管理、经济类书籍' },
            { value: 'self_help', label: '自我提升', description: '个人成长、心理学等' },
            { value: 'technical', label: '专业技术', description: '技术、学术、专业书籍' },
            { value: 'philosophy', label: '哲学思辨', description: '哲学、思想、文化类' }
          ],
          defaultValue: ['non_fiction']
        },
        {
          id: 'format',
          label: '阅读形式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'physical', label: '纸质书籍' },
            { value: 'ebook', label: '电子书' },
            { value: 'audiobook', label: '有声书' },
            { value: 'articles', label: '文章期刊' },
            { value: 'online', label: '在线阅读' }
          ],
          defaultValue: ['physical']
        }
      ]
    },
    {
      id: 'reading_goals',
      title: '阅读目标',
      fields: [
        {
          id: 'goals',
          label: '阅读目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'knowledge', label: '增长知识' },
            { value: 'entertainment', label: '娱乐放松' },
            { value: 'skill_improvement', label: '技能提升' },
            { value: 'language', label: '语言学习' },
            { value: 'inspiration', label: '寻找灵感' },
            { value: 'habit_building', label: '养成习惯' }
          ],
          defaultValue: ['knowledge']
        },
        {
          id: 'duration',
          label: '阅读时长',
          type: 'select',
          required: true,
          options: [
            { value: '15_min', label: '15分钟' },
            { value: '30_min', label: '30分钟' },
            { value: '45_min', label: '45分钟' },
            { value: '60_min', label: '1小时' },
            { value: '90_min', label: '1.5小时' }
          ],
          defaultValue: '30_min'
        }
      ]
    },
    {
      id: 'reading_schedule',
      title: '阅读安排',
      fields: [
        {
          id: 'timeOfDay',
          label: '阅读时间',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'morning', label: '晨读 (7-9点)', description: '清晨时光，头脑清醒' },
            { value: 'commute', label: '通勤时间', description: '上下班路上' },
            { value: 'lunch', label: '午休时间', description: '午餐后的休息时光' },
            { value: 'evening', label: '傍晚 (17-19点)', description: '下班后的放松时间' },
            { value: 'night', label: '睡前 (21-23点)', description: '睡前的安静时光' }
          ],
          defaultValue: ['evening']
        },
        {
          id: 'environment',
          label: '阅读环境',
          type: 'radio',
          required: true,
          options: [
            { value: 'home', label: '居家阅读', description: '在家中安静的角落' },
            { value: 'library', label: '图书馆', description: '安静的学习环境' },
            { value: 'cafe', label: '咖啡厅', description: '轻松的社交环境' },
            { value: 'outdoor', label: '户外阅读', description: '公园或自然环境' },
            { value: 'commute', label: '移动阅读', description: '通勤或旅行途中' }
          ],
          defaultValue: 'home'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const readingConfig = config as LearningReadingConfig;
    const duration = getDurationLabel(readingConfig.duration);
    const mainGenre = readingConfig.genres?.[0] ? getGenreLabel(readingConfig.genres[0]) : '多样化';
    return `每日${duration}${mainGenre}阅读`;
  },
  generateDescription: (config: TemplateConfig) => {
    const readingConfig = config as LearningReadingConfig;
    const goals = readingConfig.goals?.map(goal => getReadingGoalLabel(goal)).join('、') || '知识增长';
    const genres = readingConfig.genres?.map(genre => getGenreLabel(genre)).join('、') || '多样化内容';
    const formats = readingConfig.format?.map(format => getFormatLabel(format)).join('、') || '多种形式';
    
    return `通过阅读${genres}，使用${formats}的方式，实现${goals}的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const readingConfig = config as LearningReadingConfig;
    const environment = readingConfig.environment;
    
    if (environment === 'commute') {
      return '在通勤途中进行阅读，可以使用手机或电子设备。提交阅读进度截图或读书笔记，记录阅读感悟和收获。';
    } else {
      return '在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。';
    }
  }
};

// 技能练习配置
export const LEARNING_SKILL_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'SKILL',
  sections: [
    {
      id: 'skill_basics',
      title: '技能基础',
      fields: [
        {
          id: 'skillType',
          label: '技能类型',
          type: 'select',
          required: true,
          options: [
            { value: 'music', label: '音乐技能', description: '乐器演奏、声乐等' },
            { value: 'art', label: '艺术创作', description: '绘画、设计、摄影等' },
            { value: 'programming', label: '编程技术', description: '软件开发、编程语言' },
            { value: 'language', label: '语言技能', description: '外语学习、口语练习' },
            { value: 'craft', label: '手工技艺', description: '手工制作、DIY等' },
            { value: 'sports', label: '运动技能', description: '体育运动、健身技巧' },
            { value: 'writing', label: '写作技能', description: '创意写作、文案等' },
            { value: 'other', label: '其他技能', description: '其他专业技能' }
          ],
          defaultValue: 'programming'
        },
        {
          id: 'experience',
          label: '技能水平',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初学者', description: '刚开始学习或学习不到3个月' },
            { value: 'intermediate', label: '中级', description: '有一定基础，学习3个月到1年' },
            { value: 'advanced', label: '高级', description: '较为熟练，学习1年以上' },
            { value: 'expert', label: '专家', description: '非常熟练，可以指导他人' }
          ],
          defaultValue: 'beginner'
        }
      ]
    },
    {
      id: 'practice_plan',
      title: '练习计划',
      fields: [
        {
          id: 'goals',
          label: '学习目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'basic_mastery', label: '掌握基础' },
            { value: 'skill_improvement', label: '技能提升' },
            { value: 'creative_expression', label: '创意表达' },
            { value: 'professional_development', label: '职业发展' },
            { value: 'hobby_enjoyment', label: '兴趣爱好' },
            { value: 'competition_preparation', label: '比赛准备' }
          ],
          defaultValue: ['basic_mastery']
        },
        {
          id: 'duration',
          label: '练习时长',
          type: 'select',
          required: true,
          options: [
            { value: '15_min', label: '15分钟' },
            { value: '30_min', label: '30分钟' },
            { value: '45_min', label: '45分钟' },
            { value: '60_min', label: '1小时' },
            { value: '90_min', label: '1.5小时' },
            { value: '120_min', label: '2小时' }
          ],
          defaultValue: '30_min'
        },
        {
          id: 'resources',
          label: '学习资源',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'online_courses', label: '在线课程' },
            { value: 'books', label: '书籍教材' },
            { value: 'videos', label: '视频教程' },
            { value: 'practice_apps', label: '练习应用' },
            { value: 'mentor', label: '导师指导' },
            { value: 'community', label: '学习社区' }
          ],
          defaultValue: ['online_courses']
        }
      ]
    },
    {
      id: 'practice_schedule',
      title: '练习安排',
      fields: [
        {
          id: 'frequency',
          label: '练习频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天练习' },
            { value: '5_times_week', label: '每周5次' },
            { value: '3_times_week', label: '每周3次' },
            { value: '2_times_week', label: '每周2次' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: 'daily'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const skillConfig = config as LearningSkillConfig;
    const skillType = getSkillTypeLabel(skillConfig.skillType);
    const duration = getDurationLabel(skillConfig.duration);
    return `每日${duration}${skillType}练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const skillConfig = config as LearningSkillConfig;
    const skillType = getSkillTypeLabel(skillConfig.skillType);
    const goals = skillConfig.goals?.map(goal => getSkillGoalLabel(goal)).join('、') || '技能提升';
    const experience = getExperienceLabel(skillConfig.experience);
    
    return `针对${experience}设计的${skillType}练习计划，主要目标是${goals}。通过系统性的练习和学习，逐步提升技能水平，实现个人成长和发展目标。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const skillConfig = config as LearningSkillConfig;
    const skillType = skillConfig.skillType;
    
    if (skillType === 'programming') {
      return '每日进行编程练习，可以是算法题、项目开发或新技术学习。提交代码截图、项目进度或学习笔记，记录技术成长过程。';
    } else if (skillType === 'music') {
      return '每日进行乐器练习或声乐训练，注意基本功和曲目练习。提交练习视频、音频录制或练习记录，展示技能进步。';
    } else {
      return '按照学习计划进行技能练习，注重基础训练和实践应用。提交练习作品、进度记录或学习心得，记录技能发展历程。';
    }
  }
};

// 标签映射函数
function getDurationLabel(value: string): string {
  const labels: Record<string, string> = {
    '15_min': '15分钟',
    '30_min': '30分钟',
    '45_min': '45分钟',
    '60_min': '1小时',
    '90_min': '1.5小时',
    '120_min': '2小时'
  };
  return labels[value] || value;
}

function getGenreLabel(value: string): string {
  const labels: Record<string, string> = {
    'fiction': '小说文学',
    'non_fiction': '非虚构类',
    'business': '商业管理',
    'self_help': '自我提升',
    'technical': '专业技术',
    'philosophy': '哲学思辨'
  };
  return labels[value] || value;
}

function getFormatLabel(value: string): string {
  const labels: Record<string, string> = {
    'physical': '纸质书籍',
    'ebook': '电子书',
    'audiobook': '有声书',
    'articles': '文章期刊',
    'online': '在线阅读'
  };
  return labels[value] || value;
}

function getReadingGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'knowledge': '增长知识',
    'entertainment': '娱乐放松',
    'skill_improvement': '技能提升',
    'language': '语言学习',
    'inspiration': '寻找灵感',
    'habit_building': '养成习惯'
  };
  return labels[value] || value;
}

function getSkillTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'music': '音乐技能',
    'art': '艺术创作',
    'programming': '编程技术',
    'language': '语言技能',
    'craft': '手工技艺',
    'sports': '运动技能',
    'writing': '写作技能',
    'other': '其他技能'
  };
  return labels[value] || value;
}

function getSkillGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'basic_mastery': '掌握基础',
    'skill_improvement': '技能提升',
    'creative_expression': '创意表达',
    'professional_development': '职业发展',
    'hobby_enjoyment': '兴趣爱好',
    'competition_preparation': '比赛准备'
  };
  return labels[value] || value;
}

function getExperienceLabel(value: string): string {
  const labels: Record<string, string> = {
    'beginner': '初学者',
    'intermediate': '中级',
    'advanced': '高级',
    'expert': '专家'
  };
  return labels[value] || value;
}

// 早起相关标签映射
function getWakeupGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'exercise': '晨练运动',
    'study': '学习充电',
    'work': '工作效率',
    'meditation': '冥想静心',
    'planning': '规划一天',
    'hobby': '个人爱好'
  };
  return labels[value] || value;
}

function getSupportMethodLabel(value: string): string {
  const labels: Record<string, string> = {
    'early_sleep': '提前睡觉',
    'no_phone': '睡前不玩手机',
    'alarm_strategy': '闹钟策略',
    'morning_routine': '晨间例行公事',
    'accountability': '找人监督',
    'gradual_adjustment': '逐步调整'
  };
  return labels[value] || value;
}

// 饮水相关标签映射
function getWaterGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'skin_health': '改善肌肤',
    'weight_loss': '辅助减重',
    'detox': '排毒养颜',
    'energy': '提升精力',
    'kidney_health': '肾脏健康',
    'habit_building': '养成习惯'
  };
  return labels[value] || value;
}

function getWaterTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'plain_water': '白开水',
    'mineral_water': '矿泉水',
    'lemon_water': '柠檬水',
    'tea': '茶类',
    'fruit_water': '果味水'
  };
  return labels[value] || value;
}

function getWaterReminderLabel(value: string): string {
  const labels: Record<string, string> = {
    'phone_app': '手机APP',
    'alarm_clock': '闹钟提醒',
    'water_bottle': '智能水杯',
    'sticky_notes': '便签提醒',
    'habit_tracker': '习惯追踪器'
  };
  return labels[value] || value;
}

// 早起挑战配置
export const HEALTH_WAKEUP_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'SLEEP',
  sections: [
    {
      id: 'wakeup_basics',
      title: '早起基础',
      fields: [
        {
          id: 'currentTime',
          label: '目前起床时间',
          type: 'select',
          required: true,
          options: [
            { value: '5:00', label: '5:00' },
            { value: '5:30', label: '5:30' },
            { value: '6:00', label: '6:00' },
            { value: '6:30', label: '6:30' },
            { value: '7:00', label: '7:00' },
            { value: '7:30', label: '7:30' },
            { value: '8:00', label: '8:00' },
            { value: '8:30', label: '8:30' },
            { value: '9:00', label: '9:00或更晚' }
          ],
          defaultValue: '7:00'
        },
        {
          id: 'targetTime',
          label: '目标起床时间',
          type: 'select',
          required: true,
          options: [
            { value: '4:30', label: '4:30' },
            { value: '5:00', label: '5:00' },
            { value: '5:30', label: '5:30' },
            { value: '6:00', label: '6:00' },
            { value: '6:30', label: '6:30' },
            { value: '7:00', label: '7:00' }
          ],
          defaultValue: '6:00'
        }
      ]
    },
    {
      id: 'wakeup_motivation',
      title: '早起动机',
      fields: [
        {
          id: 'motivation',
          label: '早起目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'exercise', label: '晨练运动', description: '利用清晨时光锻炼身体' },
            { value: 'study', label: '学习充电', description: '安静的学习时间' },
            { value: 'work', label: '工作效率', description: '提前开始工作，提高效率' },
            { value: 'meditation', label: '冥想静心', description: '晨间冥想，调整心态' },
            { value: 'planning', label: '规划一天', description: '制定当日计划' },
            { value: 'hobby', label: '个人爱好', description: '专注于兴趣爱好' }
          ],
          defaultValue: ['exercise']
        },
        {
          id: 'challenges',
          label: '面临挑战',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'sleep_difficulty', label: '入睡困难', description: '晚上难以入睡' },
            { value: 'wake_difficulty', label: '起床困难', description: '早上起不来' },
            { value: 'energy_low', label: '精力不足', description: '早起后感觉疲惫' },
            { value: 'schedule_conflict', label: '时间冲突', description: '与其他安排冲突' },
            { value: 'motivation_lack', label: '动力不足', description: '缺乏坚持的动力' }
          ],
          defaultValue: ['wake_difficulty']
        }
      ]
    },
    {
      id: 'wakeup_strategy',
      title: '早起策略',
      fields: [
        {
          id: 'support',
          label: '支持方式',
          type: 'select',
          required: true,
          options: [
            { value: 'early_sleep', label: '提前睡觉' },
            { value: 'no_phone', label: '睡前不玩手机' },
            { value: 'alarm_strategy', label: '闹钟策略' },
            { value: 'morning_routine', label: '晨间例行公事' },
            { value: 'accountability', label: '找人监督' },
            { value: 'gradual_adjustment', label: '逐步调整' }
          ],
          defaultValue: 'early_sleep'
        },
        {
          id: 'rewards',
          label: '奖励机制',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'breakfast_treat', label: '美味早餐' },
            { value: 'morning_coffee', label: '特制咖啡' },
            { value: 'favorite_activity', label: '喜爱活动' },
            { value: 'progress_tracking', label: '进度记录' },
            { value: 'social_sharing', label: '分享成就' },
            { value: 'weekly_reward', label: '周末奖励' }
          ],
          defaultValue: ['breakfast_treat', 'progress_tracking']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const wakeupConfig = config as HealthWakeUpConfig;
    const targetTime = wakeupConfig.targetTime;
    const mainGoal = wakeupConfig.motivation?.[0] ? getWakeupGoalLabel(wakeupConfig.motivation[0]) : '健康生活';
    return `${targetTime}早起${mainGoal}挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const wakeupConfig = config as HealthWakeUpConfig;
    const currentTime = wakeupConfig.currentTime || '7:00';
    const targetTime = wakeupConfig.targetTime || '6:00';
    const goals = wakeupConfig.motivation?.map((m: string) => getWakeupGoalLabel(m)).join('、') || '健康生活';
    const supportMethod = getSupportMethodLabel(wakeupConfig.support || 'early_sleep');

    return `从${currentTime}起床调整到${targetTime}起床，通过${supportMethod}等方式保证充足睡眠。通过早起实现${goals}的目标，养成健康的作息习惯，提升生活质量和工作效率。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const wakeupConfig = config as HealthWakeUpConfig;
    const motivation = wakeupConfig.motivation || [];
    const challenges = wakeupConfig.challenges || [];

    // 根据面临的挑战调整指导建议
    if (challenges.includes('wake_difficulty') || challenges.includes('motivation_lack')) {
      return '每天提交起床时间截图（手机时间或闹钟），记录早起后的活动。建议从周末开始尝试，逐步适应新的作息时间。可以设置多个闹钟，寻找朋友监督。';
    } else if (motivation.includes('exercise') || motivation.includes('meditation')) {
      return '每天提交起床时间证明和晨间活动照片，记录早起后的运动或冥想活动。分享早起带来的精神状态改善和一天的收获感受。';
    } else {
      return '每天提交起床时间证明和晨间活动照片，记录早起的收获和感受。坚持记录睡眠质量和精神状态的变化，分享早起生活的积极影响。';
    }
  }
};

// 每日饮水配置
export const HEALTH_WATER_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'DIET',
  sections: [
    {
      id: 'water_basics',
      title: '饮水基础',
      fields: [
        {
          id: 'currentIntake',
          label: '目前日饮水量',
          type: 'select',
          required: true,
          options: [
            { value: 'less_1L', label: '不到1升' },
            { value: '1-1.5L', label: '1-1.5升' },
            { value: '1.5-2L', label: '1.5-2升' },
            { value: '2-2.5L', label: '2-2.5升' },
            { value: 'more_2.5L', label: '2.5升以上' }
          ],
          defaultValue: '1.5-2L'
        },
        {
          id: 'targetAmount',
          label: '目标日饮水量',
          type: 'select',
          required: true,
          options: [
            { value: '1.5L', label: '1.5升' },
            { value: '2L', label: '2升' },
            { value: '2.5L', label: '2.5升' },
            { value: '3L', label: '3升' },
            { value: '3.5L', label: '3.5升' }
          ],
          defaultValue: '2L'
        }
      ]
    },
    {
      id: 'water_goals',
      title: '饮水目标',
      fields: [
        {
          id: 'motivation',
          label: '健康目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'skin_health', label: '改善肌肤', description: '促进新陈代谢，改善肌肤状态' },
            { value: 'weight_loss', label: '辅助减重', description: '增加饱腹感，促进代谢' },
            { value: 'detox', label: '排毒养颜', description: '帮助身体排出毒素' },
            { value: 'energy', label: '提升精力', description: '避免脱水导致的疲劳' },
            { value: 'kidney_health', label: '肾脏健康', description: '减轻肾脏负担' },
            { value: 'habit_building', label: '养成习惯', description: '建立健康的饮水习惯' }
          ],
          defaultValue: ['skin_health']
        },
        {
          id: 'reminders',
          label: '提醒方式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'phone_app', label: '手机APP' },
            { value: 'alarm_clock', label: '闹钟提醒' },
            { value: 'water_bottle', label: '智能水杯' },
            { value: 'sticky_notes', label: '便签提醒' },
            { value: 'habit_tracker', label: '习惯追踪器' }
          ],
          defaultValue: ['phone_app']
        }
      ]
    },
    {
      id: 'water_schedule',
      title: '饮水安排',
      fields: [
        {
          id: 'schedule',
          label: '饮水时间安排',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'morning_wake', label: '晨起一杯', description: '起床后立即饮水' },
            { value: 'before_meals', label: '餐前饮水', description: '三餐前30分钟' },
            { value: 'work_breaks', label: '工作间隙', description: '工作中定时饮水' },
            { value: 'exercise', label: '运动前后', description: '运动时补充水分' },
            { value: 'evening', label: '睡前适量', description: '睡前1小时少量饮水' }
          ],
          defaultValue: ['morning_wake', 'before_meals']
        },
        {
          id: 'reminders',
          label: '提醒方式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'phone_app', label: '手机应用提醒' },
            { value: 'water_bottle', label: '带刻度水杯' },
            { value: 'alarm', label: '定时闹钟' },
            { value: 'sticky_notes', label: '便签提醒' },
            { value: 'habit_tracker', label: '习惯追踪器' }
          ],
          defaultValue: ['phone_app']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const waterConfig = config as HealthWaterConfig;
    const target = waterConfig.targetAmount || '2000ml';
    const mainGoal = waterConfig.motivation?.[0] ? getWaterGoalLabel(waterConfig.motivation[0]) : '健康饮水';
    return `每日${target}${mainGoal}挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const waterConfig = config as HealthWaterConfig;
    const current = waterConfig.currentIntake || '1.5-2L';
    const target = waterConfig.targetAmount || '2L';
    const goals = waterConfig.motivation?.map((m: string) => getWaterGoalLabel(m)).join('、') || '身体健康';
    const types = waterConfig.reminders?.map((type: string) => getWaterReminderLabel(type)).join('、') || '多样化提醒';

    return `从目前的${current}提升到每日${target}饮水量，通过${types}的方式，实现${goals}的健康目标。科学饮水，养成良好的饮水习惯。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const waterConfig = config as HealthWaterConfig;
    const hasReminder = waterConfig.reminders?.includes('phone_app');

    if (hasReminder) {
      return '每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。';
    } else {
      return '每日手动记录饮水次数和总量，拍照记录水杯或饮水过程。分享饮水心得和身体变化感受。';
    }
  }
};
