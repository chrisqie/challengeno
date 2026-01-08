import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: '令牌必须是字符串' })
  @IsNotEmpty({ message: '令牌不能为空' })
  token: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(8, { message: '密码至少需要8个字符' })
  newPassword: string;
}

