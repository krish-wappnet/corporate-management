import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, Not, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Generates a unique manager ID based on the user's name
   */
  private generateManagerId(firstName: string, lastName: string): string {
    // Convert name to lowercase and replace spaces with hyphens
    const normalizedFirstName = firstName.toLowerCase().replace(/\s+/g, '-');
    const normalizedLastName = lastName.toLowerCase().replace(/\s+/g, '-');
    
    // Generate a short unique ID (first 8 characters of a UUID)
    const shortId = uuidv4().substring(0, 8);
    
    // Combine to create manager ID (e.g., john-doe-1a2b3c4d)
    return `${normalizedFirstName}-${normalizedLastName}-${shortId}`;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Generate managerId if user is a manager
    let managerId: string | null = null;
    if (createUserDto.roles?.includes(Role.MANAGER)) {
      managerId = this.generateManagerId(createUserDto.firstName, createUserDto.lastName);
      
      // Ensure the generated manager ID is unique
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!isUnique && attempts < maxAttempts && managerId) {
        const existingManager = await this.usersRepository.findOne({
          where: { managerId } as FindOptionsWhere<User>,
        });
        
        if (!existingManager) {
          isUnique = true;
        } else {
          // Append a random string to make it unique
          managerId = `${this.generateManagerId(createUserDto.firstName, createUserDto.lastName)}-${Math.random().toString(36).substring(2, 8)}`;
          attempts++;
        }
      }
      
      if (!isUnique || !managerId) {
        throw new InternalServerErrorException('Could not generate a unique manager ID');
      }
    }

    try {
      // Create and save user
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        managerId,
      });

      const savedUser = await this.usersRepository.save(user);
      
      // Return the user without the password
      const { password, ...result } = savedUser;
      return result as User;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    department?: string,
  ): Promise<PaginationResponseDto<User>> {
    try {
      const page = paginationDto.page ?? 1;
      const limit = paginationDto.limit ?? 10;
      
      const where: FindOptionsWhere<User> = {};
      
      if (department) {
        where.department = department;
      }

      const [users, total] = await this.usersRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order: { lastName: 'ASC', firstName: 'ASC' },
        select: ['id', 'firstName', 'lastName', 'email', 'roles', 'position', 'department', 'managerId', 'createdAt', 'updatedAt']
      });

      return new PaginationResponseDto<User>(users, total, page, limit);
    } catch (error) {
      this.logger.error(`Error finding users: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error finding users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        select: ['id', 'firstName', 'lastName', 'email', 'roles', 'position', 'department', 'managerId', 'createdAt', 'updatedAt']
      });

      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        select: ['id', 'firstName', 'lastName', 'email', 'password', 'roles', 'position', 'department', 'managerId', 'createdAt', 'updatedAt']
      });

      if (!user) {
        throw new NotFoundException(`User with email "${email}" not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Handle password update
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Check if roles are being updated
    const isBecomingManager = updateUserDto.roles?.includes(Role.MANAGER) && !user.roles.includes(Role.MANAGER);
    const isRemovingManager = user.roles.includes(Role.MANAGER) && 
      (!updateUserDto.roles || !updateUserDto.roles.includes(Role.MANAGER));

    // Generate managerId if user is becoming a manager
    if (isBecomingManager && !user.managerId) {
      let managerId = this.generateManagerId(
        updateUserDto.firstName || user.firstName,
        updateUserDto.lastName || user.lastName
      );

      // Ensure the generated manager ID is unique
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!isUnique && attempts < maxAttempts && managerId) {
        const existingManager = await this.usersRepository.findOne({
          where: { managerId } as FindOptionsWhere<User>,
        });
        
        if (!existingManager) {
          isUnique = true;
        } else {
          // Append a random string to make it unique
          managerId = `${this.generateManagerId(
            updateUserDto.firstName || user.firstName,
            updateUserDto.lastName || user.lastName
          )}-${Math.random().toString(36).substring(2, 8)}`;
          attempts++;
        }
      }
      
      if (!isUnique || !managerId) {
        throw new InternalServerErrorException('Could not generate a unique manager ID');
      }

      updateUserDto.managerId = managerId;
    } else if (isRemovingManager) {
      // Clear managerId if user is no longer a manager
      updateUserDto.managerId = null;
    }

    try {
      // Update user properties
      const updatedUser = this.usersRepository.merge(user, updateUserDto);
      const savedUser = await this.usersRepository.save(updatedUser);
      
      // Return the user without the password
      const { password, ...result } = savedUser;
      return result as User;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async getDirectReports(managerId: string): Promise<User[]> {
    try {
      // First, get the manager's managerId
      const manager = await this.findOne(managerId);
      
      if (!manager.managerId) {
        this.logger.warn(`Manager with ID ${managerId} does not have a managerId`);
        return [];
      }
      
      // Find all users where manager_id matches the manager's managerId
      return await this.usersRepository.find({
        where: { managerId: manager.managerId },
        select: ['id', 'firstName', 'lastName', 'email', 'roles', 'position', 'department', 'managerId', 'createdAt', 'updatedAt']
      });
    } catch (error) {
      this.logger.error(`Error fetching direct reports: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error fetching direct reports');
    }
  }

  async assignDirectReport(managerId: string, employeeId: string): Promise<User> {
    if (managerId === employeeId) {
      throw new BadRequestException('Cannot assign user as their own direct report');
    }

    try {
      const [manager, employee] = await Promise.all([
        this.findOne(managerId),
        this.findOne(employeeId)
      ]);

      // Check if the manager has a managerId (should be the case for managers)
      if (!manager.managerId) {
        throw new BadRequestException('Manager does not have a valid manager ID');
      }

      // Update employee's managerId
      employee.managerId = manager.managerId;
      
      await this.usersRepository.save(employee);
      
      // Return the updated employee without the password
      const result = await this.findOne(employeeId);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error assigning direct report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error assigning direct report');
    }
  }

  async removeDirectReport(managerId: string, employeeId: string): Promise<User> {
    try {
      const [manager, employee] = await Promise.all([
        this.findOne(managerId),
        this.findOne(employeeId)
      ]);

      // Check if the employee is actually a direct report of this manager
      if (employee.managerId !== manager.managerId) {
        throw new BadRequestException('This employee is not a direct report of the specified manager');
      }

      // Remove the manager reference
      employee.managerId = null;
      
      await this.usersRepository.save(employee);
      
      // Return the updated employee without the password
      const result = await this.findOne(employeeId);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error removing direct report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error removing direct report');
    }
  }

  async getDepartments(): Promise<string[]> {
    try {
      const users = await this.usersRepository.find({
        select: ['department'],
        where: { department: Not(IsNull()) },
      });

      // Extract unique department names
      const departments = [...new Set(users.map((user) => user.department))];
      return departments.filter((dept): dept is string => dept !== null);
    } catch (error) {
      this.logger.error(`Error fetching departments: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error fetching departments');
    }
  }

  /**
   * Find all users with manager role
   * @returns Promise with list of managers
   */
  async findManagers(search?: string): Promise<User[]> {
    try {
      const query = this.usersRepository
        .createQueryBuilder('user')
        .where('user.roles @> :role', { role: [Role.MANAGER] })
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.position',
          'user.roles',
          'user.department',
          'user.jobTitle',
          'user.phoneNumber',
          'user.hireDate',
          'user.isActive'
        ])
        .orderBy('user.firstName', 'ASC');
      
      // Add search conditions if search term is provided
      if (search && search.trim() !== '') {
        const searchTerm = `%${search.toLowerCase()}%`;
        query.andWhere(
          '(LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search OR LOWER(user.email) LIKE :search)',
          { search: searchTerm }
        );
      }

      return await query.getMany();
    } catch (error) {
      this.logger.error(`Error finding managers: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch managers');
    }
  }
}