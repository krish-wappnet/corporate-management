import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { KeyResultType } from '../entities/key-result.entity';

export class UpdateKeyResultDto {
  @ApiPropertyOptional({ example: 'Acquire 1500 new customers' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated description for the key result',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: KeyResultType })
  @IsOptional()
  @IsEnum(KeyResultType)
  type?: KeyResultType;

  @ApiPropertyOptional({ example: 100, description: 'Starting value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  startValue?: number;

  @ApiPropertyOptional({ example: 1500, description: 'Target value to achieve' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  targetValue?: number;

  @ApiPropertyOptional({ example: 500, description: 'Current value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  currentValue?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Weight within the OKR (0-5)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({
    example: 33.33,
    description: 'Current progress percentage',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  progress?: number;
}