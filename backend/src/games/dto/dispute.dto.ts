import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SubmitDisputeDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class SubmitArbitrationRequestDto {
  @IsString()
  @MaxLength(200)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
