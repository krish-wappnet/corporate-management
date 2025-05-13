import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create new user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    search?: string,
    department?: string,
  ): Promise<PaginationResponseDto<User>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    
    const where: FindOptionsWhere<User> = {};
    
    if (search) {
      where.firstName = ILike(`%${search}%`);
    }

    if (department) {
      where.department = department;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { lastName: 'ASC', firstName: 'ASC' },
    });

    return new PaginationResponseDto<User>(users, total, page, limit);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['directReports'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If changing email, check if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Update user
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async getDirectReports(managerId: string): Promise<User[]> {
    const manager = await this.usersRepository.findOne({
      where: { id: managerId },
      relations: ['directReports'],
    });

    if (!manager) {
      throw new NotFoundException(`Manager with ID "${managerId}" not found`);
    }

    return manager.directReports;
  }

  async assignDirectReport(managerId: string, employeeId: string): Promise<User> {
    if (managerId === employeeId) {
      throw new BadRequestException('Cannot assign user as their own direct report');
    }

    const manager = await this.findOne(managerId);
    const employee = await this.findOne(employeeId);

    // Check if employee exists in manager's direct reports
    const isAlreadyDirectReport = manager.directReports?.some(
      (report) => report.id === employeeId,
    );

    if (!isAlreadyDirectReport) {
      if (!manager.directReports) {
        manager.directReports = [];
      }
      manager.directReports.push(employee);
      await this.usersRepository.save(manager);
    }

    // Update employee's managerId
    employee.managerId = managerId;
    await this.usersRepository.save(employee);

    return this.findOne(managerId);
  }

  async removeDirectReport(managerId: string, employeeId: string): Promise<User> {
    const manager = await this.usersRepository.findOne({
      where: { id: managerId },
      relations: ['directReports'],
    });
    
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }

    const employee = await this.usersRepository.findOne({
      where: { id: employeeId },
      relations: ['manager'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    // Remove from direct reports
    if (manager.directReports) {
      manager.directReports = manager.directReports.filter(
        (report) => report.id !== employeeId,
      );
      await this.usersRepository.save(manager);
    }

    // Update employee's manager to null
    if (employee.managerId === managerId) {
      employee.managerId = null;
      employee.manager = null;
      await this.usersRepository.save(employee);
    }

    return this.findOne(managerId);
  }

  async getDepartments(): Promise<string[]> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select('DISTINCT user.department')
      .where('user.department IS NOT NULL')
      .getRawMany();

    return result.map(item => item.department);
  }
}