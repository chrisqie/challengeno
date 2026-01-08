import { IsString, IsOptional, IsEnum, IsBoolean, ValidateIf } from 'class-validator';
import { EvidenceType } from '@prisma/client';

export class SubmitEvidenceDto {
  @IsEnum(EvidenceType)
  evidenceType: EvidenceType;

  @IsOptional()
  @ValidateIf((o) => o.evidenceContent !== undefined && o.evidenceContent !== null)
  @IsString()
  evidenceContent?: string;

  @IsOptional()
  @ValidateIf((o) => o.evidenceDescription !== undefined && o.evidenceDescription !== null)
  @IsString()
  evidenceDescription?: string;

  @IsBoolean()
  selfReportedSuccess: boolean;
}
