// 最后的模板配置 - 生活方式类、工作创业类

import { 
  TemplateConfigDefinition, 
  TemplateType, 
  TemplateConfig,
  LifestyleCookingConfig,
  LifestyleOrganizationConfig,
  WorkStartupConfig
} from '../types/templateConfig';

// 烹饪技能提升配置
export const LIFESTYLE_COOKING_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'COOKING',
  sections: [
    {
      id: 'cooking_basics',
      title: '烹饪基础',
      fields: [
        {
          id: 'experience',
          label: '烹饪经验',
          type: 'radio',
          required: true,
          options: [
            { value: 'beginner', label: '初学者', description: '很少下厨，基础技能有限' },
            { value: 'basic', label: '基础水平', description: '会做简单的家常菜' },
            { value: 'intermediate', label: '中级水平', description: '能做多种菜系，有一定技巧' },
            { value: 'advanced', label: '高级水平', description: '烹饪技能娴熟，能创新菜品' }
          ],
          defaultValue: 'basic'
        },
        {
          id: 'cuisineTypes',
          label: '菜系偏好',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'chinese', label: '中式菜系', description: '川菜、粤菜、湘菜等' },
            { value: 'western', label: '西式料理', description: '意大利、法式、美式等' },
            { value: 'asian', label: '亚洲菜系', description: '日式、韩式、泰式等' },
            { value: 'healthy', label: '健康料理', description: '低脂、素食、营养搭配' },
            { value: 'baking', label: '烘焙甜点', description: '面包、蛋糕、饼干等' },
            { value: 'fusion', label: '创意融合', description: '创新搭配和融合菜系' }
          ],
          defaultValue: ['chinese']
        }
      ]
    },
    {
      id: 'cooking_goals',
      title: '学习目标',
      fields: [
        {
          id: 'goals',
          label: '提升目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'basic_skills', label: '基础技能', description: '掌握切菜、调味等基本功' },
            { value: 'recipe_mastery', label: '菜谱掌握', description: '学会更多经典菜品' },
            { value: 'nutrition_balance', label: '营养搭配', description: '学习健康饮食搭配' },
            { value: 'time_efficiency', label: '效率提升', description: '提高烹饪速度和效率' },
            { value: 'creativity', label: '创意发挥', description: '开发个人特色菜品' },
            { value: 'cost_saving', label: '节约成本', description: '学会经济实惠的烹饪' }
          ],
          defaultValue: ['basic_skills']
        },
        {
          id: 'frequency',
          label: '烹饪频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: '每日烹饪' },
            { value: '5_times_week', label: '每周5次' },
            { value: '3_times_week', label: '每周3次' },
            { value: 'weekends', label: '仅周末' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: '3_times_week'
        }
      ]
    },
    {
      id: 'cooking_practice',
      title: '实践安排',
      fields: [
        {
          id: 'mealTypes',
          label: '餐食类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'breakfast', label: '早餐' },
            { value: 'lunch', label: '午餐' },
            { value: 'dinner', label: '晚餐' },
            { value: 'snacks', label: '小食点心' },
            { value: 'beverages', label: '饮品制作' }
          ],
          defaultValue: ['dinner']
        },
        {
          id: 'learningResources',
          label: '学习资源',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'recipe_books', label: '菜谱书籍' },
            { value: 'cooking_videos', label: '烹饪视频' },
            { value: 'cooking_apps', label: '烹饪应用' },
            { value: 'cooking_classes', label: '烹饪课程' },
            { value: 'family_friends', label: '家人朋友指导' },
            { value: 'experimentation', label: '自主实验' }
          ],
          defaultValue: ['cooking_videos']
        },
        {
          id: 'budget',
          label: '预算范围',
          type: 'select',
          required: true,
          options: [
            { value: 'low', label: '经济实惠 (每餐20元以下)' },
            { value: 'medium', label: '中等预算 (每餐20-50元)' },
            { value: 'high', label: '较高预算 (每餐50-100元)' },
            { value: 'unlimited', label: '不限预算' }
          ],
          defaultValue: 'medium'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const cookingConfig = config as LifestyleCookingConfig;
    const mainCuisine = cookingConfig.cuisines?.[0] ? getCuisineTypeLabel(cookingConfig.cuisines[0]) : '多样化';
    const frequency = getFrequencyLabel(cookingConfig.frequency);
    return `${frequency}${mainCuisine}烹饪挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const cookingConfig = config as LifestyleCookingConfig;
    const cuisines = cookingConfig.cuisines?.map((cuisine: string) => getCuisineTypeLabel(cuisine)).join('、') || '多样化菜系';
    const goals = cookingConfig.goals?.map((goal: string) => getCookingGoalLabel(goal)).join('、') || '烹饪技能提升';
    const meals = cookingConfig.dietary?.map((meal: string) => getMealTypeLabel(meal)).join('、') || '各类餐食';
    
    return `通过学习${cuisines}，重点提升${goals}，主要制作${meals}。系统性地提升烹饪技能，享受下厨的乐趣，为自己和家人制作美味健康的食物。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const cookingConfig = config as LifestyleCookingConfig;
    const experience = cookingConfig.experience;
    
    if (experience === 'beginner') {
      return '每次烹饪提交制作过程照片和成品图片，记录学习的技巧和遇到的问题。分享烹饪心得和改进建议。';
    } else {
      return '每次烹饪提交成品照片和制作要点，记录新尝试的菜品和技巧。分享烹饪创新和美食体验。';
    }
  }
};

// 居家整理配置
export const LIFESTYLE_ORGANIZATION_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'LIFESTYLE',
  subcategory: 'HOME',
  sections: [
    {
      id: 'organization_scope',
      title: '整理范围',
      fields: [
        {
          id: 'areas',
          label: '整理区域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'bedroom', label: '卧室', description: '衣柜、床头柜、梳妆台等' },
            { value: 'living_room', label: '客厅', description: '沙发、茶几、电视柜等' },
            { value: 'kitchen', label: '厨房', description: '橱柜、冰箱、餐具等' },
            { value: 'bathroom', label: '卫生间', description: '洗漱用品、毛巾等' },
            { value: 'study_office', label: '书房/办公区', description: '书籍、文件、办公用品' },
            { value: 'storage', label: '储物间', description: '杂物、季节性物品等' }
          ],
          defaultValue: ['bedroom']
        },
        {
          id: 'organizationStyle',
          label: '整理风格',
          type: 'radio',
          required: true,
          options: [
            { value: 'minimalist', label: '极简主义', description: '减少物品，保持简洁' },
            { value: 'functional', label: '功能导向', description: '注重实用性和便利性' },
            { value: 'aesthetic', label: '美观导向', description: '注重视觉效果和美感' },
            { value: 'systematic', label: '系统化', description: '建立完整的收纳体系' }
          ],
          defaultValue: 'functional'
        }
      ]
    },
    {
      id: 'organization_goals',
      title: '整理目标',
      fields: [
        {
          id: 'goals',
          label: '主要目标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'declutter', label: '断舍离', description: '清理不需要的物品' },
            { value: 'space_optimization', label: '空间优化', description: '最大化利用空间' },
            { value: 'easy_maintenance', label: '易于维护', description: '建立容易保持的系统' },
            { value: 'find_efficiency', label: '查找效率', description: '快速找到需要的物品' },
            { value: 'stress_reduction', label: '减少压力', description: '通过整洁环境减压' },
            { value: 'habit_building', label: '习惯养成', description: '培养整理收纳习惯' }
          ],
          defaultValue: ['declutter']
        },
        {
          id: 'timeCommitment',
          label: '时间投入',
          type: 'select',
          required: true,
          options: [
            { value: '15_min_daily', label: '每日15分钟' },
            { value: '30_min_daily', label: '每日30分钟' },
            { value: '1_hour_daily', label: '每日1小时' },
            { value: 'weekend_sessions', label: '周末集中整理' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: '30_min_daily'
        }
      ]
    },
    {
      id: 'organization_method',
      title: '整理方法',
      fields: [
        {
          id: 'methods',
          label: '整理方法',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'konmari', label: 'KonMari方法', description: '按类别整理，保留心动物品' },
            { value: 'zone_system', label: '分区系统', description: '按功能区域划分整理' },
            { value: 'one_in_one_out', label: '一进一出', description: '新物品进入时淘汰旧物品' },
            { value: 'seasonal_rotation', label: '季节轮换', description: '按季节轮换物品摆放' },
            { value: 'label_system', label: '标签系统', description: '使用标签明确物品位置' }
          ],
          defaultValue: ['zone_system']
        },
        {
          id: 'tools',
          label: '整理工具',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'storage_boxes', label: '收纳盒' },
            { value: 'labels', label: '标签贴' },
            { value: 'hangers', label: '衣架整理' },
            { value: 'drawer_dividers', label: '抽屉分隔' },
            { value: 'vacuum_bags', label: '真空压缩袋' },
            { value: 'shelving', label: '置物架' }
          ],
          defaultValue: ['storage_boxes']
        },
        {
          id: 'maintenance',
          label: '维护频率',
          type: 'select',
          required: true,
          options: [
            { value: 'daily_tidy', label: '每日整理' },
            { value: 'weekly_review', label: '每周检查' },
            { value: 'monthly_deep', label: '每月深度整理' },
            { value: 'seasonal_overhaul', label: '季度大整理' }
          ],
          defaultValue: 'weekly_review'
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const orgConfig = config as LifestyleOrganizationConfig;
    const mainArea = orgConfig.areas?.[0] ? getOrganizationAreaLabel(orgConfig.areas[0]) : '居家';
    const style = getOrganizationStyleLabel(orgConfig.methods?.[0] || 'systematic');
    return `${mainArea}${style}整理挑战`;
  },
  generateDescription: (config: TemplateConfig) => {
    const orgConfig = config as LifestyleOrganizationConfig;
    const areas = orgConfig.areas?.map((area: string) => getOrganizationAreaLabel(area)).join('、') || '居家空间';
    const goals = orgConfig.goals?.map((goal: string) => getOrganizationGoalLabel(goal)).join('、') || '空间优化';
    const methods = orgConfig.methods?.map((method: string) => getOrganizationMethodLabel(method)).join('、') || '系统化方法';
    
    return `通过${methods}对${areas}进行整理，实现${goals}的目标。系统性地改善居住环境，提升生活品质和居住舒适度。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const orgConfig = config as LifestyleOrganizationConfig;
    const style = orgConfig.methods?.[0] || 'systematic';
    
    if (style === 'minimalist') {
      return '每次整理提交前后对比照片，记录断舍离的物品和保留的理由。分享极简生活的体验和心得。';
    } else {
      return '每次整理提交整理过程和成果照片，记录使用的方法和工具。分享整理技巧和维护心得。';
    }
  }
};

// 标签映射函数
function getCuisineTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'chinese': '中式菜系',
    'western': '西式料理',
    'asian': '亚洲菜系',
    'healthy': '健康料理',
    'baking': '烘焙甜点',
    'fusion': '创意融合'
  };
  return labels[value] || value;
}

function getCookingGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'basic_skills': '基础技能',
    'recipe_mastery': '菜谱掌握',
    'nutrition_balance': '营养搭配',
    'time_efficiency': '效率提升',
    'creativity': '创意发挥',
    'cost_saving': '节约成本'
  };
  return labels[value] || value;
}

function getMealTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'breakfast': '早餐',
    'lunch': '午餐',
    'dinner': '晚餐',
    'snacks': '小食点心',
    'beverages': '饮品制作'
  };
  return labels[value] || value;
}

function getFrequencyLabel(value: string): string {
  const labels: Record<string, string> = {
    'daily': '每日',
    '5_times_week': '每周5次',
    '3_times_week': '每周3次',
    'weekends': '周末',
    'flexible': '灵活'
  };
  return labels[value] || value;
}

function getOrganizationAreaLabel(value: string): string {
  const labels: Record<string, string> = {
    'bedroom': '卧室',
    'living_room': '客厅',
    'kitchen': '厨房',
    'bathroom': '卫生间',
    'study_office': '书房',
    'storage': '储物间'
  };
  return labels[value] || value;
}

function getOrganizationStyleLabel(value: string): string {
  const labels: Record<string, string> = {
    'minimalist': '极简',
    'functional': '功能性',
    'aesthetic': '美观',
    'systematic': '系统化'
  };
  return labels[value] || value;
}

function getOrganizationGoalLabel(value: string): string {
  const labels: Record<string, string> = {
    'declutter': '断舍离',
    'space_optimization': '空间优化',
    'easy_maintenance': '易于维护',
    'find_efficiency': '查找效率',
    'stress_reduction': '减少压力',
    'habit_building': '习惯养成'
  };
  return labels[value] || value;
}

function getOrganizationMethodLabel(value: string): string {
  const labels: Record<string, string> = {
    'konmari': 'KonMari方法',
    'zone_system': '分区系统',
    'one_in_one_out': '一进一出',
    'seasonal_rotation': '季节轮换',
    'label_system': '标签系统'
  };
  return labels[value] || value;
}

// 创业项目日进展配置
export const WORK_STARTUP_CONFIG: TemplateConfigDefinition = {
  templateType: TemplateType.CUSTOM,
  category: 'WORK',
  subcategory: 'STARTUP',
  sections: [
    {
      id: 'startup_basics',
      title: '项目基础',
      fields: [
        {
          id: 'stage',
          label: '项目阶段',
          type: 'radio',
          required: true,
          options: [
            { value: 'idea', label: '想法阶段', description: '还在构思和验证想法' },
            { value: 'planning', label: '规划阶段', description: '制定商业计划和策略' },
            { value: 'mvp', label: 'MVP开发', description: '开发最小可行产品' },
            { value: 'launch', label: '产品发布', description: '产品上线和市场推广' },
            { value: 'growth', label: '增长阶段', description: '扩大用户和优化产品' },
            { value: 'scaling', label: '规模化', description: '团队扩张和业务拓展' }
          ],
          defaultValue: 'planning'
        },
        {
          id: 'industry',
          label: '行业领域',
          type: 'select',
          required: true,
          options: [
            { value: 'tech', label: '科技互联网' },
            { value: 'ecommerce', label: '电商零售' },
            { value: 'education', label: '教育培训' },
            { value: 'health', label: '健康医疗' },
            { value: 'finance', label: '金融科技' },
            { value: 'entertainment', label: '娱乐媒体' },
            { value: 'service', label: '服务行业' },
            { value: 'manufacturing', label: '制造业' },
            { value: 'other', label: '其他行业' }
          ],
          defaultValue: 'tech'
        }
      ]
    },
    {
      id: 'startup_focus',
      title: '关注重点',
      fields: [
        {
          id: 'focus',
          label: '重点领域',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'product_development', label: '产品开发', description: '功能设计和技术实现' },
            { value: 'market_research', label: '市场调研', description: '用户需求和竞争分析' },
            { value: 'user_acquisition', label: '用户获取', description: '营销推广和用户增长' },
            { value: 'business_model', label: '商业模式', description: '盈利模式和商业策略' },
            { value: 'team_building', label: '团队建设', description: '人才招聘和团队管理' },
            { value: 'funding', label: '融资筹备', description: '投资人对接和资金筹集' }
          ],
          defaultValue: ['product_development']
        },
        {
          id: 'goals',
          label: '每日目标类型',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'feature_development', label: '功能开发' },
            { value: 'user_feedback', label: '用户反馈收集' },
            { value: 'market_analysis', label: '市场分析' },
            { value: 'networking', label: '人脉拓展' },
            { value: 'learning', label: '学习提升' },
            { value: 'planning', label: '战略规划' }
          ],
          defaultValue: ['feature_development']
        }
      ]
    },
    {
      id: 'startup_tracking',
      title: '进展追踪',
      fields: [
        {
          id: 'metrics',
          label: '关键指标',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'user_count', label: '用户数量' },
            { value: 'revenue', label: '收入情况' },
            { value: 'product_features', label: '产品功能完成度' },
            { value: 'market_feedback', label: '市场反馈' },
            { value: 'team_progress', label: '团队进展' },
            { value: 'partnership', label: '合作伙伴关系' }
          ],
          defaultValue: ['user_count']
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
        },
        {
          id: 'timeCommitment',
          label: '每日投入时间',
          type: 'select',
          required: true,
          options: [
            { value: '1_hour', label: '1小时' },
            { value: '2_hours', label: '2小时' },
            { value: '4_hours', label: '4小时' },
            { value: '6_hours', label: '6小时' },
            { value: '8_hours', label: '8小时（全职）' },
            { value: 'flexible', label: '灵活安排' }
          ],
          defaultValue: '2_hours'
        },
        {
          id: 'challenges',
          label: '主要挑战',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'time_management', label: '时间管理' },
            { value: 'resource_limitation', label: '资源限制' },
            { value: 'market_uncertainty', label: '市场不确定性' },
            { value: 'technical_difficulties', label: '技术难题' },
            { value: 'team_coordination', label: '团队协调' },
            { value: 'motivation', label: '保持动力' }
          ],
          defaultValue: ['time_management']
        }
      ]
    }
  ],
  generateTitle: (config: TemplateConfig) => {
    const startupConfig = config as WorkStartupConfig;
    const industry = getIndustryLabel(startupConfig.industry || 'tech');
    const stage = getProjectStageLabel(startupConfig.stage);
    return `${industry}${stage}创业日志`;
  },
  generateDescription: (config: TemplateConfig) => {
    const startupConfig = config as WorkStartupConfig;
    const industry = getIndustryLabel(startupConfig.industry || 'tech');
    const stage = getProjectStageLabel(startupConfig.stage);
    const areas = startupConfig.focus?.map((area: string) => getStartupFocusLabel(area)).join('、') || '全面发展';
    const timeCommitment = getTimeCommitmentLabel(startupConfig.timeCommitment);

    return `${industry}领域的${stage}创业项目，重点关注${areas}。每日投入${timeCommitment}，系统性地推进项目发展，记录创业历程中的挑战、收获和成长。`;
  },
  generateInstructions: (config: TemplateConfig) => {
    const startupConfig = config as WorkStartupConfig;
    const stage = startupConfig.stage;

    if (stage === 'idea' || stage === 'planning') {
      return '每日记录项目思考和规划进展，提交想法整理、市场调研或商业计划的相关内容。分享创业思路和决策过程。';
    } else if (stage === 'mvp' || stage === 'launch') {
      return '每日记录产品开发和发布进展，提交功能截图、用户反馈或推广活动记录。分享产品迭代和市场反应。';
    } else {
      return '每日记录业务发展和团队进展，提交关键指标数据、重要决策或里程碑成果。分享创业经验和管理心得。';
    }
  }
};

// 创业相关标签映射
function getProjectStageLabel(value: string): string {
  const labels: Record<string, string> = {
    'idea': '想法阶段',
    'planning': '规划阶段',
    'mvp': 'MVP开发',
    'launch': '产品发布',
    'growth': '增长阶段',
    'scaling': '规模化'
  };
  return labels[value] || value;
}

function getIndustryLabel(value: string): string {
  const labels: Record<string, string> = {
    'tech': '科技互联网',
    'ecommerce': '电商零售',
    'education': '教育培训',
    'health': '健康医疗',
    'finance': '金融科技',
    'entertainment': '娱乐媒体',
    'service': '服务行业',
    'manufacturing': '制造业',
    'other': '其他行业'
  };
  return labels[value] || value;
}

function getStartupFocusLabel(value: string): string {
  const labels: Record<string, string> = {
    'product_development': '产品开发',
    'market_research': '市场调研',
    'user_acquisition': '用户获取',
    'business_model': '商业模式',
    'team_building': '团队建设',
    'funding': '融资筹备'
  };
  return labels[value] || value;
}

function getTimeCommitmentLabel(value: string): string {
  const labels: Record<string, string> = {
    '1_hour': '1小时',
    '2_hours': '2小时',
    '4_hours': '4小时',
    '6_hours': '6小时',
    '8_hours': '全职投入',
    'flexible': '灵活时间'
  };
  return labels[value] || value;
}
