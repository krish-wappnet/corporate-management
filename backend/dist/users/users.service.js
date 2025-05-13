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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./entities/user.entity");
const pagination_response_dto_1 = require("../common/dtos/pagination-response.dto");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }
    async findAll(paginationDto = { page: 1, limit: 10 }, search, department) {
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
        });
        return new pagination_response_dto_1.PaginationResponseDto(users, total, page, limit);
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['directReports'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with email "${email}" not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt();
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
        }
        const updatedUser = this.usersRepository.merge(user, updateUserDto);
        return this.usersRepository.save(updatedUser);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async getDirectReports(managerId) {
        const manager = await this.usersRepository.findOne({
            where: { id: managerId },
            relations: ['directReports'],
        });
        if (!manager) {
            throw new common_1.NotFoundException(`Manager with ID "${managerId}" not found`);
        }
        return manager.directReports;
    }
    async assignDirectReport(managerId, employeeId) {
        if (managerId === employeeId) {
            throw new common_1.BadRequestException('Cannot assign user as their own direct report');
        }
        const manager = await this.findOne(managerId);
        const employee = await this.findOne(employeeId);
        const isAlreadyDirectReport = manager.directReports?.some((report) => report.id === employeeId);
        if (!isAlreadyDirectReport) {
            if (!manager.directReports) {
                manager.directReports = [];
            }
            manager.directReports.push(employee);
            await this.usersRepository.save(manager);
        }
        employee.managerId = managerId;
        await this.usersRepository.save(employee);
        return this.findOne(managerId);
    }
    async removeDirectReport(managerId, employeeId) {
        const manager = await this.usersRepository.findOne({
            where: { id: managerId },
            relations: ['directReports'],
        });
        if (!manager) {
            throw new common_1.NotFoundException(`Manager with ID ${managerId} not found`);
        }
        const employee = await this.usersRepository.findOne({
            where: { id: employeeId },
            relations: ['manager'],
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        if (manager.directReports) {
            manager.directReports = manager.directReports.filter((report) => report.id !== employeeId);
            await this.usersRepository.save(manager);
        }
        if (employee.managerId === managerId) {
            employee.managerId = null;
            employee.manager = null;
            await this.usersRepository.save(employee);
        }
        return this.findOne(managerId);
    }
    async getDepartments() {
        const result = await this.usersRepository
            .createQueryBuilder('user')
            .select('DISTINCT user.department')
            .where('user.department IS NOT NULL')
            .getRawMany();
        return result.map(item => item.department);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map