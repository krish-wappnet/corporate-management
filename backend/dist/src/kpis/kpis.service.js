"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kpi_entity_1 = require("./entities/kpi.entity");
const kpi_update_entity_1 = require("./entities/kpi-update.entity");
const kpi_category_entity_1 = require("./entities/kpi-category.entity");
const pagination_response_dto_1 = require("../common/dtos/pagination-response.dto");
const users_service_1 = require("../users/users.service");
let KpisService = class KpisService {
    constructor(kpisRepository, kpiUpdatesRepository, kpiCategoriesRepository, usersService) {
        this.kpisRepository = kpisRepository;
        this.kpiUpdatesRepository = kpiUpdatesRepository;
        this.kpiCategoriesRepository = kpiCategoriesRepository;
        this.usersService = usersService;
    }
    async createKpi(userId, createKpiDto) {
        await this.usersService.findOne(createKpiDto.userId);
        if (createKpiDto.categoryId) {
            await this.findCategoryById(createKpiDto.categoryId);
        }
        const startDate = new Date(createKpiDto.startDate);
        const endDate = new Date(createKpiDto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const kpi = this.kpisRepository.create({
            ...createKpiDto,
            createdById: userId,
            startDate,
            endDate,
        });
        return this.kpisRepository.save(kpi);
    }
    async findAllKpis(paginationDto = { page: 1, limit: 10 }, filters) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const where = {};
        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters?.startDate && filters?.endDate) {
            where.startDate = (0, typeorm_2.Between)(filters.startDate, filters.endDate);
        }
        const [kpis, total] = await this.kpisRepository.findAndCount({
            where,
            relations: ['user', 'createdBy'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return new pagination_response_dto_1.PaginationResponseDto(kpis, total, page, limit);
    }
    async findKpiById(id) {
        const kpi = await this.kpisRepository.findOne({
            where: { id },
            relations: ['user', 'createdBy', 'updates', 'updates.createdBy'],
        });
        if (!kpi) {
            throw new common_1.NotFoundException(`KPI with ID "${id}" not found`);
        }
        return kpi;
    }
    async updateKpi(id, updateKpiDto) {
        const kpi = await this.findKpiById(id);
        if (updateKpiDto.userId) {
            await this.usersService.findOne(updateKpiDto.userId);
        }
        if (updateKpiDto.categoryId) {
            await this.findCategoryById(updateKpiDto.categoryId);
        }
        if (updateKpiDto.startDate && updateKpiDto.endDate) {
            const startDate = new Date(updateKpiDto.startDate);
            const endDate = new Date(updateKpiDto.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        else if (updateKpiDto.startDate) {
            const startDate = new Date(updateKpiDto.startDate);
            const endDate = kpi.endDate;
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        else if (updateKpiDto.endDate) {
            const startDate = kpi.startDate;
            const endDate = new Date(updateKpiDto.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        const updatedKpi = this.kpisRepository.merge(kpi, {
            ...updateKpiDto,
            startDate: updateKpiDto.startDate ? new Date(updateKpiDto.startDate) : kpi.startDate,
            endDate: updateKpiDto.endDate ? new Date(updateKpiDto.endDate) : kpi.endDate,
        });
        return this.kpisRepository.save(updatedKpi);
    }
    async deleteKpi(id) {
        const kpi = await this.findKpiById(id);
        await this.kpisRepository.remove(kpi);
    }
    async createKpiUpdate(userId, createKpiUpdateDto) {
        const kpi = await this.findKpiById(createKpiUpdateDto.kpiId);
        const kpiUpdate = this.kpiUpdatesRepository.create({
            ...createKpiUpdateDto,
            createdById: userId,
        });
        const savedUpdate = await this.kpiUpdatesRepository.save(kpiUpdate);
        await this.kpisRepository.update(kpi.id, {
            currentValue: kpiUpdate.value,
        });
        return savedUpdate;
    }
    async getKpiUpdates(kpiId) {
        await this.findKpiById(kpiId);
        return this.kpiUpdatesRepository.find({
            where: { kpiId },
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async createCategory(createKpiCategoryDto) {
        const category = this.kpiCategoriesRepository.create(createKpiCategoryDto);
        return this.kpiCategoriesRepository.save(category);
    }
    async findAllCategories() {
        return this.kpiCategoriesRepository.find({
            order: { name: 'ASC' },
        });
    }
    async findCategoryById(id) {
        const category = await this.kpiCategoriesRepository.findOne({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`KPI Category with ID "${id}" not found`);
        }
        return category;
    }
    async updateCategory(id, updateKpiCategoryDto) {
        const category = await this.findCategoryById(id);
        const updatedCategory = this.kpiCategoriesRepository.merge(category, updateKpiCategoryDto);
        return this.kpiCategoriesRepository.save(updatedCategory);
    }
    async deleteCategory(id) {
        const category = await this.findCategoryById(id);
        await this.kpiCategoriesRepository.remove(category);
    }
    async getKpiCompletionRate(userId) {
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        const total = await this.kpisRepository.count({ where });
        const completed = await this.kpisRepository.count({
            where: {
                ...where,
                status: kpi_entity_1.KpiStatus.COMPLETED,
            },
        });
        const rate = total > 0 ? (completed / total) * 100 : 0;
        return {
            total,
            completed,
            rate,
        };
    }
    async getKpiProgressByCategory() {
        const result = await this.kpisRepository
            .createQueryBuilder('kpi')
            .leftJoin('kpi_categories', 'category', 'kpi.categoryId = category.id')
            .select('category.name', 'category')
            .addSelect('COUNT(kpi.id)', 'totalKpis')
            .addSelect('AVG((kpi.currentValue / NULLIF(kpi.targetValue, 0)) * 100)', 'avgProgress')
            .where('category.name IS NOT NULL')
            .groupBy('category.name')
            .getRawMany();
        return result.map(item => ({
            category: item.category,
            totalKpis: parseInt(item.totalKpis, 10),
            avgProgress: parseFloat(item.avgProgress) || 0,
        }));
    }
    async getKpiTrendsByUser(userId, startDate, endDate) {
        await this.usersService.findOne(userId);
        const result = await this.kpiUpdatesRepository
            .createQueryBuilder('update')
            .leftJoin('kpis', 'kpi', 'update.kpiId = kpi.id')
            .select("to_char(update.createdAt, 'YYYY-MM-DD')", 'date')
            .addSelect('AVG((update.value / NULLIF(kpi.targetValue, 0)) * 100)', 'avgProgress')
            .where('kpi.userId = :userId', { userId })
            .andWhere('update.createdAt BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .groupBy("to_char(update.createdAt, 'YYYY-MM-DD')")
            .orderBy("to_char(update.createdAt, 'YYYY-MM-DD')", 'ASC')
            .getRawMany();
        return result.map(item => ({
            date: item.date,
            avgProgress: parseFloat(item.avgProgress) || 0,
        }));
    }
};
exports.KpisService = KpisService;
exports.KpisService = KpisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kpi_entity_1.Kpi)),
    __param(1, (0, typeorm_1.InjectRepository)(kpi_update_entity_1.KpiUpdate)),
    __param(2, (0, typeorm_1.InjectRepository)(kpi_category_entity_1.KpiCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], KpisService);
//# sourceMappingURL=kpis.service.js.map