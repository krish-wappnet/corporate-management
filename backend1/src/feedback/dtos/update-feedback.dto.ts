import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { FeedbackType, FeedbackStatus } from '../entities/feedback.entity';

export class UpdateFeedbackDto {
  @ApiPropertyOptional({ enum: FeedbackType })
  @IsOptional()
  @IsEnum(FeedbackType)
  type?: FeedbackType;

  @ApiPropertyOptional({ example: 'Updated feedback content...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: { communication: 5, teamwork: 5, technical: 4 },
    description: 'Rating scores for different categories',
  })
  @IsOptional()
  @IsObject()
  ratings?: Record<string, number>;

  @ApiPropertyOptional({
    example: 'Updated strengths description',
  })
  @IsOptional()
  @IsString()
  strengths?: string;

  @ApiPropertyOptional({
    example: 'Updated areas for improvement',
  })
  @IsOptional()
  @IsString()
  improvements?: string;

  @ApiPropertyOptional({ enum: FeedbackStatus })
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

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user receiving feedback',
  })
  @IsOptional()
  @IsUUID()
  toUserId?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this feedback should be anonymous',
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}