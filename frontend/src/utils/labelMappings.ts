// 标签映射工具函数

// 效率提升相关
export function getProductivityAreaLabel(value: string): string {
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

export function getProductivityMethodLabel(value: string): string {
  const labels: Record<string, string> = {
    'pomodoro': '番茄工作法',
    'gtd': 'GTD',
    'time_blocking': '时间块',
    'eisenhower': '四象限',
    'deep_work': '深度工作'
  };
  return labels[value] || value;
}

export function getProductivityGoalLabel(value: string): string {
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

export function getMeasurementLabel(value: string): string {
  const labels: Record<string, string> = {
    'task_completion': '任务完成率',
    'time_tracking': '时间记录',
    'focus_sessions': '专注时段',
    'energy_levels': '精力状态'
  };
  return labels[value] || value;
}

export function getToolLabel(value: string): string {
  const labels: Record<string, string> = {
    'digital_calendar': '数字日历',
    'task_apps': '任务管理应用',
    'note_taking': '笔记工具',
    'time_tracker': '时间追踪器',
    'paper_planner': '纸质规划本',
    'habit_tracker': '习惯追踪器'
  };
  return labels[value] || value;
}

export function getReviewFrequencyLabel(value: string): string {
  const labels: Record<string, string> = {
    'daily': '每日回顾',
    'weekly': '每周回顾',
    'bi_weekly': '双周回顾',
    'monthly': '每月回顾'
  };
  return labels[value] || value;
}

// 创意表达相关
export function getCreativeFieldLabel(value: string): string {
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

export function getCreativeExperienceLabel(value: string): string {
  const labels: Record<string, string> = {
    'beginner': '初学者',
    'hobbyist': '业余爱好者',
    'semi_professional': '半专业',
    'professional': '专业创作者'
  };
  return labels[value] || value;
}

export function getCreativityGoalLabel(value: string): string {
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

export function getSharingLabel(value: string): string {
  const labels: Record<string, string> = {
    'private': '私人记录',
    'friends': '朋友分享',
    'community': '社区发布',
    'public': '公开展示'
  };
  return labels[value] || value;
}

// 感恩日记相关
export function getGratitudeFocusLabel(value: string): string {
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

export function getDepthLabel(value: string): string {
  const labels: Record<string, string> = {
    'simple': '简单记录',
    'detailed': '详细描述',
    'reflective': '反思性记录'
  };
  return labels[value] || value;
}

export function getGratitudeFormatLabel(value: string): string {
  const labels: Record<string, string> = {
    'written_journal': '文字日记',
    'voice_memo': '语音记录',
    'photo_diary': '图片日记',
    'video_log': '视频记录',
    'art_expression': '艺术表达'
  };
  return labels[value] || value;
}

export function getGratitudeTimeLabel(value: string): string {
  const labels: Record<string, string> = {
    'morning': '晨间记录',
    'evening': '睡前记录',
    'lunch': '午间记录',
    'flexible': '灵活时间'
  };
  return labels[value] || value;
}

export function getItemCountLabel(value: string): string {
  const labels: Record<string, string> = {
    '3_items': '3件事',
    '5_items': '5件事',
    '7_items': '7件事',
    '10_items': '10件事',
    'unlimited': '不限数量'
  };
  return labels[value] || value;
}

export function getGratitudeGoalLabel(value: string): string {
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

// 烹饪相关
export function getCookingExperienceLabel(value: string): string {
  const labels: Record<string, string> = {
    'beginner': '初学者',
    'basic': '基础水平',
    'intermediate': '中级水平',
    'advanced': '高级水平'
  };
  return labels[value] || value;
}

export function getCuisineTypeLabel(value: string): string {
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

export function getCookingGoalLabel(value: string): string {
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

export function getMealTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    'breakfast': '早餐',
    'lunch': '午餐',
    'dinner': '晚餐',
    'snacks': '小食点心',
    'beverages': '饮品制作'
  };
  return labels[value] || value;
}

export function getBudgetLabel(value: string): string {
  const labels: Record<string, string> = {
    'low': '经济实惠',
    'medium': '中等预算',
    'high': '较高预算',
    'unlimited': '不限预算'
  };
  return labels[value] || value;
}

// 居家整理相关
export function getOrganizationAreaLabel(value: string): string {
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

export function getOrganizationStyleLabel(value: string): string {
  const labels: Record<string, string> = {
    'minimalist': '极简主义',
    'functional': '功能导向',
    'aesthetic': '美观导向',
    'systematic': '系统化'
  };
  return labels[value] || value;
}

export function getOrganizationGoalLabel(value: string): string {
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

export function getTimeCommitmentLabel(value: string): string {
  const labels: Record<string, string> = {
    '15_min_daily': '每日15分钟',
    '30_min_daily': '每日30分钟',
    '1_hour_daily': '每日1小时',
    'weekend_sessions': '周末集中整理',
    'flexible': '灵活安排'
  };
  return labels[value] || value;
}

export function getOrganizationMethodLabel(value: string): string {
  const labels: Record<string, string> = {
    'konmari': 'KonMari方法',
    'zone_system': '分区系统',
    'one_in_one_out': '一进一出',
    'seasonal_rotation': '季节轮换',
    'label_system': '标签系统'
  };
  return labels[value] || value;
}

export function getMaintenanceLabel(value: string): string {
  const labels: Record<string, string> = {
    'daily_tidy': '每日整理',
    'weekly_review': '每周检查',
    'monthly_deep': '每月深度整理',
    'seasonal_overhaul': '季度大整理'
  };
  return labels[value] || value;
}

// 创业相关
export function getProjectStageLabel(value: string): string {
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

export function getIndustryLabel(value: string): string {
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

export function getStartupFocusLabel(value: string): string {
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

export function getStartupTimeCommitmentLabel(value: string): string {
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

export function getMetricLabel(value: string): string {
  const labels: Record<string, string> = {
    'user_count': '用户数量',
    'revenue': '收入情况',
    'product_features': '产品功能完成度',
    'market_feedback': '市场反馈',
    'team_progress': '团队进展',
    'partnership': '合作伙伴关系'
  };
  return labels[value] || value;
}

export function getChallengeLabel(value: string): string {
  const labels: Record<string, string> = {
    'time_management': '时间管理',
    'resource_limitation': '资源限制',
    'market_uncertainty': '市场不确定性',
    'technical_difficulties': '技术难题',
    'team_coordination': '团队协调',
    'motivation': '保持动力'
  };
  return labels[value] || value;
}

// 通用标签
export function getFrequencyLabel(value: string): string {
  const labels: Record<string, string> = {
    'daily': '每日',
    '5_times_week': '每周5次',
    '3_times_week': '每周3次',
    '2_times_week': '每周2次',
    'once_week': '每周1次',
    'weekly': '每周',
    'weekends': '周末',
    'flexible': '灵活安排'
  };
  return labels[value] || value;
}

export function getDurationLabel(value: string): string {
  const labels: Record<string, string> = {
    '15_min': '15分钟',
    '30_min': '30分钟',
    '45_min': '45分钟',
    '60_min': '1小时',
    '90_min': '1.5小时',
    '120_min': '2小时',
    'flexible': '灵活时长'
  };
  return labels[value] || value;
}
