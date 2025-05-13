import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { FeedbackType, FeedbackStatus } from '../entities/feedback.entity';

export class CreateFeedbackDto {
  @ApiProperty({ enum: FeedbackType, example: FeedbackType.PEER })
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @ApiProperty({ example: 'John has demonstrated strong leadership skills...' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    example: { communication: 4, teamwork: 5, technical: 4 },
    description: 'Rating scores for different categories',
  })
  @IsOptional()
  @IsObject()
  ratings?: Record<string, number>;

  @ApiPropertyOptional({
    example: 'Strong communication, problem-solving, and mentoring abilities',
  })
  @IsOptional()
  @IsString()
  strengths?: string;

  @ApiPropertyOptional({
    example: 'Could improve on documentation and time management',
  })
  @IsOptional()
  @IsString()
  improvements?: string;

  @ApiPropertyOptional({ enum: FeedbackStatus, default: FeedbackStatus.DRAFT })
  @IsOptional()
  @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the feedback cycle',
  })
  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user receiving feedback',
  })
  @IsUUID()
  toUserId: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the feedback request (if responding to a request)',
  })
  @IsOptional()
  @IsUUID()
  requestId?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this feedback should be anonymous',
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}