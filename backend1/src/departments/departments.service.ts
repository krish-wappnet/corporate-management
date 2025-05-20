import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { managerId, ...departmentData } = createDepartmentDto;
    const department = this.departmentRepository.create(departmentData);
    
    // Set the managerId if provided
    if (managerId !== undefined) {
      department.managerId = managerId;
    }
    
    return await this.departmentRepository.save(department);
  }

  async findAll(relations: string[] = []): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations,
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string, relations: string[] = []): Promise<Department> {
    const department = await this.departmentRepository.findOne({ 
      where: { id },
      relations,
    });
    
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    
    // If managerId is provided, update it
    if (updateDepartmentDto.managerId !== undefined) {
      if (updateDepartmentDto.managerId === null) {
        // If managerId is explicitly set to null, remove the manager
        department.manager = null;
        department.managerId = null;
      } else {
        // Set the managerId, the database will handle the foreign key constraint
        department.managerId = updateDepartmentDto.managerId;
      }
      
      // Remove managerId from the DTO to prevent it from being assigned directly
      const { managerId, ...updateData } = updateDepartmentDto;
      Object.assign(department, updateData);
    } else {
      Object.assign(department, updateDepartmentDto);
    }
    
    return await this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const result = await this.departmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
  }
}
