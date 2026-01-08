import { IsEmail, IsString, MinLength, MaxLength, IsDateString, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  fullName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  referralCode?: string; // 推荐码（可选）
}
