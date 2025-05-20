import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReviewCommentDto {
  @ApiProperty({
    example: 'Great progress on the technical goals for this period.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the performance review',
  })
  @IsUUID()
  reviewId: string;
}