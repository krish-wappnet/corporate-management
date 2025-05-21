import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @ApiQuery({ name: 'department', required: false })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('department') department?: string,
  ): Promise<PaginationResponseDto<User>> {
    return this.usersService.findAll(paginationDto, department);
  }

  @Get('departments')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get all unique department names' })
  @ApiResponse({ status: 200, description: 'List of department names' })
  async getDepartments(): Promise<string[]> {
    return this.usersService.getDepartments();
  }

  @Get('managers')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get all users with manager role' })
  @ApiResponse({ status: 200, description: 'List of managers retrieved successfully', type: [User] })
  @ApiResponse({ status: 500, description: 'Failed to fetch managers' })
  @ApiQuery({ name: 'search', required: false })
  async getManagers(@Query('search') search?: string): Promise<User[]> {
    return this.usersService.findManagers(search);
  }

  @Get('department/:departmentName')
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get all users in a specific department' })
  @ApiResponse({ status: 200, description: 'List of users in the department retrieved successfully', type: [User] })
  @ApiResponse({ status: 400, description: 'Department name is required' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 500, description: 'Failed to fetch users by department' })
  async getUsersByDepartment(@Param('departmentName') departmentName: string): Promise<User[]> {
    return this.usersService.findByDepartment(departmentName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Get(':id/direct-reports')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get user\'s direct reports' })
  @ApiResponse({ status: 200, description: 'Direct reports retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getDirectReports(@Param('id') id: string): Promise<User[]> {
    return this.usersService.getDirectReports(id);
  }

  @Post(':id/direct-reports/:employeeId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Assign direct report to a manager' })
  @ApiResponse({ status: 200, description: 'Direct report assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  assignDirectReport(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
  ): Promise<User> {
    return this.usersService.assignDirectReport(id, employeeId);
  }

  @Delete(':id/direct-reports/:employeeId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Remove direct report from a manager' })
  @ApiResponse({ status: 200, description: 'Direct report removed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  removeDirectReport(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
  ): Promise<User> {
    return this.usersService.removeDirectReport(id, employeeId);
  }
}