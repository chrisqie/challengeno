import { IsString, IsOptional, IsEnum, IsInt, IsDateString, Min, Max, IsDecimal, IsBoolean, IsObject } from 'class-validator';
import { GameCategory, EvidenceType, StakeType, GameVisibility, TeamGameMode } from '@prisma/client';

// 这是备份文件 - 包含原始的 templateConfig 和 customFields 字段
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

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsDateString()
  evidenceDeadline: string;

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

  // 模板配置相关字段
  @IsOptional()
  @IsObject()
  templateConfig?: Record<string, any>;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;

  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
