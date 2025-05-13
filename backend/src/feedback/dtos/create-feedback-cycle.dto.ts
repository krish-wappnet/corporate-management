import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CycleStatus, CycleType } from '../entities/feedback-cycle.entity';

export class CreateFeedbackCycleDto {
  @ApiProperty({ example: 'Q1 2023 Feedback Cycle' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Quarterly feedback cycle for Q1 2023',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: CycleType, default: CycleType.QUARTERLY })
  @IsOptional()
  @IsEnum(CycleType)
  type?: CycleType;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2023-03-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: CycleStatus, default: CycleStatus.PLANNED })
  @IsOptional()
  @IsEnum(CycleStatus)
  status?: CycleStatus;

  @ApiPropertyOptional({
    example: {
      questions: [
        'What are the strengths of this employee?',
        'What areas can the employee improve on?',
      ],
      ratingCategories: ['Communication', 'Technical Skills', 'Teamwork'],
    },
    description: 'Feedback templates and questions for this cycle',
  })
  @IsOptional()
  feedbackTemplates?: any;
}