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
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'department', required: false })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('department') department?: string,
  ): Promise<PaginationResponseDto<User>> {
    return this.usersService.findAll(paginationDto, search, department);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'List of departments retrieved successfully' })
  getDepartments(): Promise<string[]> {
    return this.usersService.getDepartments();
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