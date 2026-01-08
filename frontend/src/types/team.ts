export interface Team {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
  };
  members: TeamMember[];
  maxMembers: number;
  isPrivate: boolean;
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    isVip?: boolean;
  };
  role: TeamRole;
  joinedAt: string;
}

export enum TeamRole {
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  maxMembers: number;
  isPrivate: boolean;
}

export interface JoinTeamDto {
  inviteCode: string;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  team: {
    id: string;
    name: string;
    creator: {
      username: string;
    };
  };
  inviterId: string;
  inviter: {
    username: string;
  };
  inviteeId: string;
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
}

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}
