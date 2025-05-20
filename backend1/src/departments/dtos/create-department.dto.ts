import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ 
    description: 'The name of the department', 
    example: 'Engineering',
    required: true 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'The description of the department',
    example: 'Engineering department responsible for product development',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'The ID of the manager of the department',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  managerId?: string | null;
}
