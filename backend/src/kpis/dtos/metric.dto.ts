import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MetricDto {
  @ApiProperty({ example: 'Monthly Revenue', description: 'Name of the metric' })
  @IsString()
  name: string;

  @ApiProperty({ example: 100000, description: 'Target value for the metric' })
  @IsNumber()
  target: number;

  @ApiPropertyOptional({ example: 'USD', description: 'Unit of measurement (optional)' })
  @IsString()
  @IsOptional()
  unit?: string;
}
