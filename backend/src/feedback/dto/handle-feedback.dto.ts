import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FeedbackStatus } from '@prisma/client';

export class HandleFeedbackDto {
  @IsEnum(FeedbackStatus)
  @IsNotEmpty()
  status: FeedbackStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}

