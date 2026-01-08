import { IsString, IsOptional, IsInt, IsEnum, IsBoolean, Min, Max, MinLength, MaxLength } from 'class-validator';
import { TeamType } from '@prisma/client';

export class CreateTeamDto {
  @IsString()
  @MinLength(2, { message: '团队名称至少2个字符' })
  @MaxLength(50, { message: '团队名称最多50个字符' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '团队描述最多200个字符' })
  description?: string;

  @IsInt()
  @Min(2, { message: '团队最少需要2个成员' })
  @Max(50, { message: '团队最多50个成员' })
  maxMembers: number;

  @IsEnum(TeamType)
  teamType: TeamType;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}

export class JoinTeamDto {
  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsString()
  inviteCode?: string;
}

export class InviteToTeamDto {
  @IsString()
  teamId: string;

  @IsString()
  username: string;
}

export class RespondToInviteDto {
  @IsString()
  inviteId: string;

  @IsBoolean()
  accept: boolean;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '团队名称至少2个字符' })
  @MaxLength(50, { message: '团队名称最多50个字符' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '团队描述最多200个字符' })
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(2, { message: '团队最少需要2个成员' })
  @Max(50, { message: '团队最多50个成员' })
  maxMembers?: number;

  @IsOptional()
  @IsEnum(TeamType)
  teamType?: TeamType;
}

export class KickMemberDto {
  @IsString()
  teamId: string;

  @IsString()
  userId: string;
}

export class TransferLeadershipDto {
  @IsString()
  teamId: string;

  @IsString()
  newLeaderId: string;
}
