import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { KeyResultType } from '../entities/key-result.entity';

export class CreateKeyResultDto {
  @ApiProperty({ example: 'Acquire 1000 new customers' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Focus on targeted marketing campaigns',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: KeyResultType, default: KeyResultType.NUMBER })
  @IsOptional()
  @IsEnum(KeyResultType)
  type?: KeyResultType;

  @ApiPropertyOptional({ example: 0, description: 'Starting value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  startValue?: number;

  @ApiProperty({ example: 1000, description: 'Target value to achieve' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  targetValue: number;

  @ApiPropertyOptional({ example: 0, description: 'Current value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  currentValue?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Weight within the OKR (0-5)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  weight?: number;
}