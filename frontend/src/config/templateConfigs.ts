import {
  TemplateConfigDefinition,
  TemplateType,
  LearningLanguageConfig,
  FitnessGymConfig,
  FitnessRunningConfig,
  FitnessYogaConfig,
  TemplateConfig
} from '../types/templateConfig';

// 导入更多配置
import {
  LEARNING_READING_CONFIG,
  LEARNING_SKILL_CONFIG,
  HEALTH_WAKEUP_CONFIG,
  HEALTH_WATER_CONFIG
} from './templateConfigs2';

import {
  HEALTH_MEDITATION_CONFIG,
  PERSONAL_PRODUCTIVITY_CONFIG,
  PERSONAL_CREATIVITY_CONFIG,
  PERSONAL_GRATITUDE_CONFIG
} from './templateConfigs3';

import {
  LIFESTYLE_COOKING_CONFIG,
  LIFESTYLE_ORGANIZATION_CONFIG,
  WORK_STARTUP_CONFIG
} from './templateConfigs4';

// 导入精细模板配置 - 健康类
import {
  HEALTH_SLEEP_QUALITY_CONFIG,
  HEALTH_DIET_BALANCED_CONFIG,
  HEALTH_DIET_NO_SUGAR_CONFIG,
  HEALTH_MENTAL_GRATITUDE_CONFIG,
  HEALTH_MENTAL_DIGITAL_DETOX_CONFIG
} from './templateConfigs5';

// 导入精细模板配置 - 健身类
import {
  FITNESS_CARDIO_CYCLING_CONFIG,
  FITNESS_STRENGTH_GYM_CONFIG,
  FITNESS_FLEXIBILITY_STRETCHING_CONFIG
} from './templateConfigs6';

// 导入精细模板配置 - 学习类
import {
  LEARNING_LANGUAGE_SPEAKING_CONFIG,
  LEARNING_SKILL_PROGRAMMING_CONFIG,
  LEARNING_SKILL_DESIGN_CONFIG,
  LEARNING_SKILL_MUSIC_CONFIG,
  LEARNING_READING_BOOK_CONFIG
} from './templateConfigs7';

// 导入精细模板配置 - 个人成长类
import {
  PERSONAL_PRODUCTIVITY_TODO_CONFIG,
  PERSONAL_CREATIVITY_WRITING_CONFIG,
  PERSONAL_CREATIVITY_DRAWING_CONFIG,
  PERSONAL_GROWTH_REFLECTION_CONFIG,
  PERSONAL_GROWTH_LEARNING_CONFIG
} from './templateConfigs8';

// 导入精细模板配置 - 生活方式类
import {
  LIFESTYLE_HOME_CLEANING_CONFIG
} from './templateConfigs9';

// 导入精细模板配置 - 职业发展和高级类
import {
  CAREER_STARTUP_PROGRESS_CONFIG,
  CAREER_STARTUP_PLAN_CONFIG,
  CAREER_NETWORKING_LINKEDIN_CONFIG,
  CAREER_SKILLS_CERTIFICATION_CONFIG,
  CAREER_SKILLS_PRESENTATION_CONFIG,
  ADVANCED_INTERMITTENT_FASTING_CONFIG,
  ADVANCED_SLEEP_OPTIMIZATION_CONFIG,
  ADVANCED_MARATHON_TRAINING_CONFIG,
  ADVANCED_HABIT_STACKING_CONFIG
} from './templateConfigs10';

// 学习-语言学习模板配置（外语学习打卡）
export const LEARNING_LANGUAGE_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LEARNING',
  subcategory: 'LANGUAGE',
  sections: [
    {
      id: 'basic_settings',
      title: '基础设置',
      fields: [
        {
          id: 'language',
          label: '语种选择',
          type: 'select',
          required: true,
          options: [
            { value: 'english', label: '英语' },
            { value: 'spanish', label: '西班牙语' },
            { value: 'french', label: '法语' },
            { value: 'japanese', label: '日语' },
            { value: 'korean', label: '韩语' },
            { value: 'german', label: '德语' },
            { value: 'italian', label: '意大利语' },
            { value: 'chinese', label: '中文' },
            { value: 'other', label: '其他' }
          ],
          defaultValue: 'english'
        },
        {
          id: 'content',
          label: '学习内容',
          type: 'select',
          required: true,
          options: [
            { value: 'phonetics', label: '音标' },
            { value: 'vocabulary', label: '单词' },
            { value: 'grammar', label: '语法' },
            { value: 'phrases', label: '词汇' },
            { value: 'sentences', label: '句子' },
            { value: 'conversation', label: '对话' },
            { value: 'writing', label: '写作' }
          ],
          defaultValue: 'vocabulary'
        }
      ]
    },
    {
      id: 'learning_method',
      title: '学习方式',
      fields: [
        {
          id: 'type',
          label: '学习类型',
          type: 'radio',
          required: true,
          options: [
            { value: 'reading', label: '阅读' },
            { value: 'writing', label: '写作' },
            { value: 'listening', label: '听力' },
            { value: 'speaking', label: '口语' }
          ],
          defaultValue: 'reading'
        },
        {
          id: 'purposes',
          label: '学习目的',
          type: 'checkbox',
          options: [
            { value: 'academic', label: '学业' },
            { value: 'career', label: '就业' },
            { value: 'business', label: '商务' },
            { value: 'improvement', label: '提升' },
            { value: 'romance', label: '恋爱' },
            { value: 'travel', label: '旅行' }
          ],
          defaultValue: ['improvement']
        },
        {
          id: 'partners',
          label: '学习伙伴',
          type: 'checkbox',
          options: [
            { value: 'native', label: '本国人' },
            { value: 'foreign', label: '外国人' },
            { value: 'textbook', label: '课本' },
            { value: 'ai', label: 'AI' },
            { value: 'app', label: '学习APP' }
          ],
          defaultValue: ['textbook']
        }
      ]
    },
    {
      id: 'commitment',
      title: '坚持程度',
      fields: [
        {
          id: 'persistence',
          label: '是否会放弃',
          type: 'tabs',
          required: true,
          options: [
            { value: 'easy_quit', label: '很容易放弃' },
            { value: 'depends', label: '看情况' },
            { value: 'can_persist', label: '估计能坚持一段时间' },
            { value: 'long_term', label: '能坚持很久' }
          ],
          defaultValue: 'can_persist'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const langConfig = config as LearningLanguageConfig;
    const languageMap: Record<string, string> = {
      english: '英语',
      spanish: '西班牙语',
      french: '法语',
      japanese: '日语',
      korean: '韩语',
      german: '德语',
      italian: '意大利语',
      chinese: '中文'
    };
    
    const contentMap: Record<string, string> = {
      phonetics: '音标',
      vocabulary: '单词',
      grammar: '语法',
      phrases: '词汇',
      sentences: '句子',
      conversation: '对话',
      writing: '写作'
    };
    
    const language = languageMap[langConfig.language] || langConfig.language;
    const content = contentMap[langConfig.content] || langConfig.content;
    
    return `${language}${content}学习打卡`;
  },
  generateDescription: (config: TemplateConfig) => {
    const langConfig = config as LearningLanguageConfig;
    const languageMap: Record<string, string> = {
      english: '英语',
      spanish: '西班牙语',
      french: '法语',
      japanese: '日语',
      korean: '韩语'
    };
    
    const typeMap: Record<string, string> = {
      reading: '阅读',
      writing: '写作',
      listening: '听力',
      speaking: '口语'
    };
    
    const language = languageMap[langConfig.language] || langConfig.language;
    const type = typeMap[langConfig.type] || langConfig.type;
    const purposes = langConfig.purposes?.join('、') || '提升';
    
    return `通过${type}方式学习${language}，主要目的是${purposes}。每天坚持学习，提高语言能力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const langConfig = config as LearningLanguageConfig;
    const typeMap: Record<string, string> = {
      reading: '阅读材料截图',
      writing: '写作练习照片',
      listening: '听力练习截图',
      speaking: '口语练习录音或视频'
    };
    
    const instruction = typeMap[langConfig.type] || '学习证据';
    return `每天提交${instruction}，包含学习内容和时长记录`;
  }
};

// 健身-健身房训练模板配置
export const FITNESS_GYM_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'FITNESS',
  subcategory: 'STRENGTH',
  sections: [
    {
      id: 'training_basics',
      title: '训练基础',
      fields: [
        {
          id: 'trainingType',
          label: '训练类型',
          type: 'select',
          required: true,
          options: [
            { value: 'strength', label: '力量训练' },
            { value: 'muscle_building', label: '增肌训练' },
            { value: 'fat_loss', label: '减脂训练' },
            { value: 'endurance', label: '耐力训练' },
            { value: 'functional', label: '功能性训练' },
            { value: 'powerlifting', label: '力量举' },
            { value: 'bodybuilding', label: '健美训练' }
          ],
          defaultValue: 'strength'
        },
        {
          id: 'targetMuscle',
          label: '目标肌群',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'chest', label: '胸肌' },
            { value: 'back', label: '背肌' },
            { value: 'shoulders', label: '肩膀' },
            { value: 'arms', label: '手臂' },
            { value: 'legs', label: '腿部' },
            { value: 'core', label: '核心' },
            { value: 'glutes', label: '臀部' },
            { value: 'full_body', label: '全身' }
          ],
          defaultValue: ['chest', 'back']
        }
      ]
    },
    {
      id: 'training_plan',
      title: '训练计划',
      fields: [
        {
          id: 'experience',
          label: '训练经验',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '新手（0-6个月）' },
            { value: 'intermediate', label: '中级（6个月-2年）' },
            { value: 'advanced', label: '高级（2年以上）' },
            { value: 'expert', label: '专业级（5年以上）' }
          ],
          defaultValue: 'beginner'
        },
        {
          id: 'frequency',
          label: '训练频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天' },
            { value: 'every_other_day', label: '隔天一次' },
            { value: '3_times_week', label: '每周3次' },
            { value: '4_times_week', label: '每周4次' },
            { value: '5_times_week', label: '每周5次' },
            { value: 'weekends_only', label: '仅周末' }
          ],
          defaultValue: '3_times_week'
        },
        {
          id: 'duration',
          label: '单次训练时长',
          type: 'select',
          required: true,
          options: [
            { value: '30min', label: '30分钟' },
            { value: '45min', label: '45分钟' },
            { value: '60min', label: '1小时' },
            { value: '90min', label: '1.5小时' },
            { value: '120min', label: '2小时' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: '60min'
        }
      ]
    },
    {
      id: 'goals_motivation',
      title: '目标与动机',
      fields: [
        {
          id: 'goals',
          label: '训练目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'build_muscle', label: '增肌塑形' },
            { value: 'lose_weight', label: '减重减脂' },
            { value: 'increase_strength', label: '提升力量' },
            { value: 'improve_endurance', label: '增强耐力' },
            { value: 'health_maintenance', label: '健康维护' },
            { value: 'stress_relief', label: '缓解压力' },
            { value: 'competition_prep', label: '比赛准备' },
            { value: 'rehabilitation', label: '康复训练' }
          ],
          defaultValue: ['build_muscle', 'increase_strength']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const gymConfig = config as FitnessGymConfig;
    const typeMap: Record<string, string> = {
      strength: '力量训练',
      muscle_building: '增肌训练',
      fat_loss: '减脂训练',
      endurance: '耐力训练',
      functional: '功能性训练',
      powerlifting: '力量举',
      bodybuilding: '健美训练'
    };

    const frequencyMap: Record<string, string> = {
      daily: '每日',
      every_other_day: '隔日',
      '3_times_week': '每周3次',
      '4_times_week': '每周4次',
      '5_times_week': '每周5次',
      weekends_only: '周末'
    };

    const trainingType = typeMap[gymConfig.trainingType] || gymConfig.trainingType;
    const frequency = frequencyMap[gymConfig.frequency] || gymConfig.frequency;

    return `${frequency}${trainingType}挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const gymConfig = config as FitnessGymConfig;
    const typeMap: Record<string, string> = {
      strength: '力量训练',
      muscle_building: '增肌训练',
      fat_loss: '减脂训练',
      endurance: '耐力训练'
    };

    const durationMap: Record<string, string> = {
      '30min': '30分钟',
      '45min': '45分钟',
      '60min': '1小时',
      '90min': '1.5小时',
      '120min': '2小时',
      'flexible': '灵活时长'
    };

    const experienceMap: Record<string, string> = {
      beginner: '新手',
      intermediate: '中级',
      advanced: '高级',
      expert: '专家'
    };

    const trainingType = typeMap[gymConfig.trainingType] || gymConfig.trainingType;
    const duration = durationMap[gymConfig.duration] || gymConfig.duration;
    const experience = experienceMap[gymConfig.experience] || '新手';
    const goals = gymConfig.goals?.map(goal => {
      const goalMap: Record<string, string> = {
        build_muscle: '增肌塑形',
        lose_weight: '减重减脂',
        increase_strength: '提升力量',
        improve_endurance: '增强耐力',
        health_maintenance: '健康维护',
        stress_relief: '缓解压力',
        competition_prep: '比赛准备',
        rehabilitation: '康复训练'
      };
      return goalMap[goal] || goal;
    }).join('、') || '健身目标';
    const muscles = gymConfig.targetMuscle?.map(muscle => {
      const muscleMap: Record<string, string> = {
        chest: '胸肌',
        back: '背肌',
        shoulders: '肩膀',
        arms: '手臂',
        legs: '腿部',
        core: '核心',
        glutes: '臀部',
        full_body: '全身'
      };
      return muscleMap[muscle] || muscle;
    }).join('、') || '全身肌群';

    return `${experience}水平的${trainingType}，重点锻炼${muscles}，每次训练${duration}，主要目标是${goals}。坚持规律训练，打造理想身材。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const gymConfig = config as FitnessGymConfig;
    const experienceMap: Record<string, string> = {
      beginner: '训练动作照片和器械使用记录',
      intermediate: '训练计划执行照片和重量记录',
      advanced: '详细训练数据和动作视频',
      expert: '专业训练分析和进度追踪'
    };

    const instruction = experienceMap[gymConfig.experience] || '训练照片和记录';
    return `每次训练后提交${instruction}，包含训练内容、使用重量和训练感受`;
  }
};

// 跑步训练配置
export const FITNESS_RUNNING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'FITNESS',
  subcategory: 'CARDIO',
  sections: [
    {
      id: 'running_basics',
      title: '跑步基础',
      fields: [
        {
          id: 'experience',
          label: '跑步经验',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初学者', description: '刚开始跑步或跑步不到3个月' },
            { value: 'intermediate', label: '中级', description: '跑步3个月到1年' },
            { value: 'advanced', label: '高级', description: '跑步1年以上' },
            { value: 'expert', label: '专业', description: '参加过马拉松或专业训练' }
          ],
          defaultValue: 'beginner'
        },
        {
          id: 'goals',
          label: '跑步目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'weight_loss', label: '减重塑形' },
            { value: 'endurance', label: '提升耐力' },
            { value: 'speed', label: '提高速度' },
            { value: 'health', label: '健康维护' },
            { value: 'stress_relief', label: '缓解压力' },
            { value: 'competition', label: '参加比赛' }
          ],
          defaultValue: ['health']
        }
      ]
    },
    {
      id: 'running_plan',
      title: '训练计划',
      fields: [
        {
          id: 'terrain',
          label: '地形偏好',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'road', label: '公路跑' },
            { value: 'track', label: '跑道' },
            { value: 'trail', label: '越野跑' },
            { value: 'treadmill', label: '跑步机' },
            { value: 'park', label: '公园小径' }
          ],
          defaultValue: ['road']
        },
        {
          id: 'frequency',
          label: '跑步频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天' },
            { value: '5_times_week', label: '每周5次' },
            { value: '3_times_week', label: '每周3次' },
            { value: '2_times_week', label: '每周2次' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: '3_times_week'
        },
        {
          id: 'distance',
          label: '目标距离',
          type: 'select',
          required: true,
          options: [
            { value: '1-3km', label: '1-3公里' },
            { value: '3-5km', label: '3-5公里' },
            { value: '5-10km', label: '5-10公里' },
            { value: '10km+', label: '10公里以上' },
            { value: 'progressive', label: '逐步增加' }
          ],
          defaultValue: '3-5km'
        }
      ]
    },
    {
      id: 'schedule_preference',
      title: '时间安排',
      fields: [
        {
          id: 'timeOfDay',
          label: '跑步时间',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'early_morning', label: '清晨 (5-7点)' },
            { value: 'morning', label: '上午 (7-10点)' },
            { value: 'afternoon', label: '下午 (14-17点)' },
            { value: 'evening', label: '傍晚 (17-19点)' },
            { value: 'night', label: '夜晚 (19-21点)' }
          ],
          defaultValue: ['morning']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const runningConfig = config as FitnessRunningConfig;
    const frequency = getFrequencyLabel(runningConfig.frequency);
    const distance = runningConfig.distance || '适量';
    return `${frequency}${distance}跑步训练`;
  },
  generateDescription: (config: TemplateConfig) => {
    const runningConfig = config as FitnessRunningConfig;
    const goals = runningConfig.goals?.map((goal: string) => getRunningGoalLabel(goal)).join('、') || '健康维护';
    const terrain = runningConfig.terrain?.map((t: string) => getTerrainLabel(t)).join('、') || '多样化';
    const experience = getExperienceLabel(runningConfig.experience);

    return `针对${experience}跑者设计的训练计划，主要目标是${goals}。训练场地包括${terrain}，通过科学的训练安排，逐步提升跑步能力和身体素质。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const runningConfig = config as FitnessRunningConfig;
    const experience = runningConfig.experience;

    if (experience === 'beginner') {
      return '每次跑步前进行5-10分钟热身，跑步过程中注意呼吸节奏，跑后进行拉伸。提交跑步路线截图或运动app记录，包含距离、时间和配速信息。';
    } else if (experience === 'advanced') {
      return '按照训练计划执行，注意心率控制和配速管理。提交详细的跑步数据，包括距离、时间、配速、心率等指标，以及训练感受。';
    } else {
      return '根据个人能力调整跑步强度，保持规律训练。提交跑步记录截图，包含基本的距离和时间信息，记录身体感受和进步情况。';
    }
  }
};

// 通用挑战模板配置
export const GENERAL_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.GENERAL,
  category: 'CUSTOM',
  sections: [],
  generateTitle: () => '自定义挑战',
  generateDescription: () => '完全自由的挑战，由用户自定义所有内容',
  generateInstructions: () => '按照挑战要求提交相应证据'
};

// 瑜伽练习配置
export const FITNESS_YOGA_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'FITNESS',
  subcategory: 'YOGA',
  sections: [
    {
      id: 'yoga_basics',
      title: '瑜伽基础',
      fields: [
        {
          id: 'style',
          label: '瑜伽风格',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'hatha', label: '哈他瑜伽', description: '温和的基础瑜伽' },
            { value: 'vinyasa', label: '流瑜伽', description: '动态连贯的练习' },
            { value: 'yin', label: '阴瑜伽', description: '静态深度拉伸' },
            { value: 'power', label: '力量瑜伽', description: '强度较高的练习' },
            { value: 'restorative', label: '修复瑜伽', description: '放松恢复类练习' },
            { value: 'meditation', label: '冥想瑜伽', description: '注重内在平静' }
          ],
          defaultValue: ['hatha']
        },
        {
          id: 'experience',
          label: '练习经验',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初学者', description: '刚开始练习或练习不到6个月' },
            { value: 'intermediate', label: '中级', description: '练习6个月到2年' },
            { value: 'advanced', label: '高级', description: '练习2年以上' }
          ],
          defaultValue: 'beginner'
        }
      ]
    },
    {
      id: 'practice_goals',
      title: '练习目标',
      fields: [
        {
          id: 'goals',
          label: '练习目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'flexibility', label: '提升柔韧性' },
            { value: 'strength', label: '增强力量' },
            { value: 'balance', label: '改善平衡' },
            { value: 'stress_relief', label: '缓解压力' },
            { value: 'mindfulness', label: '提升专注力' },
            { value: 'posture', label: '改善体态' },
            { value: 'sleep', label: '改善睡眠' }
          ],
          defaultValue: ['flexibility', 'stress_relief']
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
            { value: '60_min', label: '60分钟' },
            { value: '90_min', label: '90分钟' }
          ],
          defaultValue: '30_min'
        }
      ]
    },
    {
      id: 'practice_schedule',
      title: '练习安排',
      fields: [
        {
          id: 'timeOfDay',
          label: '练习时间',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'early_morning', label: '清晨 (6-8点)', description: '唤醒身体，开启新的一天' },
            { value: 'morning', label: '上午 (8-11点)', description: '精力充沛的练习时间' },
            { value: 'afternoon', label: '下午 (14-17点)', description: '缓解工作疲劳' },
            { value: 'evening', label: '傍晚 (17-19点)', description: '释放一天的压力' },
            { value: 'night', label: '睡前 (19-21点)', description: '放松身心，准备休息' }
          ],
          defaultValue: ['morning']
        },
        {
          id: 'environment',
          label: '练习环境',
          type: 'radio',
          required: true,
          options: [
            { value: 'home', label: '居家练习', description: '在家中安静的空间' },
            { value: 'studio', label: '瑜伽馆', description: '专业的瑜伽工作室' },
            { value: 'outdoor', label: '户外练习', description: '公园或自然环境中' },
            { value: 'online', label: '在线课程', description: '跟随线上视频练习' }
          ],
          defaultValue: 'home'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const yogaConfig = config as FitnessYogaConfig;
    const duration = getDurationLabel(yogaConfig.duration);
    const mainStyle = yogaConfig.style?.[0] ? getYogaStyleLabel(yogaConfig.style[0]) : '瑜伽';
    return `每日${duration}${mainStyle}练习`;
  },
  generateDescription: (config: TemplateConfig) => {
    const yogaConfig = config as FitnessYogaConfig;
    const goals = yogaConfig.goals?.map((goal: string) => getYogaGoalLabel(goal)).join('、') || '身心健康';
    const styles = yogaConfig.style?.map((style: string) => getYogaStyleLabel(style)).join('、') || '多样化瑜伽';
    const environment = getYogaEnvironmentLabel(yogaConfig.environment);

    return `通过${styles}练习，在${environment}中实现${goals}的目标。每日坚持练习，逐步提升身体柔韧性、力量和内在平静，达到身心和谐的状态。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const yogaConfig = config as FitnessYogaConfig;
    const experience = yogaConfig.experience;

    if (experience === 'beginner') {
      return '练习前进行简单热身，注意呼吸与动作的配合，不要勉强做高难度动作。提交练习照片或视频，展示瑜伽动作，记录练习感受和身体变化。';
    } else {
      return '根据个人能力选择合适的练习强度，保持正念和专注。提交练习记录，包括练习的体式、时长和内在体验，分享练习心得。';
    }
  }
};

// 模板配置映射
export const TEMPLATE_CONFIGS: Record<string, TemplateConfigDefinition> = {
  // 学习成长类 (LEARNING)
  'language_learning': LEARNING_LANGUAGE_CONFIG,  // 外语学习打卡
  'daily_reading': LEARNING_READING_CONFIG,       // 每日阅读挑战
  'skill_practice': LEARNING_SKILL_CONFIG,        // 技能练习挑战

  // 健身运动类 (FITNESS)
  'gym_workout': FITNESS_GYM_CONFIG,              // 健身房训练
  'running_challenge': FITNESS_RUNNING_CONFIG,    // 跑步训练计划
  'yoga_practice': FITNESS_YOGA_CONFIG,           // 瑜伽冥想练习

  // 健康生活类 (HEALTH)
  'early_wake_up': HEALTH_WAKEUP_CONFIG,          // 早起挑战
  'water_intake': HEALTH_WATER_CONFIG,            // 每日饮水
  'meditation': HEALTH_MEDITATION_CONFIG,         // 冥想练习

  // 个人发展类 (PERSONAL)
  'productivity_boost': PERSONAL_PRODUCTIVITY_CONFIG,  // 效率提升挑战
  'creative_expression': PERSONAL_CREATIVITY_CONFIG,   // 创意表达挑战
  'gratitude_journal': PERSONAL_GRATITUDE_CONFIG,      // 感恩日记记录

  // 生活方式类 (LIFESTYLE)
  'cooking_challenge': LIFESTYLE_COOKING_CONFIG,       // 烹饪技能提升
  'home_organization': LIFESTYLE_ORGANIZATION_CONFIG,  // 居家整理挑战

  // 工作创业类 (WORK)
  'startup_daily_progress': WORK_STARTUP_CONFIG,       // 创业项目日进展

  // 通用挑战
  'general_challenge': GENERAL_CONFIG,                 // 通用挑战

  // ========== 精细模板配置 ==========

  // 健康类精细模板
  'health_sleep_quality': HEALTH_SLEEP_QUALITY_CONFIG,           // 睡眠质量提升
  'health_diet_balanced': HEALTH_DIET_BALANCED_CONFIG,           // 均衡饮食
  'health_diet_no_sugar': HEALTH_DIET_NO_SUGAR_CONFIG,           // 戒糖挑战
  'health_mental_gratitude': HEALTH_MENTAL_GRATITUDE_CONFIG,     // 感恩日记挑战
  'health_mental_digital_detox': HEALTH_MENTAL_DIGITAL_DETOX_CONFIG, // 数字排毒

  // 健身类精细模板
  'fitness_cardio_cycling': FITNESS_CARDIO_CYCLING_CONFIG,       // 骑行训练
  'fitness_strength_gym': FITNESS_STRENGTH_GYM_CONFIG,           // 健身房力量训练
  'fitness_flexibility_stretching': FITNESS_FLEXIBILITY_STRETCHING_CONFIG, // 拉伸训练

  // 学习类精细模板
  'learning_language_speaking': LEARNING_LANGUAGE_SPEAKING_CONFIG, // 口语练习
  'learning_skill_programming': LEARNING_SKILL_PROGRAMMING_CONFIG, // 编程学习
  'learning_skill_design': LEARNING_SKILL_DESIGN_CONFIG,           // 设计学习
  'learning_skill_music': LEARNING_SKILL_MUSIC_CONFIG,             // 音乐学习
  'learning_reading_book': LEARNING_READING_BOOK_CONFIG,           // 阅读书籍

  // 个人成长类精细模板
  'personal_productivity_todo': PERSONAL_PRODUCTIVITY_TODO_CONFIG, // 待办事项管理
  'personal_creativity_writing': PERSONAL_CREATIVITY_WRITING_CONFIG, // 写作练习
  'personal_creativity_drawing': PERSONAL_CREATIVITY_DRAWING_CONFIG, // 绘画练习
  'personal_growth_reflection': PERSONAL_GROWTH_REFLECTION_CONFIG,   // 反思日记
  'personal_growth_learning': PERSONAL_GROWTH_LEARNING_CONFIG,       // 学习新知识

  // 生活方式类精细模板
  'lifestyle_home_cleaning': LIFESTYLE_HOME_CLEANING_CONFIG,         // 居家清洁

  // 职业发展类精细模板
  'career_startup_progress': CAREER_STARTUP_PROGRESS_CONFIG,         // 创业项目进展
  'career_startup_plan': CAREER_STARTUP_PLAN_CONFIG,                 // 创业计划
  'career_networking_linkedin': CAREER_NETWORKING_LINKEDIN_CONFIG,   // LinkedIn社交
  'career_skills_certification': CAREER_SKILLS_CERTIFICATION_CONFIG, // 职业认证
  'career_skills_presentation': CAREER_SKILLS_PRESENTATION_CONFIG,   // 演讲能力

  // 高级模板
  'advanced_intermittent_fasting': ADVANCED_INTERMITTENT_FASTING_CONFIG, // 间歇性断食
  'advanced_sleep_optimization': ADVANCED_SLEEP_OPTIMIZATION_CONFIG,     // 睡眠优化
  'advanced_marathon_training': ADVANCED_MARATHON_TRAINING_CONFIG,       // 马拉松训练
  'advanced_habit_stacking': ADVANCED_HABIT_STACKING_CONFIG              // 习惯叠加
};

// 根据模板获取配置
export function getTemplateConfig(templateName: string): TemplateConfigDefinition | null {
  return TEMPLATE_CONFIGS[templateName] || null;
}

// 新增标签映射函数
function getRunningGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'weight_loss': '减重塑形',
    'endurance': '提升耐力',
    'speed': '提高速度',
    'health': '健康维护',
    'stress_relief': '缓解压力',
    'competition': '参加比赛'
  };
  return labels[value] || value;
}

function getTerrainLabel(value: string): string {
  const labels: Record<string, string> = {
    'road': '公路跑',
    'track': '跑道',
    'trail': '越野跑',
    'treadmill': '跑步机',
    'park': '公园小径'
  };
  return labels[value] || value;
}

function getYogaStyleLabel(value: string): string {
  const labels: Record<string, string> = {
    'hatha': '哈他瑜伽',
    'vinyasa': '流瑜伽',
    'yin': '阴瑜伽',
    'power': '力量瑜伽',
    'restorative': '修复瑜伽',
    'meditation': '冥想瑜伽'
  };
  return labels[value] || value;
}

function getYogaGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'flexibility': '提升柔韧性',
    'strength': '增强力量',
    'balance': '改善平衡',
    'stress_relief': '缓解压力',
    'mindfulness': '提升专注力',
    'posture': '改善体态',
    'sleep': '改善睡眠'
  };
  return labels[value] || value;
}

function getYogaEnvironmentLabel(value: string): string {
  const labels: Record<string, string> = {
    'home': '居家练习',
    'studio': '瑜伽馆',
    'outdoor': '户外练习',
    'online': '在线课程'
  };
  return labels[value] || value;
}

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

function getExperienceLabel(value: string): string {
  const labels: Record<string, string> = {
    'beginner': '初学者',
    'intermediate': '中级',
    'advanced': '高级',
    'expert': '专家'
  };
  return labels[value] || value;
}

function getFrequencyLabel(value: string): string {
  const labels: Record<string, string> = {
    'daily': '每天',
    '5_times_week': '每周5次',
    '3_times_week': '每周3次',
    '2_times_week': '每周2次',
    'once_week': '每周1次',
    'flexible': '灵活安排'
  };
  return labels[value] || value;
}
