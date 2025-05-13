import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { KpiStatus, KpiType } from '../entities/kpi.entity';
import { MetricDto } from './metric.dto';

export class UpdateKpiDto {
  @ApiPropertyOptional({ example: 'Increase sales by 20%' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Increase sales through targeted marketing campaigns' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: KpiType })
  @IsOptional()
  @IsEnum(KpiType)
  type?: KpiType;

  @ApiPropertyOptional({
    type: [MetricDto],
    example: [
      {
        name: 'Monthly Revenue',
        target: 100000,
        unit: 'USD'
      },
      {
        name: 'New Customers',
        target: 50,
        unit: 'customers'
      }
    ],
    description: 'Array of metrics for this KPI',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricDto)
  metrics?: MetricDto[];

  @ApiPropertyOptional({ example: 100000, description: 'Target value to achieve' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  targetValue?: number;

  @ApiPropertyOptional({ example: 50000, description: 'Current value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  currentValue?: number;

  @ApiPropertyOptional({
    example: 1.5,
    description: 'Weight of this KPI (importance factor)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: KpiStatus })
  @IsOptional()
  @IsEnum(KpiStatus)
  status?: KpiStatus;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the KPI category',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user this KPI is assigned to',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}