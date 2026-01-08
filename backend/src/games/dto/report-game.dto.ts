import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ReportReason } from '@prisma/client';

export class ReportGameDto {
  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsOptional()
  @IsString()
  description?: string;
}

