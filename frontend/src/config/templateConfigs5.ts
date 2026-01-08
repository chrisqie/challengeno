import {
  TemplateConfigDefinition,
  TemplateType,
  TemplateConfig
} from '../types/templateConfig';

// ============================================
// 健康类精细模板配置
// ============================================

// 辅助函数 - 睡眠质量
const getSleepDurationLabel = (duration: string): string => {
  const map: Record<string, string> = {
    '6h': '6小时',
    '7h': '7小时',
    '8h': '8小时',
    '9h': '9小时'
  };
  return map[duration] || duration;
};

const getSleepGoalLabel = (goal: string): string => {
  const map: Record<string, string> = {
    'deep_sleep': '深度睡眠',
    'rem_sleep': 'REM睡眠',
    'sleep_efficiency': '睡眠效率',
    'wake_less': '减少夜醒'
  };
  return map[goal] || goal;
};

// 睡眠质量提升配置
export const HEALTH_SLEEP_QUALITY_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'HEALTH_SLEEP',
  sections: [
    {
      id: 'sleep_basics',
      title: '睡眠基础',
      fields: [
        {
          id: 'targetDuration',
          label: '目标睡眠时长',
          type: 'select',
          required: true,
          options: [
            { value: '6h', label: '6小时' },
            { value: '7h', label: '7小时' },
            { value: '8h', label: '8小时' },
            { value: '9h', label: '9小时' }
          ],
          defaultValue: '8h'
        },
        {
          id: 'sleepGoals',
          label: '改善目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'deep_sleep', label: '增加深度睡眠', description: '提高深睡比例' },
            { value: 'rem_sleep', label: '改善REM睡眠', description: '提升梦境睡眠质量' },
            { value: 'sleep_efficiency', label: '提高睡眠效率', description: '减少入睡时间' },
            { value: 'wake_less', label: '减少夜间醒来', description: '睡得更沉' }
          ],
          defaultValue: ['deep_sleep']
        }
      ]
    },
    {
      id: 'sleep_tracking',
      title: '监测方式',
      fields: [
        {
          id: 'trackingMethod',
          label: '睡眠监测工具',
          type: 'radio',
          required: true,
          options: [
            { value: 'smart_watch', label: '智能手表', description: 'Apple Watch, 华为等' },
            { value: 'sleep_app', label: '睡眠APP', description: 'Sleep Cycle等' },
            { value: 'fitness_band', label: '运动手环', description: '小米手环等' },
            { value: 'manual', label: '手动记录', description: '自己记录睡眠时间' }
          ],
          defaultValue: 'sleep_app'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const duration = getSleepDurationLabel(config.targetDuration || '8h');
    const mainGoal = config.sleepGoals?.[0] ? getSleepGoalLabel(config.sleepGoals[0]) : '睡眠质量';
    return `每日${duration}${mainGoal}提升`;
  },
  generateDescription: (config: TemplateConfig) => {
    const duration = getSleepDurationLabel(config.targetDuration || '8h');
    const goals = config.sleepGoals?.map((g: string) => getSleepGoalLabel(g)).join('、') || '睡眠质量';
    const method = config.trackingMethod === 'smart_watch' ? '智能手表' :
                   config.trackingMethod === 'sleep_app' ? '睡眠APP' :
                   config.trackingMethod === 'fitness_band' ? '运动手环' : '手动记录';
    
    return `每天保证${duration}优质睡眠，通过${method}监测睡眠数据，重点改善${goals}。科学睡眠，提升生活质量。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const method = config.trackingMethod === 'manual' ? '手动记录睡眠时间和质量感受' : '提交睡眠监测设备的睡眠报告截图';
    return `每天${method}，包含睡眠时长、深度睡眠比例等数据。`;
  }
};

// 辅助函数 - 均衡饮食
const getMealTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    'three_meals': '一日三餐',
    'five_meals': '少食多餐（5餐）',
    'intermittent': '间歇性断食'
  };
  return map[type] || type;
};

const getNutritionFocusLabel = (focus: string): string => {
  const map: Record<string, string> = {
    'protein': '高蛋白',
    'fiber': '高纤维',
    'low_carb': '低碳水',
    'balanced': '营养均衡',
    'vegetarian': '素食',
    'mediterranean': '地中海饮食'
  };
  return map[focus] || focus;
};

// 均衡饮食挑战配置
export const HEALTH_DIET_BALANCED_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'HEALTH_DIET',
  sections: [
    {
      id: 'diet_basics',
      title: '饮食基础',
      fields: [
        {
          id: 'mealPattern',
          label: '饮食模式',
          type: 'radio',
          required: true,
          options: [
            { value: 'three_meals', label: '一日三餐', description: '早中晚三餐' },
            { value: 'five_meals', label: '少食多餐', description: '5-6餐，每餐少量' },
            { value: 'intermittent', label: '间歇性断食', description: '16:8或其他模式' }
          ],
          defaultValue: 'three_meals'
        },
        {
          id: 'nutritionFocus',
          label: '营养重点',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'protein', label: '高蛋白', description: '增肌或减脂' },
            { value: 'fiber', label: '高纤维', description: '促进消化' },
            { value: 'low_carb', label: '低碳水', description: '控制血糖' },
            { value: 'balanced', label: '营养均衡', description: '全面营养' },
            { value: 'vegetarian', label: '素食', description: '植物性饮食' },
            { value: 'mediterranean', label: '地中海饮食', description: '健康脂肪' }
          ],
          defaultValue: ['balanced']
        }
      ]
    },
    {
      id: 'diet_goals',
      title: '饮食目标',
      fields: [
        {
          id: 'dailyVegetables',
          label: '每日蔬菜摄入',
          type: 'select',
          required: true,
          options: [
            { value: '300g', label: '300克（3份）' },
            { value: '500g', label: '500克（5份）' },
            { value: '700g', label: '700克（7份）' }
          ],
          defaultValue: '500g'
        },
        {
          id: 'waterIntake',
          label: '每日饮水量',
          type: 'select',
          required: true,
          options: [
            { value: '1.5L', label: '1.5升' },
            { value: '2L', label: '2升' },
            { value: '2.5L', label: '2.5升' },
            { value: '3L', label: '3升' }
          ],
          defaultValue: '2L'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const pattern = getMealTypeLabel(config.mealPattern || 'three_meals');
    const focus = config.nutritionFocus?.[0] ? getNutritionFocusLabel(config.nutritionFocus[0]) : '均衡';
    return `${pattern}${focus}饮食挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const pattern = getMealTypeLabel(config.mealPattern || 'three_meals');
    const focuses = config.nutritionFocus?.map((f: string) => getNutritionFocusLabel(f)).join('、') || '营养均衡';
    const vegetables = config.dailyVegetables || '500g';
    const water = config.waterIntake || '2L';
    
    return `采用${pattern}的饮食模式，注重${focuses}。每天摄入${vegetables}蔬菜，饮水${water}，养成健康饮食习惯。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天拍摄三餐照片，展示营养搭配。包含蔬菜、蛋白质、碳水化合物等食物种类。';
  }
};

// 辅助函数 - 戒糖挑战
const getSugarLevelLabel = (level: string): string => {
  const map: Record<string, string> = {
    'no_added_sugar': '无添加糖',
    'low_sugar': '低糖（<25g/天）',
    'very_low_sugar': '极低糖（<10g/天）',
    'zero_sugar': '完全戒糖'
  };
  return map[level] || level;
};

// 戒糖挑战配置
export const HEALTH_DIET_NO_SUGAR_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'HEALTH_DIET',
  sections: [
    {
      id: 'sugar_basics',
      title: '戒糖目标',
      fields: [
        {
          id: 'sugarLevel',
          label: '戒糖程度',
          type: 'radio',
          required: true,
          options: [
            { value: 'no_added_sugar', label: '无添加糖', description: '不吃甜品、糖果、含糖饮料' },
            { value: 'low_sugar', label: '低糖', description: '每天<25克糖' },
            { value: 'very_low_sugar', label: '极低糖', description: '每天<10克糖' },
            { value: 'zero_sugar', label: '完全戒糖', description: '包括水果中的糖' }
          ],
          defaultValue: 'no_added_sugar'
        },
        {
          id: 'avoidFoods',
          label: '避免食物',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'desserts', label: '甜品糕点' },
            { value: 'sugary_drinks', label: '含糖饮料' },
            { value: 'candy', label: '糖果零食' },
            { value: 'processed_foods', label: '加工食品' },
            { value: 'fruits', label: '高糖水果' }
          ],
          defaultValue: ['desserts', 'sugary_drinks', 'candy']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const level = getSugarLevelLabel(config.sugarLevel || 'no_added_sugar');
    return `${level}戒糖挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const level = getSugarLevelLabel(config.sugarLevel || 'no_added_sugar');
    const avoidCount = config.avoidFoods?.length || 3;
    
    return `挑战${level}，避免摄入添加糖。远离${avoidCount}类高糖食物，养成低糖健康饮食习惯。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天拍摄饮食照片，证明无糖摄入。记录食物成分，避免隐藏糖分。';
  }
};

// 辅助函数 - 感恩日记
const getGratitudeCountLabel = (count: string): string => {
  const map: Record<string, string> = {
    '3_items': '3件事',
    '5_items': '5件事',
    '10_items': '10件事'
  };
  return map[count] || count;
};

const getGratitudeTimeLabel = (time: string): string => {
  const map: Record<string, string> = {
    'morning': '晨间',
    'evening': '睡前',
    'anytime': '随时'
  };
  return map[time] || time;
};

// 感恩日记配置
export const HEALTH_MENTAL_GRATITUDE_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'HEALTH_MENTAL',
  sections: [
    {
      id: 'gratitude_basics',
      title: '日记设置',
      fields: [
        {
          id: 'itemCount',
          label: '每日记录数量',
          type: 'select',
          required: true,
          options: [
            { value: '3_items', label: '3件感恩的事' },
            { value: '5_items', label: '5件感恩的事' },
            { value: '10_items', label: '10件感恩的事' }
          ],
          defaultValue: '3_items'
        },
        {
          id: 'writingTime',
          label: '记录时间',
          type: 'radio',
          required: true,
          options: [
            { value: 'morning', label: '早晨', description: '开启美好一天' },
            { value: 'evening', label: '睡前', description: '回顾一天收获' },
            { value: 'anytime', label: '随时', description: '灵活安排' }
          ],
          defaultValue: 'evening'
        }
      ]
    },
    {
      id: 'gratitude_focus',
      title: '感恩重点',
      fields: [
        {
          id: 'focusAreas',
          label: '关注领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'relationships', label: '人际关系', description: '家人、朋友、同事' },
            { value: 'health', label: '身体健康', description: '健康的身体' },
            { value: 'achievements', label: '个人成就', description: '完成的事情' },
            { value: 'nature', label: '自然美好', description: '天气、风景' },
            { value: 'opportunities', label: '机会', description: '学习、成长机会' },
            { value: 'simple_joys', label: '小确幸', description: '日常小美好' }
          ],
          defaultValue: ['relationships', 'simple_joys']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const count = getGratitudeCountLabel(config.itemCount || '3_items');
    const time = getGratitudeTimeLabel(config.writingTime || 'evening');
    return `${time}${count}感恩日记`;
  },
  generateDescription: (config: TemplateConfig) => {
    const count = getGratitudeCountLabel(config.itemCount || '3_items');
    const time = getGratitudeTimeLabel(config.writingTime || 'evening');
    const areas = config.focusAreas?.length || 2;

    return `每天${time}记录${count}感恩的事，关注${areas}个生活领域。培养积极心态，提升幸福感。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const count = getGratitudeCountLabel(config.itemCount || '3_items');
    return `每天记录${count}感恩的事，可以是文字、照片或语音。真诚表达感激之情。`;
  }
};

// 辅助函数 - 数字排毒
const getDetoxLevelLabel = (level: string): string => {
  const map: Record<string, string> = {
    'light': '轻度排毒',
    'moderate': '中度排毒',
    'deep': '深度排毒'
  };
  return map[level] || level;
};

// 数字排毒配置
export const HEALTH_MENTAL_DIGITAL_DETOX_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'HEALTH_MENTAL',
  sections: [
    {
      id: 'detox_basics',
      title: '排毒设置',
      fields: [
        {
          id: 'detoxLevel',
          label: '排毒程度',
          type: 'radio',
          required: true,
          options: [
            { value: 'light', label: '轻度排毒', description: '减少社交媒体使用' },
            { value: 'moderate', label: '中度排毒', description: '限制娱乐类APP' },
            { value: 'deep', label: '深度排毒', description: '只保留必要通讯' }
          ],
          defaultValue: 'moderate'
        },
        {
          id: 'detoxTime',
          label: '排毒时段',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'morning', label: '早晨（7-9点）', description: '清晨无手机' },
            { value: 'work_hours', label: '工作时间', description: '专注工作' },
            { value: 'meal_time', label: '用餐时间', description: '享受美食' },
            { value: 'evening', label: '睡前1小时', description: '助眠' },
            { value: 'weekend', label: '周末半天', description: '户外活动' }
          ],
          defaultValue: ['morning', 'evening']
        }
      ]
    },
    {
      id: 'detox_activities',
      title: '替代活动',
      fields: [
        {
          id: 'alternatives',
          label: '用什么替代手机',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'reading', label: '阅读纸质书' },
            { value: 'exercise', label: '运动锻炼' },
            { value: 'meditation', label: '冥想放松' },
            { value: 'social', label: '面对面社交' },
            { value: 'hobbies', label: '兴趣爱好' },
            { value: 'nature', label: '户外活动' }
          ],
          defaultValue: ['reading', 'exercise']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const level = getDetoxLevelLabel(config.detoxLevel || 'moderate');
    const timeCount = config.detoxTime?.length || 2;
    return `${timeCount}时段${level}挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const level = getDetoxLevelLabel(config.detoxLevel || 'moderate');
    const timeCount = config.detoxTime?.length || 2;
    const altCount = config.alternatives?.length || 2;

    return `进行${level}，在${timeCount}个时段远离电子设备。用${altCount}种健康活动替代手机使用，重拾专注力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天记录无手机时段，拍摄替代活动照片。分享数字排毒的感受和收获。';
  }
};

