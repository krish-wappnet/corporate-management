import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKpiUpdateDto {
  @ApiProperty({ example: 75000, description: 'Updated value' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  value: number;

  @ApiPropertyOptional({
    example: 'Exceeded monthly target due to new marketing campaign',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: {
      breakdown: {
        online: 45000,
        inStore: 30000,
      },
    },
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the KPI being updated',
  })
  @IsUUID()
  kpiId: string;
}