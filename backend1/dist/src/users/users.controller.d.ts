import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(paginationDto: PaginationDto, department?: string): Promise<PaginationResponseDto<User>>;
    getDepartments(): Promise<string[]>;
    getManagers(search?: string): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    getDirectReports(id: string): Promise<User[]>;
    assignDirectReport(id: string, employeeId: string): Promise<User>;
    removeDirectReport(id: string, employeeId: string): Promise<User>;
}
