import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { Okr } from '../../okrs/entities/okr.entity';
import { User } from '../../users/entities/user.entity';

@Entity('departments')
export class Department {
  @ApiProperty({ description: 'The unique identifier of the department' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the department', example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  @Column({ unique: true })
  name: string;

  @ApiProperty({ 
    description: 'The description of the department',
    example: 'Engineering department responsible for product development',
    required: false 
  })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ 
    description: 'The ID of the manager of the department',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false 
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager: User | null;

  // This is needed for the relationship to work with TypeORM
  @Column({ name: 'manager_id', nullable: true })
  managerId: string | null;

  @ApiProperty({ 
    description: 'The date when the department was created',
    example: '2023-01-01T00:00:00.000Z'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ 
    description: 'The date when the department was last updated',
    example: '2023-01-01T00:00:00.000Z'
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Okr, (okr) => okr.department)
  okrs: Okr[];
}
