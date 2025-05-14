import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@ApiTags('departments')
@Controller('departments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'The department has been successfully created.', type: Department })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'Return all departments.', type: [Department] })
  @ApiQuery({ name: 'name', required: false, description: 'Filter departments by name' })
  @ApiQuery({ 
    name: 'include', 
    required: false, 
    description: 'Relations to include (comma-separated), e.g., manager',
    type: String
  })
  async findAll(
    @Query('name') name?: string,
    @Query('include') include?: string,
  ): Promise<Department[]> {
    const relations = include ? include.split(',') : [];
    return this.departmentsService.findAll(relations);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Return the department.', type: Department })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  @ApiQuery({ 
    name: 'include', 
    required: false, 
    description: 'Relations to include (comma-separated), e.g., manager',
    type: String
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string,
  ): Promise<Department> {
    const relations = include ? include.split(',') : [];
    return this.departmentsService.findOne(id, relations);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update a department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'The department has been successfully updated.', type: Department })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'The department has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
