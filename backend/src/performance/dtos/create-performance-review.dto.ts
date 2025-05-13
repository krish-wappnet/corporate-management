import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
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

export class CreatePerformanceReviewDto {
  @ApiProperty({ example: 'Q1 2023 Performance Review' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Quarterly performance review for Q1 2023',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ReviewType, default: ReviewType.QUARTERLY })
  @IsOptional()
  @IsEnum(ReviewType)
  type?: ReviewType;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ example: '2023-03-31' })
  @IsDateString()
  periodEnd: string;

  @ApiPropertyOptional({ example: '2023-04-15' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: ReviewStatus, default: ReviewStatus.DRAFT })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({
    example: {
      communication: 4,
      teamwork: 5,
      technical: 4,
      leadership: 3,
    },
    description: 'Rating scores for different categories',
  })
  @IsOptional()
  @IsObject()
  ratings?: Record<string, number>;

  @ApiPropertyOptional({
    example: 4.2,
    description: 'Overall performance rating',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  overallRating?: number;

  @ApiPropertyOptional({
    example: 'Successfully led the team to complete Project X ahead of schedule',
  })
  @IsOptional()
  @IsString()
  achievements?: string;

  @ApiPropertyOptional({
    example: 'Could improve on documentation and time management',
  })
  @IsOptional()
  @IsString()
  areasForImprovement?: string;

  @ApiPropertyOptional({
    example: 'Complete certification and improve team collaboration',
  })
  @IsOptional()
  @IsString()
  goalsForNextPeriod?: string;

  @ApiPropertyOptional({
    example: 'Additional notes about performance',
  })
  @IsOptional()
  @IsString()
  additionalComments?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the employee being reviewed',
  })
  @IsUUID()
  employeeId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the reviewer',
  })
  @IsUUID()
  reviewerId: string;
}