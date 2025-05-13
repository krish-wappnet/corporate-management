import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKpiCategoryDto {
  @ApiProperty({ example: 'Financial' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Financial performance indicators' })
  @IsOptional()
  @IsString()
  description?: string;
}