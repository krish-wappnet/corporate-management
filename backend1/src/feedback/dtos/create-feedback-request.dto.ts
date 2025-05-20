import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FeedbackType } from '../entities/feedback.entity';
import { RequestStatus } from '../entities/feedback-request.entity';

export class CreateFeedbackRequestDto {
  @ApiProperty({ enum: FeedbackType, example: FeedbackType.PEER })
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @ApiPropertyOptional({
    example: 'Please provide feedback on John\'s performance on the recent project',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: '2023-03-31' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ enum: RequestStatus, default: RequestStatus.PENDING })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user requesting feedback (defaults to current user)',
  })
  @IsOptional()
  @IsUUID()
  requesterId?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user who should provide feedback',
  })
  @IsNotEmpty()
  @IsUUID()
  recipientId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user who the feedback is about',
  })
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the feedback cycle',
  })
  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the feedback should be anonymous',
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}