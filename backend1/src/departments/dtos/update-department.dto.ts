import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
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
