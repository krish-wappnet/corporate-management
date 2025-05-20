import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OkrStatus, OkrType, OkrFrequency } from '../entities/okr.entity';
import { CreateKeyResultDto } from './create-key-result.dto';

export class CreateOkrDto {
  @ApiProperty({ example: 'Increase market share by 10%' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Focus on expanding to new markets and improving customer retention',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: OkrType, default: OkrType.INDIVIDUAL })
  @IsOptional()
  @IsEnum(OkrType)
  type?: OkrType;

  @ApiPropertyOptional({ enum: OkrFrequency, default: OkrFrequency.QUARTERLY })
  @IsOptional()
  @IsEnum(OkrFrequency)
  frequency?: OkrFrequency;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2023-03-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: OkrStatus, default: OkrStatus.DRAFT })
  @IsOptional()
  @IsEnum(OkrStatus)
  status?: OkrStatus;

  @ApiPropertyOptional({ example: 0, description: 'Progress percentage' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  progress?: number;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Department ID',
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Parent OKR ID',
  })
  @IsOptional()
  @IsUUID()
  parentOkrId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ type: [CreateKeyResultDto], description: 'Key Results' })
  @ValidateNested({ each: true })
  @Type(() => CreateKeyResultDto)
  keyResults: CreateKeyResultDto[];
}