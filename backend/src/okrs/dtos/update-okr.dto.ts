import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OkrStatus, OkrType, OkrFrequency } from '../entities/okr.entity';

export class UpdateOkrDto {
  @ApiPropertyOptional({ example: 'Increase market share by 15%' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated description for the objective',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: OkrType })
  @IsOptional()
  @IsEnum(OkrType)
  type?: OkrType;

  @ApiPropertyOptional({ enum: OkrFrequency })
  @IsOptional()
  @IsEnum(OkrFrequency)
  frequency?: OkrFrequency;

  @ApiPropertyOptional({ example: '2023-02-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-04-30' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: OkrStatus })
  @IsOptional()
  @IsEnum(OkrStatus)
  status?: OkrStatus;

  @ApiPropertyOptional({ example: 25, description: 'Progress percentage' })
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
}