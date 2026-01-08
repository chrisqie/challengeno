import { IsEnum, IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { FeedbackType } from '@prisma/client';

export class CreateFeedbackDto {
  @IsEnum(FeedbackType)
  @IsNotEmpty()
  type: FeedbackType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  url?: string;
}

