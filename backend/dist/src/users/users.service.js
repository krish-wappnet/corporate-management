"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const user_entity_1 = require("./entities/user.entity");
const pagination_response_dto_1 = require("../common/dtos/pagination-response.dto");
const role_enum_1 = require("../common/enums/role.enum");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    generateManagerId(firstName, lastName) {
        const normalizedFirstName = firstName.toLowerCase().replace(/\s+/g, '-');
        const normalizedLastName = lastName.toLowerCase().replace(/\s+/g, '-');
        const shortId = (0, uuid_1.v4)().substring(0, 8);
        return `${normalizedFirstName}-${normalizedLastName}-${shortId}`;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        let managerId = null;
        if (createUserDto.roles?.includes(role_enum_1.Role.MANAGER)) {
            managerId = this.generateManagerId(createUserDto.firstName, createUserDto.lastName);
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 5;
            while (!isUnique && attempts < maxAttempts && managerId) {
                const existingManager = await this.usersRepository.findOne({
                    where: { managerId },
                });
                if (!existingManager) {
                    isUnique = true;
                }
                else {
                    managerId = `${this.generateManagerId(createUserDto.firstName, createUserDto.lastName)}-${Math.random().toString(36).substring(2, 8)}`;
                    attempts++;
                }
            }
            if (!isUnique || !managerId) {
                throw new common_1.InternalServerErrorException('Could not generate a unique manager ID');
            }
        }
        try {
            const user = this.usersRepository.create({
                ...createUserDto,
                password: hashedPassword,
                managerId,
            });
            const savedUser = await this.usersRepository.save(user);
            const { password, ...result } = savedUser;
            return result;
        }
        catch (error) {
            this.logger.error(`Error creating user: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error creating user');
        }
    }
    async findAll(paginationDto = { page: 1, limit: 10 }, search, department) {
        try {
            const page = paginationDto.page ?? 1;
            const limit = paginationDto.limit ?? 10;
            const where = {};
            if (search) {
                where.firstName = (0, typeorm_2.ILike)(`%${search}%`);
            }
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
            return new pagination_response_dto_1.PaginationResponseDto(users, total, page, limit);
        }
        catch (error) {
            this.logger.error(`Error finding users: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error finding users');
        }
    }
    async findOne(id) {
        try {
            const user = await this.usersRepository.findOne({
                where: { id },
                select: ['id', 'firstName', 'lastName', 'email', 'roles', 'position', 'department', 'managerId', 'createdAt', 'updatedAt']
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID "${id}" not found`);
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Error finding user: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error finding user');
        }
    }
    async findByEmail(email) {
        try {
            const user = await this.usersRepository.findOne({
                where: { email },
                select: ['id', 'firstName', 'lastName', 'email', 'password', 'roles', 'position', 'department', 'managerId', 'createdAt', 'updatedAt']
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with email "${email}" not found`);
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Error finding user by email: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error finding user by email');
        }
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const isBecomingManager = updateUserDto.roles?.includes(role_enum_1.Role.MANAGER) && !user.roles.includes(role_enum_1.Role.MANAGER);
        const isRemovingManager = user.roles.includes(role_enum_1.Role.MANAGER) &&
            (!updateUserDto.roles || !updateUserDto.roles.includes(role_enum_1.Role.MANAGER));
        if (isBecomingManager && !user.managerId) {
            let managerId = this.generateManagerId(updateUserDto.firstName || user.firstName, updateUserDto.lastName || user.lastName);
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 5;
            while (!isUnique && attempts < maxAttempts && managerId) {
                const existingManager = await this.usersRepository.findOne({
                    where: { managerId },
                });
                if (!existingManager) {
                    isUnique = true;
                }
                else {
                    managerId = `${this.generateManagerId(updateUserDto.firstName || user.firstName, updateUserDto.lastName || user.lastName)}-${Math.random().toString(36).substring(2, 8)}`;
                    attempts++;
                }
            }
            if (!isUnique || !managerId) {
                throw new common_1.InternalServerErrorException('Could not generate a unique manager ID');
            }
            updateUserDto.managerId = managerId;
        }
        else if (isRemovingManager) {
            updateUserDto.managerId = null;
        }
        try {
            const updatedUser = this.usersRepository.merge(user, updateUserDto);
            const savedUser = await this.usersRepository.save(updatedUser);
            const { password, ...result } = savedUser;
            return result;
        }
        catch (error) {
            this.logger.error(`Error updating user: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error updating user');
        }
    }
    async remove(id) {
        try {
            const user = await this.findOne(id);
            await this.usersRepository.remove(user);
        }
        catch (error) {
            this.logger.error(`Error removing user: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error removing user');
        }
    }
    async getDirectReports(managerId) {
        try {
            const manager = await this.findOne(managerId);
            if (!manager.managerId) {
                this.logger.warn(`Manager with ID ${managerId} does not have a managerId`);
                return [];
            }
            return await this.usersRepository.find({
                where: { managerId: manager.managerId },
                select: ['id', 'firstName', 'lastName', 'email', 'roles', 'position', 'department', 'managerId', 'createdAt', 'updatedAt']
            });
        }
        catch (error) {
            this.logger.error(`Error fetching direct reports: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error fetching direct reports');
        }
    }
    async assignDirectReport(managerId, employeeId) {
        if (managerId === employeeId) {
            throw new common_1.BadRequestException('Cannot assign user as their own direct report');
        }
        try {
            const [manager, employee] = await Promise.all([
                this.findOne(managerId),
                this.findOne(employeeId)
            ]);
            if (!manager.managerId) {
                throw new common_1.BadRequestException('Manager does not have a valid manager ID');
            }
            employee.managerId = manager.managerId;
            await this.usersRepository.save(employee);
            const result = await this.findOne(employeeId);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Error assigning direct report: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error assigning direct report');
        }
    }
    async removeDirectReport(managerId, employeeId) {
        try {
            const [manager, employee] = await Promise.all([
                this.findOne(managerId),
                this.findOne(employeeId)
            ]);
            if (employee.managerId !== manager.managerId) {
                throw new common_1.BadRequestException('This employee is not a direct report of the specified manager');
            }
            employee.managerId = null;
            await this.usersRepository.save(employee);
            const result = await this.findOne(employeeId);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Error removing direct report: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error removing direct report');
        }
    }
    async getDepartments() {
        try {
            const users = await this.usersRepository.find({
                select: ['department'],
                where: { department: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
            });
            const departments = [...new Set(users.map((user) => user.department))];
            return departments.filter((dept) => dept !== null);
        }
        catch (error) {
            this.logger.error(`Error fetching departments: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Error fetching departments');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map