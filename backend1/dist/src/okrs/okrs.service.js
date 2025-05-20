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
exports.OkrsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const okr_entity_1 = require("./entities/okr.entity");
const key_result_entity_1 = require("./entities/key-result.entity");
const key_result_update_entity_1 = require("./entities/key-result-update.entity");
const pagination_response_dto_1 = require("../common/dtos/pagination-response.dto");
const users_service_1 = require("../users/users.service");
let OkrsService = class OkrsService {
    constructor(okrsRepository, keyResultsRepository, keyResultUpdatesRepository, usersService) {
        this.okrsRepository = okrsRepository;
        this.keyResultsRepository = keyResultsRepository;
        this.keyResultUpdatesRepository = keyResultUpdatesRepository;
        this.usersService = usersService;
    }
    async createOkr(userId, createOkrDto) {
        const startDate = new Date(createOkrDto.startDate);
        const endDate = new Date(createOkrDto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        if (createOkrDto.userId) {
            await this.usersService.findOne(createOkrDto.userId);
        }
        if (createOkrDto.parentOkrId) {
            await this.findOkrById(createOkrDto.parentOkrId);
        }
        return this.okrsRepository.manager.transaction(async (manager) => {
            const okr = manager.create(okr_entity_1.Okr, {
                ...createOkrDto,
                startDate,
                endDate,
                userId: createOkrDto.userId || userId,
            });
            const savedOkr = await manager.save(okr);
            if (createOkrDto.keyResults && createOkrDto.keyResults.length > 0) {
                const keyResults = createOkrDto.keyResults.map((krDto) => {
                    return manager.create(key_result_entity_1.KeyResult, {
                        ...krDto,
                        okrId: savedOkr.id,
                        progress: 0,
                        weight: krDto.weight || 1,
                        startValue: krDto.startValue || 0,
                        currentValue: krDto.currentValue || 0,
                    });
                });
                await manager.save(keyResults);
            }
            return this.findOkrById(savedOkr.id);
        });
    }
    async findAllOkrs(paginationDto = { page: 1, limit: 10 }, filters) {
        const page = Math.max(1, paginationDto.page ?? 1);
        const limit = Math.max(1, Math.min(100, paginationDto.limit ?? 10));
        const skip = (page - 1) * limit;
        const where = {};
        if (filters) {
            if (filters.userId) {
                where.user = { id: filters.userId };
            }
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.startDate && filters.endDate) {
                where.startDate = (0, typeorm_2.Between)(filters.startDate, filters.endDate);
            }
            else {
                if (filters.startDate) {
                    where.startDate = (0, typeorm_2.MoreThanOrEqual)(new Date(filters.startDate));
                }
                if (filters.endDate) {
                    where.endDate = (0, typeorm_2.LessThanOrEqual)(new Date(filters.endDate));
                }
            }
            if (filters.type) {
                where.type = filters.type;
            }
        }
        const [items, total] = await this.okrsRepository.findAndCount({
            where,
            relations: ['user', 'keyResults', 'keyResults.progressUpdates', 'parentOkr'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return new pagination_response_dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async findOkrById(id) {
        const okr = await this.okrsRepository.findOne({
            where: { id },
            relations: [
                'user',
                'keyResults',
                'parentOkr',
                'childOkrs',
                'keyResults.updates',
                'keyResults.updates.createdBy',
            ],
        });
        if (!okr) {
            throw new common_1.NotFoundException(`OKR with ID "${id}" not found`);
        }
        return okr;
    }
    async updateOkr(id, updateOkrDto) {
        const okr = await this.findOkrById(id);
        if (updateOkrDto.startDate && updateOkrDto.endDate) {
            const startDate = new Date(updateOkrDto.startDate);
            const endDate = new Date(updateOkrDto.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        else if (updateOkrDto.startDate) {
            const startDate = new Date(updateOkrDto.startDate);
            const endDate = okr.endDate;
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        else if (updateOkrDto.endDate) {
            const startDate = okr.startDate;
            const endDate = new Date(updateOkrDto.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        if (updateOkrDto.userId) {
            await this.usersService.findOne(updateOkrDto.userId);
        }
        if (updateOkrDto.parentOkrId) {
            if (updateOkrDto.parentOkrId === id) {
                throw new common_1.BadRequestException('OKR cannot be its own parent');
            }
            await this.findOkrById(updateOkrDto.parentOkrId);
        }
        const updatedOkr = this.okrsRepository.merge(okr, {
            ...updateOkrDto,
            startDate: updateOkrDto.startDate
                ? new Date(updateOkrDto.startDate)
                : okr.startDate,
            endDate: updateOkrDto.endDate ? new Date(updateOkrDto.endDate) : okr.endDate,
        });
        await this.okrsRepository.save(updatedOkr);
        return this.findOkrById(id);
    }
    async deleteOkr(id) {
        const okr = await this.findOkrById(id);
        await this.okrsRepository.remove(okr);
    }
    async createKeyResult(okrId, createKeyResultDto) {
        const okr = await this.findOkrById(okrId);
        const keyResult = this.keyResultsRepository.create({
            ...createKeyResultDto,
            okrId,
            progress: 0,
            weight: createKeyResultDto.weight || 1,
            startValue: createKeyResultDto.startValue || 0,
            currentValue: createKeyResultDto.currentValue || 0,
        });
        const savedKeyResult = await this.keyResultsRepository.save(keyResult);
        await this.recalculateOkrProgress(okrId);
        return savedKeyResult;
    }
    async findKeyResultById(id) {
        const keyResult = await this.keyResultsRepository.findOne({
            where: { id },
            relations: ['okr', 'updates', 'updates.createdBy'],
        });
        if (!keyResult) {
            throw new common_1.NotFoundException(`Key Result with ID "${id}" not found`);
        }
        return keyResult;
    }
    async updateKeyResult(id, updateKeyResultDto) {
        const keyResult = await this.findKeyResultById(id);
        const updatedKeyResult = this.keyResultsRepository.merge(keyResult, updateKeyResultDto);
        if (updateKeyResultDto.currentValue !== undefined &&
            updateKeyResultDto.currentValue !== keyResult.currentValue) {
            const targetDiff = updatedKeyResult.targetValue - updatedKeyResult.startValue;
            const currentDiff = updatedKeyResult.currentValue - updatedKeyResult.startValue;
            if (targetDiff !== 0) {
                updatedKeyResult.progress = Math.min(100, Math.max(0, (currentDiff / targetDiff) * 100));
            }
            else {
                updatedKeyResult.progress = updatedKeyResult.currentValue >= updatedKeyResult.targetValue ? 100 : 0;
            }
        }
        await this.keyResultsRepository.save(updatedKeyResult);
        if (keyResult.okrId) {
            await this.recalculateOkrProgress(keyResult.okrId);
        }
        return this.findKeyResultById(id);
    }
    async deleteKeyResult(id) {
        const keyResult = await this.findKeyResultById(id);
        const okrId = keyResult.okrId;
        await this.keyResultsRepository.remove(keyResult);
        if (okrId) {
            await this.recalculateOkrProgress(okrId);
        }
    }
    async createKeyResultUpdate(userId, createUpdateDto) {
        const keyResult = await this.findKeyResultById(createUpdateDto.keyResultId);
        const update = this.keyResultUpdatesRepository.create({
            ...createUpdateDto,
            createdById: userId,
        });
        const savedUpdate = await this.keyResultUpdatesRepository.save(update);
        const targetDiff = keyResult.targetValue - keyResult.startValue;
        const currentDiff = createUpdateDto.value - keyResult.startValue;
        let progress = 0;
        if (targetDiff !== 0) {
            progress = Math.min(100, Math.max(0, (currentDiff / targetDiff) * 100));
        }
        else {
            progress = createUpdateDto.value >= keyResult.targetValue ? 100 : 0;
        }
        await this.keyResultsRepository.update(keyResult.id, {
            currentValue: createUpdateDto.value,
            progress,
        });
        if (keyResult.okrId) {
            await this.recalculateOkrProgress(keyResult.okrId);
        }
        return savedUpdate;
    }
    async getKeyResultUpdates(keyResultId) {
        await this.findKeyResultById(keyResultId);
        return this.keyResultUpdatesRepository.find({
            where: { keyResultId },
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async recalculateOkrProgress(okrId) {
        const keyResults = await this.keyResultsRepository.find({
            where: { okrId },
        });
        if (keyResults.length === 0) {
            await this.okrsRepository.update(okrId, { progress: 0 });
            return;
        }
        let totalWeight = 0;
        let totalWeightedProgress = 0;
        keyResults.forEach((kr) => {
            totalWeight += kr.weight;
            totalWeightedProgress += kr.progress * kr.weight;
        });
        const progress = totalWeight > 0 ? totalWeightedProgress / totalWeight : 0;
        await this.okrsRepository.update(okrId, { progress });
        const okr = await this.okrsRepository.findOne({
            where: { id: okrId },
            select: ['parentOkrId'],
        });
        if (okr && okr.parentOkrId) {
            await this.recalculateOkrProgress(okr.parentOkrId);
        }
    }
    async getOkrCompletionRate(userId) {
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        const total = await this.okrsRepository.count({ where });
        const completed = await this.okrsRepository.count({
            where: {
                ...where,
                status: okr_entity_1.OkrStatus.COMPLETED,
            },
        });
        const rate = total > 0 ? (completed / total) * 100 : 0;
        return {
            total,
            completed,
            rate,
        };
    }
    async getUserOkrProgress(userId) {
        await this.usersService.findOne(userId);
        const activeOkrs = await this.okrsRepository.find({
            where: {
                userId,
                status: okr_entity_1.OkrStatus.ACTIVE,
            },
            select: ['id', 'title', 'progress'],
        });
        if (activeOkrs.length === 0) {
            return {
                activeOkrs: 0,
                averageProgress: 0,
                topPerformingOkr: {},
            };
        }
        const totalProgress = activeOkrs.reduce((sum, okr) => sum + Number(okr.progress), 0);
        const averageProgress = totalProgress / activeOkrs.length;
        const topPerformingOkr = activeOkrs.reduce((top, current) => {
            return Number(current.progress) > Number(top.progress) ? current : top;
        }, activeOkrs[0]);
        return {
            activeOkrs: activeOkrs.length,
            averageProgress,
            topPerformingOkr,
        };
    }
    async getTeamOkrAlignment(managerUserId) {
        const directReports = await this.usersService.getDirectReports(managerUserId);
        if (directReports.length === 0) {
            return [];
        }
        const userIds = directReports.map((user) => user.id);
        const managerOkrs = await this.okrsRepository.find({
            where: { userId: managerUserId },
            select: ['id'],
        });
        if (managerOkrs.length === 0) {
            return directReports.map((user) => ({
                userId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                alignmentScore: 0,
            }));
        }
        const managerOkrIds = managerOkrs.map((okr) => okr.id);
        const results = [];
        for (const user of directReports) {
            const userOkrs = await this.okrsRepository.find({
                where: { userId: user.id },
                select: ['id', 'parentOkrId'],
            });
            if (userOkrs.length === 0) {
                results.push({
                    userId: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    alignmentScore: 0,
                });
                continue;
            }
            const alignedOkrs = userOkrs.filter((okr) => okr.parentOkrId && managerOkrIds.includes(okr.parentOkrId));
            const alignmentScore = (alignedOkrs.length / userOkrs.length) * 100;
            results.push({
                userId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                alignmentScore,
            });
        }
        return results;
    }
};
exports.OkrsService = OkrsService;
exports.OkrsService = OkrsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(okr_entity_1.Okr)),
    __param(1, (0, typeorm_1.InjectRepository)(key_result_entity_1.KeyResult)),
    __param(2, (0, typeorm_1.InjectRepository)(key_result_update_entity_1.KeyResultUpdate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], OkrsService);
//# sourceMappingURL=okrs.service.js.map