import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum EvaluationResult {
  RECOGNIZE = 'RECOGNIZE',
  NOT_RECOGNIZE = 'NOT_RECOGNIZE'
}

export class PeerEvaluationDto {
  @IsString()
  @IsNotEmpty()
  evaluatedUserId: string;

  @IsEnum(EvaluationResult)
  evaluation: EvaluationResult;

  @IsOptional()
  @IsString()
  reasoning?: string;
}
