import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: '消息内容不能超过2000个字符' })
  content: string;

  @IsString()
  @IsOptional()
  type?: string;
}

