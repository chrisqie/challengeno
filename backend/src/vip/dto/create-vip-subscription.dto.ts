import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VipTier } from '@prisma/client';

export class CreateVipSubscriptionDto {
  @IsEnum(VipTier)
  tier: VipTier;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
