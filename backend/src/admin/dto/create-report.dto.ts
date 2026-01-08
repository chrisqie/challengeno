import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ReportTargetType, ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  @IsString()
  targetId: string;

  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsOptional()
  @IsString()
  description?: string;
}
