// 分类配置
export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: SubcategoryConfig[];
}

export interface SubcategoryConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  parentId: string;
}

// 主分类配置
export const MAIN_CATEGORIES: CategoryConfig[] = [
  {
    id: 'HEALTH',
    name: '健康生活',
    icon: '🏥',
    description: '身心健康相关的挑战',
    subcategories: [
      {
        id: 'HEALTH_DIET',
        name: '饮食营养',
        icon: '🥗',
        description: '健康饮食、营养搭配',
        parentId: 'HEALTH'
      },
      {
        id: 'HEALTH_SLEEP',
        name: '睡眠作息',
        icon: '😴',
        description: '早睡早起、作息规律',
        parentId: 'HEALTH'
      },
      {
        id: 'HEALTH_MENTAL',
        name: '心理健康',
        icon: '🧘',
        description: '冥想、正念、情绪管理',
        parentId: 'HEALTH'
      },
      {
        id: 'HEALTH_HABIT',
        name: '生活习惯',
        icon: '🌱',
        description: '日常健康习惯养成',
        parentId: 'HEALTH'
      }
    ]
  },
  {
    id: 'FITNESS',
    name: '健身运动',
    icon: '💪',
    description: '体育锻炼和健身相关',
    subcategories: [
      {
        id: 'FITNESS_CARDIO',
        name: '有氧运动',
        icon: '🏃',
        description: '跑步、游泳、骑行等',
        parentId: 'FITNESS'
      },
      {
        id: 'FITNESS_STRENGTH',
        name: '力量训练',
        icon: '🏋️',
        description: '健身房、器械训练',
        parentId: 'FITNESS'
      },
      {
        id: 'FITNESS_SPORTS',
        name: '球类运动',
        icon: '⚽',
        description: '足球、篮球、网球等',
        parentId: 'FITNESS'
      },
      {
        id: 'FITNESS_YOGA',
        name: '瑜伽普拉提',
        icon: '🧘‍♀️',
        description: '瑜伽、普拉提、拉伸',
        parentId: 'FITNESS'
      }
    ]
  },
  {
    id: 'LEARNING',
    name: '学习成长',
    icon: '📚',
    description: '知识学习和技能提升',
    subcategories: [
      {
        id: 'LEARNING_READING',
        name: '阅读写作',
        icon: '📖',
        description: '读书、写作、笔记',
        parentId: 'LEARNING'
      },
      {
        id: 'LEARNING_LANGUAGE',
        name: '语言学习',
        icon: '🌍',
        description: '外语学习、口语练习',
        parentId: 'LEARNING'
      },
      {
        id: 'LEARNING_SKILL',
        name: '技能培养',
        icon: '🎯',
        description: '编程、设计、乐器等',
        parentId: 'LEARNING'
      },
      {
        id: 'LEARNING_EXAM',
        name: '考试备考',
        icon: '📝',
        description: '各类考试准备',
        parentId: 'LEARNING'
      }
    ]
  },
  {
    id: 'PERSONAL',
    name: '个人发展',
    icon: '🌟',
    description: '个人成长和自我提升',
    subcategories: [
      {
        id: 'PERSONAL_PRODUCTIVITY',
        name: '效率提升',
        icon: '⚡',
        description: '时间管理、工作效率',
        parentId: 'PERSONAL'
      },
      {
        id: 'PERSONAL_CREATIVITY',
        name: '创意表达',
        icon: '🎨',
        description: '绘画、摄影、手工',
        parentId: 'PERSONAL'
      },
      {
        id: 'PERSONAL_SOCIAL',
        name: '社交沟通',
        icon: '🤝',
        description: '人际关系、沟通技巧',
        parentId: 'PERSONAL'
      },
      {
        id: 'PERSONAL_FINANCE',
        name: '理财规划',
        icon: '💰',
        description: '储蓄、投资、理财',
        parentId: 'PERSONAL'
      }
    ]
  },
  {
    id: 'LIFESTYLE',
    name: '生活方式',
    icon: '🏠',
    description: '日常生活和兴趣爱好',
    subcategories: [
      {
        id: 'LIFESTYLE_COOKING',
        name: '烹饪美食',
        icon: '👨‍🍳',
        description: '学做菜、烘焙、美食',
        parentId: 'LIFESTYLE'
      },
      {
        id: 'LIFESTYLE_TRAVEL',
        name: '旅行探索',
        icon: '✈️',
        description: '旅游、户外、探索',
        parentId: 'LIFESTYLE'
      },
      {
        id: 'LIFESTYLE_HOBBY',
        name: '兴趣爱好',
        icon: '🎪',
        description: '收藏、游戏、娱乐',
        parentId: 'LIFESTYLE'
      },
      {
        id: 'LIFESTYLE_HOME',
        name: '居家生活',
        icon: '🏡',
        description: '整理、装饰、园艺',
        parentId: 'LIFESTYLE'
      }
    ]
  },
  {
    id: 'WORK',
    name: '工作事业',
    icon: '💼',
    description: '职业发展和工作相关',
    subcategories: [
      {
        id: 'WORK_STARTUP',
        name: '创业项目',
        icon: '🚀',
        description: '创业、项目开发、商业计划',
        parentId: 'WORK'
      },
      {
        id: 'WORK_CAREER',
        name: '职业发展',
        icon: '📈',
        description: '技能提升、职场成长',
        parentId: 'WORK'
      },
      {
        id: 'WORK_PRODUCTIVITY',
        name: '工作效率',
        icon: '⚡',
        description: '时间管理、工作方法',
        parentId: 'WORK'
      }
    ]
  },
  {
    id: 'SOCIAL',
    name: '社交互动',
    icon: '👥',
    description: '人际关系和社交活动',
    subcategories: [
      {
        id: 'SOCIAL_FRIENDSHIP',
        name: '朋友聚会',
        icon: '🎉',
        description: '朋友聚会、社交活动',
        parentId: 'SOCIAL'
      },
      {
        id: 'SOCIAL_FAMILY',
        name: '家庭关系',
        icon: '👨‍👩‍👧‍👦',
        description: '家庭时光、亲情互动',
        parentId: 'SOCIAL'
      },
      {
        id: 'SOCIAL_COMMUNITY',
        name: '社区参与',
        icon: '🏘️',
        description: '志愿服务、社区活动',
        parentId: 'SOCIAL'
      }
    ]
  },
  {
    id: 'ENTERTAINMENT',
    name: '娱乐休闲',
    icon: '🎮',
    description: '娱乐活动和休闲时光',
    subcategories: [
      {
        id: 'ENTERTAINMENT_MEDIA',
        name: '影视娱乐',
        icon: '🎬',
        description: '电影、电视剧、纪录片',
        parentId: 'ENTERTAINMENT'
      },
      {
        id: 'ENTERTAINMENT_GAMING',
        name: '游戏娱乐',
        icon: '🎮',
        description: '电子游戏、桌游',
        parentId: 'ENTERTAINMENT'
      },
      {
        id: 'ENTERTAINMENT_MUSIC',
        name: '音乐欣赏',
        icon: '🎵',
        description: '音乐发现、演出观看',
        parentId: 'ENTERTAINMENT'
      }
    ]
  }
];

// 获取分类信息的工具函数
export const getCategoryById = (id: string): CategoryConfig | undefined => {
  return MAIN_CATEGORIES.find(cat => cat.id === id);
};

export const getSubcategoryById = (id: string): SubcategoryConfig | undefined => {
  for (const category of MAIN_CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.id === id);
    if (subcategory) return subcategory;
  }
  return undefined;
};

export const getCategoryPath = (templateCategory: string, templateSubcategory?: string, templateTitle?: string) => {
  const category = getCategoryById(templateCategory);
  if (!category) return [];

  // Import translation function dynamically to avoid circular dependency
  const getCategoryNameTranslated = (id: string) => {
    // This will be replaced by the actual translation in the component
    return id;
  };

  const path: Array<{label: string; icon?: string; onClick?: () => void; categoryId?: string; subcategoryId?: string}> = [
    {
      label: category.name,
      icon: category.icon,
      categoryId: category.id,
      onClick: () => window.location.href = `/category/${category.id}`
    }
  ];

  if (templateSubcategory) {
    const subcategory = getSubcategoryById(templateSubcategory);
    if (subcategory) {
      path.push({
        label: subcategory.name,
        icon: subcategory.icon,
        subcategoryId: subcategory.id,
        onClick: () => window.location.href = `/category/${category.id}/${subcategory.id}`
      });
    }
  }

  if (templateTitle) {
    path.push({ label: templateTitle });
  }

  return path;
};
