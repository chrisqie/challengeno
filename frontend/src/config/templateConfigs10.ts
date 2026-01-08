import {
  TemplateConfigDefinition,
  TemplateType,
  TemplateConfig
} from '../types/templateConfig';

// ============================================
// 职业发展类精细模板配置
// ============================================

// 创业项目进展配置
export const CAREER_STARTUP_PROGRESS_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'WORK',
  subcategory: 'CAREER_STARTUP',
  sections: [
    {
      id: 'startup_basics',
      title: '项目设置',
      fields: [
        {
          id: 'projectStage',
          label: '项目阶段',
          type: 'radio',
          required: true,
          options: [
            { value: 'idea', label: '创意阶段', description: '构思和验证' },
            { value: 'mvp', label: 'MVP开发', description: '最小可行产品' },
            { value: 'launch', label: '产品上线', description: '市场推广' },
            { value: 'growth', label: '增长阶段', description: '用户增长' }
          ],
          defaultValue: 'mvp'
        },
        {
          id: 'dailyTasks',
          label: '每日任务类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'development', label: '产品开发' },
            { value: 'marketing', label: '市场推广' },
            { value: 'sales', label: '销售' },
            { value: 'customer', label: '客户服务' },
            { value: 'planning', label: '战略规划' }
          ],
          defaultValue: ['development', 'marketing']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const stages: Record<string, string> = {
      'idea': '创意验证', 'mvp': 'MVP开发', 'launch': '产品上线', 'growth': '增长'
    };
    const stage = stages[config.projectStage || 'mvp'] || 'MVP开发';
    return `创业项目${stage}日进展`;
  },
  generateDescription: (config: TemplateConfig) => {
    const stages: Record<string, string> = {
      'idea': '创意验证阶段', 'mvp': 'MVP开发阶段', 'launch': '产品上线阶段', 'growth': '增长阶段'
    };
    const stage = stages[config.projectStage || 'mvp'] || 'MVP开发阶段';
    const tasks = config.dailyTasks?.length || 2;
    return `记录${stage}的每日进展，涵盖${tasks}个工作领域。坚持推进，实现创业梦想。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交工作进展截图或记录，包含完成的任务和遇到的问题。';
  }
};

// 创业计划配置
export const CAREER_STARTUP_PLAN_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'WORK',
  subcategory: 'CAREER_STARTUP',
  sections: [
    {
      id: 'plan_basics',
      title: '计划设置',
      fields: [
        {
          id: 'planningArea',
          label: '规划领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'business_model', label: '商业模式' },
            { value: 'market_research', label: '市场调研' },
            { value: 'product_design', label: '产品设计' },
            { value: 'financial', label: '财务规划' },
            { value: 'team', label: '团队建设' }
          ],
          defaultValue: ['business_model']
        },
        {
          id: 'frequency',
          label: '规划频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每日规划' },
            { value: 'weekly', label: '每周规划' },
            { value: 'monthly', label: '每月规划' }
          ],
          defaultValue: 'weekly'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每日', 'weekly': '每周', 'monthly': '每月'
    };
    const freq = freqs[config.frequency || 'weekly'] || '每周';
    return `${freq}创业规划复盘`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每天', 'weekly': '每周', 'monthly': '每月'
    };
    const freq = freqs[config.frequency || 'weekly'] || '每周';
    const areas = config.planningArea?.length || 1;
    return `${freq}进行创业规划，涵盖${areas}个关键领域。系统规划，稳步前进。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次提交规划文档或思维导图，记录规划内容和行动计划。';
  }
};

// LinkedIn社交配置
export const CAREER_NETWORKING_LINKEDIN_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'WORK',
  subcategory: 'CAREER_NETWORKING',
  sections: [
    {
      id: 'linkedin_basics',
      title: '社交设置',
      fields: [
        {
          id: 'activities',
          label: '活动类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'post', label: '发布内容' },
            { value: 'comment', label: '评论互动' },
            { value: 'connect', label: '拓展人脉' },
            { value: 'message', label: '私信交流' },
            { value: 'learn', label: '学习课程' }
          ],
          defaultValue: ['post', 'connect']
        },
        {
          id: 'frequency',
          label: '活跃频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天' },
            { value: '3_per_week', label: '每周3次' },
            { value: 'weekly', label: '每周' }
          ],
          defaultValue: '3_per_week'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每日', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || '3_per_week'] || '每周3次';
    return `${freq}LinkedIn职场社交`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每天', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || '3_per_week'] || '每周3次';
    const activities = config.activities?.length || 2;
    return `${freq}在LinkedIn上进行${activities}种职场社交活动，拓展人脉，提升影响力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次提交LinkedIn活动截图，记录发布内容或互动记录。';
  }
};

// 职业认证学习配置
export const CAREER_SKILLS_CERTIFICATION_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'WORK',
  subcategory: 'CAREER_SKILLS',
  sections: [
    {
      id: 'cert_basics',
      title: '认证设置',
      fields: [
        {
          id: 'certType',
          label: '认证类型',
          type: 'select',
          required: true,
          options: [
            { value: 'it', label: 'IT认证', description: 'AWS, Azure等' },
            { value: 'project', label: '项目管理', description: 'PMP, PRINCE2等' },
            { value: 'language', label: '语言认证', description: '托福, 雅思等' },
            { value: 'finance', label: '金融认证', description: 'CFA, CPA等' },
            { value: 'professional', label: '专业认证', description: '行业资格证' }
          ],
          defaultValue: 'it'
        },
        {
          id: 'dailyHours',
          label: '每日学习时长',
          type: 'select',
          required: true,
          options: [
            { value: '1h', label: '1小时' },
            { value: '2h', label: '2小时' },
            { value: '3h', label: '3小时' },
            { value: '4h', label: '4小时以上' }
          ],
          defaultValue: '2h'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const types: Record<string, string> = {
      'it': 'IT', 'project': '项目管理', 'language': '语言', 'finance': '金融', 'professional': '专业'
    };
    const type = types[config.certType || 'it'] || 'IT';
    const hours = config.dailyHours === '1h' ? '1小时' :
                  config.dailyHours === '2h' ? '2小时' :
                  config.dailyHours === '3h' ? '3小时' : '4小时';
    return `每日${hours}${type}认证备考`;
  },
  generateDescription: (config: TemplateConfig) => {
    const types: Record<string, string> = {
      'it': 'IT认证', 'project': '项目管理认证', 'language': '语言认证', 
      'finance': '金融认证', 'professional': '专业认证'
    };
    const type = types[config.certType || 'it'] || 'IT认证';
    const hours = config.dailyHours === '1h' ? '1小时' :
                  config.dailyHours === '2h' ? '2小时' :
                  config.dailyHours === '3h' ? '3小时' : '4小时';
    return `每天学习${hours}，系统备考${type}。通过认证，提升职业竞争力。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交学习进度截图，记录学习内容和练习题目。';
  }
};

// 演讲能力提升配置
export const CAREER_SKILLS_PRESENTATION_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'WORK',
  subcategory: 'CAREER_SKILLS',
  sections: [
    {
      id: 'presentation_basics',
      title: '演讲设置',
      fields: [
        {
          id: 'practiceType',
          label: '练习方式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'recording', label: '录制练习', description: '录视频自评' },
            { value: 'mirror', label: '镜子练习', description: '观察表情动作' },
            { value: 'audience', label: '观众练习', description: '对他人演讲' },
            { value: 'toastmasters', label: '演讲俱乐部', description: '参加组织' }
          ],
          defaultValue: ['recording']
        },
        {
          id: 'frequency',
          label: '练习频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每天' },
            { value: '3_per_week', label: '每周3次' },
            { value: 'weekly', label: '每周' }
          ],
          defaultValue: '3_per_week'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每日', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || '3_per_week'] || '每周3次';
    return `${freq}演讲能力训练`;
  },
  generateDescription: (config: TemplateConfig) => {
    const freqs: Record<string, string> = {
      'daily': '每天', '3_per_week': '每周3次', 'weekly': '每周'
    };
    const freq = freqs[config.frequency || '3_per_week'] || '每周3次';
    const types = config.practiceType?.length || 1;
    return `${freq}通过${types}种方式练习演讲，提升表达能力和自信心。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次练习后提交演讲视频或录音，记录演讲主题和改进点。';
  }
};

// ============================================
// 高级模板配置
// ============================================

// 间歇性断食配置
export const ADVANCED_INTERMITTENT_FASTING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'HEALTH_DIET',
  sections: [
    {
      id: 'fasting_basics',
      title: '断食设置',
      fields: [
        {
          id: 'fastingMethod',
          label: '断食方法',
          type: 'radio',
          required: true,
          options: [
            { value: '16_8', label: '16:8', description: '16小时断食，8小时进食' },
            { value: '18_6', label: '18:6', description: '18小时断食，6小时进食' },
            { value: '20_4', label: '20:4', description: '20小时断食，4小时进食' },
            { value: '5_2', label: '5:2', description: '每周5天正常，2天轻断食' }
          ],
          defaultValue: '16_8'
        },
        {
          id: 'goals',
          label: '断食目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'weight_loss', label: '减重' },
            { value: 'autophagy', label: '细胞自噬' },
            { value: 'insulin', label: '改善胰岛素敏感性' },
            { value: 'mental_clarity', label: '提升精神清晰度' }
          ],
          defaultValue: ['weight_loss']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const methods: Record<string, string> = {
      '16_8': '16:8', '18_6': '18:6', '20_4': '20:4', '5_2': '5:2'
    };
    const method = methods[config.fastingMethod || '16_8'] || '16:8';
    return `${method}间歇性断食挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const methods: Record<string, string> = {
      '16_8': '16:8方法（16小时断食，8小时进食）',
      '18_6': '18:6方法（18小时断食，6小时进食）',
      '20_4': '20:4方法（20小时断食，4小时进食）',
      '5_2': '5:2方法（每周5天正常，2天轻断食）'
    };
    const method = methods[config.fastingMethod || '16_8'] || '16:8方法';
    const goals = config.goals?.length || 1;
    return `采用${method}进行间歇性断食，实现${goals}个健康目标。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天记录断食时间、进食窗口、体重变化等数据。提交饮食记录和身体感受。';
  }
};

// 睡眠优化配置
export const ADVANCED_SLEEP_OPTIMIZATION_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'HEALTH',
  subcategory: 'HEALTH_SLEEP',
  sections: [
    {
      id: 'sleep_optimization',
      title: '睡眠优化',
      fields: [
        {
          id: 'optimizationAreas',
          label: '优化领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'schedule', label: '作息规律', description: '固定睡眠时间' },
            { value: 'environment', label: '睡眠环境', description: '温度、光线、噪音' },
            { value: 'routine', label: '睡前仪式', description: '放松活动' },
            { value: 'diet', label: '饮食调整', description: '避免咖啡因等' },
            { value: 'exercise', label: '运动时间', description: '合理安排运动' }
          ],
          defaultValue: ['schedule', 'routine']
        },
        {
          id: 'trackingMethod',
          label: '追踪方式',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'wearable', label: '智能手环/手表' },
            { value: 'app', label: '睡眠APP' },
            { value: 'journal', label: '睡眠日记' }
          ],
          defaultValue: ['wearable']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const areas = config.optimizationAreas?.length || 2;
    return `${areas}维度睡眠质量优化`;
  },
  generateDescription: (config: TemplateConfig) => {
    const areas = config.optimizationAreas?.length || 2;
    const tracking = config.trackingMethod?.length || 1;
    return `从${areas}个维度优化睡眠质量，使用${tracking}种方式追踪睡眠数据。科学改善睡眠。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天提交睡眠数据截图，记录睡眠时长、深度睡眠、REM睡眠等指标。';
  }
};

// 马拉松训练配置
export const ADVANCED_MARATHON_TRAINING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'FITNESS',
  subcategory: 'FITNESS_CARDIO',
  sections: [
    {
      id: 'marathon_basics',
      title: '训练设置',
      fields: [
        {
          id: 'targetDistance',
          label: '目标距离',
          type: 'radio',
          required: true,
          options: [
            { value: 'half', label: '半程马拉松', description: '21.0975公里' },
            { value: 'full', label: '全程马拉松', description: '42.195公里' }
          ],
          defaultValue: 'half'
        },
        {
          id: 'weeklyMileage',
          label: '每周里程',
          type: 'select',
          required: true,
          options: [
            { value: '30km', label: '30公里' },
            { value: '50km', label: '50公里' },
            { value: '70km', label: '70公里' },
            { value: '90km', label: '90公里以上' }
          ],
          defaultValue: '50km'
        },
        {
          id: 'trainingTypes',
          label: '训练类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'long_run', label: '长距离慢跑' },
            { value: 'tempo', label: '节奏跑' },
            { value: 'intervals', label: '间歇训练' },
            { value: 'recovery', label: '恢复跑' },
            { value: 'strength', label: '力量训练' }
          ],
          defaultValue: ['long_run', 'tempo', 'recovery']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const distances: Record<string, string> = {
      'half': '半马', 'full': '全马'
    };
    const distance = distances[config.targetDistance || 'half'] || '半马';
    return `${distance}系统训练计划`;
  },
  generateDescription: (config: TemplateConfig) => {
    const distances: Record<string, string> = {
      'half': '半程马拉松', 'full': '全程马拉松'
    };
    const distance = distances[config.targetDistance || 'half'] || '半程马拉松';
    const mileage = config.weeklyMileage || '50km';
    const types = config.trainingTypes?.length || 3;
    return `系统训练备战${distance}，每周跑量${mileage}，包含${types}种训练类型。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每次训练后提交跑步APP截图，记录距离、配速、心率等数据。';
  }
};

// 习惯叠加配置
export const ADVANCED_HABIT_STACKING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'PERSONAL',
  subcategory: 'PERSONAL_GROWTH',
  sections: [
    {
      id: 'habit_stacking',
      title: '习惯叠加',
      fields: [
        {
          id: 'anchorHabit',
          label: '锚定习惯',
          type: 'select',
          required: true,
          options: [
            { value: 'wake_up', label: '起床后' },
            { value: 'breakfast', label: '早餐后' },
            { value: 'commute', label: '通勤时' },
            { value: 'lunch', label: '午餐后' },
            { value: 'before_sleep', label: '睡前' }
          ],
          defaultValue: 'wake_up'
        },
        {
          id: 'newHabits',
          label: '叠加习惯数量',
          type: 'select',
          required: true,
          options: [
            { value: '1', label: '1个新习惯' },
            { value: '2', label: '2个新习惯' },
            { value: '3', label: '3个新习惯' }
          ],
          defaultValue: '2'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const anchors: Record<string, string> = {
      'wake_up': '起床后', 'breakfast': '早餐后', 'commute': '通勤时',
      'lunch': '午餐后', 'before_sleep': '睡前'
    };
    const anchor = anchors[config.anchorHabit || 'wake_up'] || '起床后';
    const count = config.newHabits || '2';
    return `${anchor}${count}习惯叠加`;
  },
  generateDescription: (config: TemplateConfig) => {
    const anchors: Record<string, string> = {
      'wake_up': '起床后', 'breakfast': '早餐后', 'commute': '通勤时',
      'lunch': '午餐后', 'before_sleep': '睡前'
    };
    const anchor = anchors[config.anchorHabit || 'wake_up'] || '起床后';
    const count = config.newHabits || '2';
    return `在${anchor}这个锚定习惯上叠加${count}个新习惯，利用习惯叠加效应养成好习惯。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    return '每天记录习惯完成情况，提交习惯打卡截图或照片。';
  }
};

