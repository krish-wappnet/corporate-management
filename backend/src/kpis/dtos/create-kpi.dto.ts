import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { KpiStatus, KpiType } from '../entities/kpi.entity';
import { MetricDto } from './metric.dto';

export class CreateKpiDto {
  @ApiProperty({ example: 'Increase sales by 20%' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Increase sales through targeted marketing campaigns' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ enum: KpiType, default: KpiType.QUANTITATIVE })
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

  @ApiProperty({ example: 100000, description: 'Target value to achieve' })
  @IsNumber()
  @Type(() => Number)
  targetValue: number;

  @ApiPropertyOptional({ example: 0, description: 'Current value' })
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

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: KpiStatus, default: KpiStatus.DRAFT })
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

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user this KPI is assigned to',
  })
  @IsUUID()
  userId: string;
}