export interface VipFeatures {
  maxDailyGames: number; // -1 表示无限制
  maxDailyJoins: number; // -1 表示无限制
  prioritySupport: boolean;
  memberBadge: boolean;
  advancedStats?: boolean;
  customTemplates?: boolean;
  privateRooms?: boolean;
  featuredGames?: boolean;
}

export interface VipPlan {
  name: string;
  price: number;
  duration: number; // 天数
  benefits: string[];
  features: VipFeatures;
}

export interface VipStatus {
  isVip: boolean;
  tier: string | null;
  expiresAt: Date | null;
  benefits: string[];
  features: VipFeatures;
}

export interface VipUsage {
  isVip: boolean;
  tier?: string;
  expiresAt?: Date;
  usage?: {
    todayGamesCreated: number;
    todayGamesJoined: number;
    maxDailyGames: number | string;
    maxDailyJoins: number | string;
    remainingGames: number | string;
    remainingJoins: number | string;
  };
  features?: VipFeatures;
}
