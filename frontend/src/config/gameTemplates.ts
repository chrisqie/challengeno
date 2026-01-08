// 类型定义
export interface GameTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  evidenceType: string;
  isAgeRestricted: boolean;
  defaultDurationHours: number;
  maxParticipants: number;
  instructions: string;
  exampleEvidence: string;
  isActive: boolean;
  // VIP功能扩展
  isVipOnly?: boolean;
  vipTier?: 'BASIC' | 'PREMIUM' | 'ELITE' | null;
  uiTheme?: UITheme;
  features?: TemplateFeatures;
  // 后端返回的权限字段
  canUse?: boolean;
  requiresVip?: boolean;
  requiredVipTier?: 'BASIC' | 'PREMIUM' | 'ELITE' | null;
}

export interface UITheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string;
  cardStyle: 'default' | 'premium' | 'zen' | 'team' | 'luxury';
  iconSet: string;
}

export interface TemplateFeatures {
  dataAnalytics?: boolean;
  progressCharts?: boolean;
  socialSharing?: boolean;
  customReminders?: boolean;
  guidedSessions?: boolean;
  progressTracking?: boolean;
  moodAnalysis?: boolean;
  streakRewards?: boolean;
  teamRanking?: boolean;
  collaborativeGoals?: boolean;
  teamChat?: boolean;
  sharedRewards?: boolean;
  customChallenges?: boolean;
  aiCoaching?: boolean;
  personalizedPlan?: boolean;
  expertConsultation?: boolean;
  advancedAnalytics?: boolean;
  prioritySupport?: boolean;
  customBranding?: boolean;
}

// 固化的游戏模板配置 - 作为数据库的备份和默认数据
export const HARDCODED_TEMPLATES: GameTemplate[] = [
  {
    id: 'daily_exercise',
    name: 'daily_exercise',
    title: '每日运动挑战',
    description: '承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯',
    category: 'FITNESS',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 168, // 7天
    maxParticipants: 6,
    instructions: '每天拍摄运动照片或视频作为证据，包括运动类型和时长',
    exampleEvidence: '跑步30分钟的照片，显示运动app记录',
    isActive: true,
  },
  {
    id: 'early_wake_up',
    name: 'early_wake_up',
    title: '早起挑战',
    description: '承诺每天早上6点前起床，培养早睡早起的健康作息习惯，提高一天的工作和学习效率，享受清晨的宁静时光',
    category: 'HEALTH',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 168,
    maxParticipants: 8,
    instructions: '每天早上6点前拍摄起床照片，显示时间',
    exampleEvidence: '显示时间的起床自拍照',
    isActive: true,
  },
  {
    id: 'reading_habit',
    name: 'reading_habit',
    title: '每日阅读',
    description: '承诺每天阅读至少30分钟，培养良好的阅读习惯，通过持续学习提升个人知识储备和思维能力，享受阅读带来的精神财富',
    category: 'LEARNING',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 336, // 14天
    maxParticipants: 10,
    instructions: '每天拍摄阅读照片，包括书籍和阅读时长记录',
    exampleEvidence: '正在阅读的书籍照片，配上阅读笔记',
    isActive: true,
  },
  {
    id: 'water_intake',
    name: 'water_intake',
    title: '每日饮水',
    description: '承诺每天喝足8杯水（约2000毫升），保持身体充足的水分摄入，促进新陈代谢，维护身体健康和皮肤状态',
    category: 'HEALTH',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 168,
    maxParticipants: 12,
    instructions: '每天记录饮水量，拍摄水杯或饮水app截图',
    exampleEvidence: '显示当日饮水量的app截图',
    isActive: true,
  },
  {
    id: 'meditation',
    name: 'meditation',
    title: '冥想练习',
    description: '承诺每天进行15分钟冥想',
    category: 'HEALTH',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 336,
    maxParticipants: 8,
    instructions: '每天拍摄冥想环境或冥想app记录',
    exampleEvidence: '冥想app显示完成15分钟冥想的截图',
    isActive: true,
  },
  {
    id: 'no_social_media',
    name: 'no_social_media',
    title: '戒断社交媒体',
    description: '承诺一周内不使用社交媒体',
    category: 'PERSONAL',
    evidenceType: 'PHOTO',
    isAgeRestricted: true,
    defaultDurationHours: 168,
    maxParticipants: 6,
    instructions: '每天截图手机使用时间，证明未使用社交媒体',
    exampleEvidence: '手机屏幕使用时间截图，显示社交媒体使用时间为0',
    isActive: true,
  },
  {
    id: 'weather_prediction',
    name: 'weather_prediction',
    title: '天气预测挑战',
    description: '预测未来一周的天气情况',
    category: 'WEATHER',
    evidenceType: 'TEXT',
    isAgeRestricted: false,
    defaultDurationHours: 168,
    maxParticipants: 20,
    instructions: '每天提交对次日天气的预测，包括温度和天气状况',
    exampleEvidence: '明天最高温度25°C，多云转晴',
    isActive: true,
  },
  {
    id: 'language_learning',
    name: 'language_learning',
    title: '语言学习打卡',
    description: '承诺每天学习外语30分钟',
    category: 'LEARNING',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 336,
    maxParticipants: 15,
    instructions: '每天拍摄学习进度截图或学习笔记',
    exampleEvidence: '语言学习app显示今日完成30分钟学习的截图',
    isActive: true,
  },
  // VIP专属模板
  {
    id: 'premium_fitness_tracker',
    name: 'premium_fitness_tracker',
    title: '高级健身追踪',
    description: '专业级健身挑战，包含详细数据分析',
    category: 'FITNESS',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 336,
    maxParticipants: 12,
    instructions: '使用专业健身app记录，提交详细的运动数据截图',
    exampleEvidence: '健身app显示心率、卡路里、运动轨迹的综合截图',
    isActive: true,
    isVipOnly: true,
    vipTier: 'BASIC',
    uiTheme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#60A5FA',
      backgroundGradient: 'from-blue-50 to-indigo-100',
      cardStyle: 'premium',
      iconSet: 'fitness-pro'
    },
    features: {
      dataAnalytics: true,
      progressCharts: true,
      socialSharing: true,
      customReminders: true
    }
  },
  {
    id: 'mindfulness_premium',
    name: 'mindfulness_premium',
    title: '冥想正念专业版',
    description: '深度冥想练习，包含引导音频和进度追踪',
    category: 'HEALTH',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 504,
    maxParticipants: 8,
    instructions: '每日完成至少20分钟冥想，提交冥想app记录截图',
    exampleEvidence: '冥想app显示今日完成20分钟冥想的截图',
    isActive: true,
    isVipOnly: true,
    vipTier: 'BASIC',
    uiTheme: {
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      accentColor: '#34D399',
      backgroundGradient: 'from-green-50 to-emerald-100',
      cardStyle: 'zen',
      iconSet: 'mindfulness'
    },
    features: {
      guidedSessions: true,
      progressTracking: true,
      moodAnalysis: true,
      streakRewards: true
    }
  },
  {
    id: 'team_challenge_premium',
    name: 'team_challenge_premium',
    title: '团队挑战赛',
    description: '多人协作挑战，支持团队排行榜和协作功能',
    category: 'FITNESS',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 168,
    maxParticipants: 20,
    instructions: '团队成员协作完成挑战，支持互相监督和鼓励',
    exampleEvidence: '团队运动照片，显示多人参与',
    isActive: true,
    isVipOnly: true,
    vipTier: 'PREMIUM',
    uiTheme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      accentColor: '#A78BFA',
      backgroundGradient: 'from-purple-50 to-violet-100',
      cardStyle: 'team',
      iconSet: 'collaboration'
    },
    features: {
      teamRanking: true,
      collaborativeGoals: true,
      teamChat: true,
      sharedRewards: true,
      customChallenges: true
    }
  },
  {
    id: 'elite_lifestyle_transformation',
    name: 'elite_lifestyle_transformation',
    title: '精英生活方式改造',
    description: '全方位生活方式改造计划，包含AI指导和个性化建议',
    category: 'HEALTH',
    evidenceType: 'PHOTO',
    isAgeRestricted: false,
    defaultDurationHours: 720,
    maxParticipants: 6,
    instructions: '全方位记录生活改变，包括饮食、运动、睡眠、心理状态',
    exampleEvidence: '综合生活数据截图，包含多个维度的改善记录',
    isActive: true,
    isVipOnly: true,
    vipTier: 'ELITE',
    uiTheme: {
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      accentColor: '#FCD34D',
      backgroundGradient: 'from-amber-50 to-yellow-100',
      cardStyle: 'luxury',
      iconSet: 'premium-lifestyle'
    },
    features: {
      aiCoaching: true,
      personalizedPlan: true,
      expertConsultation: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customBranding: true
    }
  }
];

// VIP套餐配置固化
// 注意：name 和 benefits 字段将通过翻译键在前端显示
export const VIP_PLANS = {
  BASIC: {
    nameKey: 'vipPlans.basic.name', // 翻译键
    name: 'Basic Member', // 默认英文名称
    price: 9.9,
    duration: 30,
    benefitKeys: [ // 翻译键数组
      'vipPlans.basic.benefit1',
      'vipPlans.basic.benefit2',
      'vipPlans.basic.benefit3',
      'vipPlans.basic.benefit4',
    ],
    benefits: [ // 默认英文描述
      'Daily game creation limit +5',
      'Daily game participation limit +10',
      'Exclusive member badge',
      'Priority customer support',
    ],
    features: {
      maxDailyGames: 10,
      maxDailyJoins: 25,
      prioritySupport: true,
      memberBadge: true,
    },
  },
  PREMIUM: {
    nameKey: 'vipPlans.premium.name',
    name: 'Premium Member',
    price: 19.9,
    duration: 30,
    benefitKeys: [
      'vipPlans.premium.benefit1',
      'vipPlans.premium.benefit2',
      'vipPlans.premium.benefit3',
      'vipPlans.premium.benefit4',
      'vipPlans.premium.benefit5',
      'vipPlans.premium.benefit6',
    ],
    benefits: [
      'Daily game creation limit +10',
      'Daily game participation limit +20',
      'Exclusive member badge',
      'Priority customer support',
      'Advanced data statistics',
      'Custom game templates',
    ],
    features: {
      maxDailyGames: 15,
      maxDailyJoins: 35,
      prioritySupport: true,
      memberBadge: true,
      advancedStats: true,
      customTemplates: true,
    },
  },
  ELITE: {
    nameKey: 'vipPlans.elite.name',
    name: 'Elite Member',
    price: 39.9,
    duration: 30,
    benefitKeys: [
      'vipPlans.elite.benefit1',
      'vipPlans.elite.benefit2',
      'vipPlans.elite.benefit3',
      'vipPlans.elite.benefit4',
      'vipPlans.elite.benefit5',
      'vipPlans.elite.benefit6',
      'vipPlans.elite.benefit7',
      'vipPlans.elite.benefit8',
    ],
    benefits: [
      'Unlimited game creation',
      'Unlimited game participation',
      'Exclusive member badge',
      'Dedicated customer support',
      'Advanced data statistics',
      'Custom game templates',
      'Private game rooms',
      'Featured game priority',
    ],
    features: {
      maxDailyGames: -1,
      maxDailyJoins: -1,
      prioritySupport: true,
      memberBadge: true,
      advancedStats: true,
      customTemplates: true,
      privateRooms: true,
      featuredGames: true,
    },
  },
};

// 游戏分类配置
export const GAME_CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: 'FITNESS', label: '健身运动' },
  { value: 'HEALTH', label: '健康生活' },
  { value: 'LEARNING', label: '学习成长' },
  { value: 'PERSONAL', label: '个人发展' },
  { value: 'WEATHER', label: '天气预测' },
  { value: 'CUSTOM', label: '自定义' },
];

// 证据类型配置
export const EVIDENCE_TYPES = [
  { value: 'PHOTO', label: '照片证据' },
  { value: 'TEXT', label: '文字描述' },
];
