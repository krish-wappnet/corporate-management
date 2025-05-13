import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(paginationDto?: PaginationDto, search?: string, department?: string): Promise<PaginationResponseDto<User>>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    getDirectReports(managerId: string): Promise<User[]>;
    assignDirectReport(managerId: string, employeeId: string): Promise<User>;
    removeDirectReport(managerId: string, employeeId: string): Promise<User>;
    getDepartments(): Promise<string[]>;
}
