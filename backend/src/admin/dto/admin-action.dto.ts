import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator';
import { AdminActionType } from '@prisma/client';

export class AdminActionDto {
  @IsEnum(AdminActionType)
  action: AdminActionType;

  @IsString()
  targetType: string;

  @IsString()
  targetId: string;

  @IsOptional()
  @IsObject()
  details?: any;

  @IsOptional()
  @IsString()
  reason?: string;
}
