import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKeyResultUpdateDto {
  @ApiProperty({ example: 500, description: 'Updated value' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  value: number;

  @ApiPropertyOptional({
    example: 'Achieved 50% of the target ahead of schedule',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Key Result ID',
  })
  @IsUUID()
  keyResultId: string;
}