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
  evidenceConfig?: any;
  customizable?: boolean;
  parametric?: boolean;
}

export interface GameTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  difficultyLevel?: string;
  riskLevel?: string;
  isQuickStart?: boolean;
  isVipOnly?: boolean;
  vipTier?: 'BASIC' | 'PREMIUM' | 'ELITE' | null;
  canUse?: boolean;
  requiresVip?: boolean;
  requiredVipTier?: 'BASIC' | 'PREMIUM' | 'ELITE' | null;
  templateOptions?: any;
  uiTheme?: UITheme;
  features?: TemplateFeatures;
  defaultDurationHours: number;
  maxParticipants: number;
  evidenceType: string;
  instructions: string;
  exampleEvidence?: string;
  isAgeRestricted?: boolean;
  isActive?: boolean;
  usageCount?: number;
  successRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameCreationData {
  templateId: string;
  title: string;
  description: string;
  additionalNotes?: string;
  startDate: string;
  endDate: string;
  evidenceDeadline: string;
  maxParticipants: number;
  visibility: 'PUBLIC' | 'FRIENDS_ONLY';
}
