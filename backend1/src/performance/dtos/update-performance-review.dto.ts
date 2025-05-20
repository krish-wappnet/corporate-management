import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewStatus, ReviewType } from '../entities/performance-review.entity';

export class UpdatePerformanceReviewDto {
  @ApiPropertyOptional({ example: 'Updated Q1 2023 Performance Review' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated description for the quarterly review',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ReviewType })
  @IsOptional()
  @IsEnum(ReviewType)
  type?: ReviewType;

  @ApiPropertyOptional({ example: '2023-01-15' })
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiPropertyOptional({ example: '2023-04-15' })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @ApiPropertyOptional({ example: '2023-04-30' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: ReviewStatus })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({
    example: {
      communication: 5,
      teamwork: 5,
      technical: 4,
      leadership: 4,
    },
    description: 'Rating scores for different categories',
  })
  @IsOptional()
  @IsObject()
  ratings?: Record<string, number>;

  @ApiPropertyOptional({
    example: 4.5,
    description: 'Overall performance rating',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  overallRating?: number;

  @ApiPropertyOptional({
    example: 'Updated achievements description',
  })
  @IsOptional()
  @IsString()
  achievements?: string;

  @ApiPropertyOptional({
    example: 'Updated areas for improvement',
  })
  @IsOptional()
  @IsString()
  areasForImprovement?: string;

  @ApiPropertyOptional({
    example: 'Updated goals for the next period',
  })
  @IsOptional()
  @IsString()
  goalsForNextPeriod?: string;

  @ApiPropertyOptional({
    example: 'Updated additional comments',
  })
  @IsOptional()
  @IsString()
  additionalComments?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the employee being reviewed',
  })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the reviewer',
  })
  @IsOptional()
  @IsUUID()
  reviewerId?: string;
}