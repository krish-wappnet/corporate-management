import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { RequestStatus } from '../entities/feedback-request.entity';

export class UpdateFeedbackRequestDto {
  @ApiPropertyOptional({
    example: 'Updated request message',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: '2023-04-15' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: RequestStatus })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user who should provide feedback',
  })
  @IsOptional()
  @IsUUID()
  recipientId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the feedback should be anonymous',
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}