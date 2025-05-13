import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateKpiCategoryDto {
  @ApiPropertyOptional({ example: 'Financial Performance' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description for financial KPIs' })
  @IsOptional()
  @IsString()
  description?: string;
}