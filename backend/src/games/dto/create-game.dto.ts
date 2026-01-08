import { IsString, IsOptional, IsEnum, IsInt, IsDateString, Min, Max, IsDecimal, IsBoolean, IsObject } from 'class-validator';
import { GameCategory, EvidenceType, StakeType, GameVisibility, TeamGameMode, LocationRestriction } from '@prisma/client';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsEnum(StakeType)
  stakeType: StakeType;

  @IsOptional()
  @IsDecimal()
  betAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  stakeDescription?: string;

  @IsEnum(EvidenceType)
  evidenceType: EvidenceType;

  @IsString()
  evidenceInstructions: string;

  @IsInt()
  @Min(2)
  @Max(20)
  maxParticipants: number;

  @IsOptional()
  @IsDateString()
  joinDeadline?: string;       // 加入截止时间（游戏开始时间，可选，系统自动计算）

  @IsDateString()
  startDate: string;           // 游戏进行开始时间

  @IsDateString()
  endDate: string;             // 游戏结束时间

  @IsDateString()
  evidenceDeadline: string;    // 证据提交截止时间

  @IsOptional()
  @IsDateString()
  reviewDeadline?: string;     // 互评截止时间（可选，系统自动计算）

  @IsOptional()
  @IsDateString()
  arbitrationDeadline?: string; // 仲裁截止时间（可选，系统自动计算）

  @IsEnum(GameCategory)
  category: GameCategory;

  @IsOptional()
  @IsEnum(GameVisibility)
  visibility?: GameVisibility;

  // 团队游戏相关字段
  @IsOptional()
  @IsBoolean()
  isTeamGame?: boolean;

  @IsOptional()
  @IsEnum(TeamGameMode)
  teamMode?: TeamGameMode;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(10)
  maxTeams?: number;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(20)
  minTeamSize?: number;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(50)
  maxTeamSize?: number;

  // 注意：移除了 templateConfig 和 customFields 字段
  // 因为数据库schema中没有这些字段
  // 这些字段会在 games.service.ts 中被过滤掉

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  // 模板配置相关字段
  @IsOptional()
  @IsObject()
  templateConfig?: Record<string, any>;

  @IsOptional()
  @IsObject()
  dynamicConfig?: Record<string, any>;

  // 地理位置相关字段
  @IsOptional()
  @IsEnum(LocationRestriction)
  locationRestriction?: LocationRestriction;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(500)
  maxDistance?: number;

  @IsOptional()
  @IsString()
  customLocation?: string;
}
