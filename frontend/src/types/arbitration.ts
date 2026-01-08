export interface ArbitrationRequest {
  id: string;
  gameId: string;
  game: {
    id: string;
    title: string;
    description: string;
    creator: {
      username: string;
    };
  };
  requesterId: string;
  requester: {
    id: string;
    username: string;
    fullName: string;
  };
  respondentId: string;
  respondent: {
    id: string;
    username: string;
    fullName: string;
  };
  disputeType: DisputeType;
  description: string;
  evidence?: ArbitrationEvidence[];
  status: ArbitrationStatus;
  adminId?: string;
  admin?: {
    id: string;
    username: string;
  };
  adminDecision?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export enum DisputeType {
  EVIDENCE_DISPUTE = 'EVIDENCE_DISPUTE',     // 证据争议
  RULE_VIOLATION = 'RULE_VIOLATION',         // 规则违反
  UNFAIR_EVALUATION = 'UNFAIR_EVALUATION',   // 不公平评价
  HARASSMENT = 'HARASSMENT',                 // 骚扰行为
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',       // 技术问题
  GAME_RESULT_DISPUTE = 'GAME_RESULT_DISPUTE', // 游戏结果争议
  OTHER = 'OTHER',                           // 其他
}

export enum ArbitrationStatus {
  PENDING = 'PENDING',               // 待处理
  UNDER_REVIEW = 'UNDER_REVIEW',     // 审核中
  INVESTIGATING = 'INVESTIGATING',   // 调查中
  WAITING_EVIDENCE = 'WAITING_EVIDENCE', // 等待证据
  RESOLVED = 'RESOLVED',             // 已解决
  REJECTED = 'REJECTED',             // 已拒绝
  CANCELLED = 'CANCELLED',           // 已取消
  ESCALATED = 'ESCALATED',           // 已升级
}

export interface ArbitrationEvidence {
  id: string;
  arbitrationId: string;
  uploaderId: string;
  uploader: {
    username: string;
  };
  type: EvidenceType;
  url: string;
  description?: string;
  createdAt: string;
}

export enum EvidenceType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  SCREENSHOT = 'SCREENSHOT',
}

export interface CreateArbitrationDto {
  gameId: string;
  respondentId: string;
  disputeType: DisputeType;
  description: string;
}

export interface ArbitrationResponse {
  requestId: string;
  response: string;
  evidence?: File[];
}

// 争议类型的中文映射
export const DISPUTE_TYPE_LABELS: Record<DisputeType, string> = {
  [DisputeType.EVIDENCE_DISPUTE]: '证据争议',
  [DisputeType.RULE_VIOLATION]: '规则违反',
  [DisputeType.UNFAIR_EVALUATION]: '不公平评价',
  [DisputeType.HARASSMENT]: '骚扰行为',
  [DisputeType.TECHNICAL_ISSUE]: '技术问题',
  [DisputeType.GAME_RESULT_DISPUTE]: '游戏结果争议',
  [DisputeType.OTHER]: '其他',
};

// 争议状态的中文映射
export const DISPUTE_STATUS_LABELS: Record<ArbitrationStatus, string> = {
  [ArbitrationStatus.PENDING]: '待处理',
  [ArbitrationStatus.UNDER_REVIEW]: '审核中',
  [ArbitrationStatus.INVESTIGATING]: '调查中',
  [ArbitrationStatus.WAITING_EVIDENCE]: '等待证据',
  [ArbitrationStatus.RESOLVED]: '已解决',
  [ArbitrationStatus.REJECTED]: '已拒绝',
  [ArbitrationStatus.CANCELLED]: '已取消',
  [ArbitrationStatus.ESCALATED]: '已升级',
};

// 仲裁状态的中文映射
export const ARBITRATION_STATUS_LABELS: Record<ArbitrationStatus, string> = {
  [ArbitrationStatus.PENDING]: '待处理',
  [ArbitrationStatus.UNDER_REVIEW]: '审核中',
  [ArbitrationStatus.INVESTIGATING]: '调查中',
  [ArbitrationStatus.WAITING_EVIDENCE]: '等待证据',
  [ArbitrationStatus.RESOLVED]: '已解决',
  [ArbitrationStatus.REJECTED]: '已拒绝',
  [ArbitrationStatus.CANCELLED]: '已取消',
  [ArbitrationStatus.ESCALATED]: '已升级',
};

// 状态颜色映射
export const ARBITRATION_STATUS_COLORS: Record<ArbitrationStatus, string> = {
  [ArbitrationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ArbitrationStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-800',
  [ArbitrationStatus.INVESTIGATING]: 'bg-purple-100 text-purple-800',
  [ArbitrationStatus.WAITING_EVIDENCE]: 'bg-orange-100 text-orange-800',
  [ArbitrationStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [ArbitrationStatus.REJECTED]: 'bg-red-100 text-red-800',
  [ArbitrationStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
  [ArbitrationStatus.ESCALATED]: 'bg-pink-100 text-pink-800',
};
