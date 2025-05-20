import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CycleStatus, CycleType } from '../entities/feedback-cycle.entity';

export class UpdateFeedbackCycleDto {
  @ApiPropertyOptional({ example: 'Updated Q1 2023 Feedback Cycle' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description for the quarterly feedback cycle',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: CycleType })
  @IsOptional()
  @IsEnum(CycleType)
  type?: CycleType;

  @ApiPropertyOptional({ example: '2023-01-15' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-04-15' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: CycleStatus })
  @IsOptional()
  @IsEnum(CycleStatus)
  status?: CycleStatus;

  @ApiPropertyOptional({
    example: {
      questions: [
        'Updated: What are the strengths of this employee?',
        'Updated: What areas can the employee improve on?',
      ],
      ratingCategories: ['Communication', 'Technical Skills', 'Teamwork', 'Leadership'],
    },
    description: 'Feedback templates and questions for this cycle',
  })
  @IsOptional()
  feedbackTemplates?: any;
}