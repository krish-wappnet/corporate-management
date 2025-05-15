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
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feedback_entity_1 = require("./entities/feedback.entity");
const feedback_cycle_entity_1 = require("./entities/feedback-cycle.entity");
const feedback_request_entity_1 = require("./entities/feedback-request.entity");
const pagination_response_dto_1 = require("../common/dtos/pagination-response.dto");
const users_service_1 = require("../users/users.service");
let FeedbackService = class FeedbackService {
    constructor(feedbackRepository, feedbackCycleRepository, feedbackRequestRepository, usersService) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackCycleRepository = feedbackCycleRepository;
        this.feedbackRequestRepository = feedbackRequestRepository;
        this.usersService = usersService;
    }
    async createFeedback(userId, createFeedbackDto) {
        await this.usersService.findOne(createFeedbackDto.toUserId);
        if (createFeedbackDto.cycleId) {
            await this.findCycleById(createFeedbackDto.cycleId);
        }
        if (createFeedbackDto.requestId) {
            const request = await this.findRequestById(createFeedbackDto.requestId);
            if (request.recipientId !== userId) {
                throw new common_1.ForbiddenException('Not authorized to respond to this feedback request');
            }
            if (createFeedbackDto.status === feedback_entity_1.FeedbackStatus.SUBMITTED) {
                await this.feedbackRequestRepository.update(request.id, {
                    status: feedback_request_entity_1.RequestStatus.COMPLETED,
                });
            }
        }
        const feedback = this.feedbackRepository.create({
            ...createFeedbackDto,
            fromUserId: userId,
        });
        return this.feedbackRepository.save(feedback);
    }
    async findAllFeedback(paginationDto = { page: 1, limit: 10 }, filters = {}) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const where = {};
        if (filters?.fromUserId) {
            where.fromUserId = filters.fromUserId;
        }
        if (filters?.toUserId) {
            where.toUserId = filters.toUserId;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.cycleId) {
            where.cycleId = filters.cycleId;
        }
        const [feedback, total] = await this.feedbackRepository.findAndCount({
            where,
            relations: ['fromUser', 'toUser'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const processedFeedback = feedback.map(item => {
            if (item.isAnonymous) {
                const { fromUser, ...rest } = item;
                return {
                    ...rest,
                    fromUserId: undefined,
                    fromUser: undefined
                };
            }
            return item;
        });
        return new pagination_response_dto_1.PaginationResponseDto(processedFeedback, total, page, limit);
    }
    async findFeedbackById(id, userId) {
        const feedback = await this.feedbackRepository.findOne({
            where: { id },
            relations: ['fromUser', 'toUser'],
        });
        if (!feedback) {
            throw new common_1.NotFoundException(`Feedback with ID "${id}" not found`);
        }
        if (feedback.isAnonymous && userId !== feedback.fromUserId) {
            const anonymizedFeedback = await this.anonymizeFeedback(feedback);
            return anonymizedFeedback;
        }
        return feedback;
    }
    async anonymizeFeedback(feedback) {
        const { fromUser, ...rest } = feedback;
        const updatedFeedback = {
            ...rest,
            fromUser: undefined,
            fromUserId: undefined
        };
        return this.feedbackRepository.save(updatedFeedback);
    }
    async updateFeedback(id, userId, updateFeedbackDto) {
        const feedback = await this.feedbackRepository.findOne({
            where: { id },
        });
        if (!feedback) {
            throw new common_1.NotFoundException(`Feedback with ID "${id}" not found`);
        }
        if (feedback.fromUserId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this feedback');
        }
        if (feedback.status === feedback_entity_1.FeedbackStatus.SUBMITTED &&
            updateFeedbackDto.status !== feedback_entity_1.FeedbackStatus.ACKNOWLEDGED) {
            throw new common_1.BadRequestException('Cannot update submitted feedback');
        }
        const updatedFeedback = this.feedbackRepository.merge(feedback, updateFeedbackDto);
        return this.feedbackRepository.save(updatedFeedback);
    }
    async deleteFeedback(id, userId) {
        const feedback = await this.feedbackRepository.findOne({
            where: { id },
        });
        if (!feedback) {
            throw new common_1.NotFoundException(`Feedback with ID "${id}" not found`);
        }
        if (feedback.fromUserId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this feedback');
        }
        if (feedback.status !== feedback_entity_1.FeedbackStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft feedback can be deleted');
        }
        await this.feedbackRepository.remove(feedback);
    }
    async createCycle(createCycleDto) {
        const startDate = new Date(createCycleDto.startDate);
        const endDate = new Date(createCycleDto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const cycle = this.feedbackCycleRepository.create({
            ...createCycleDto,
            startDate,
            endDate,
        });
        return this.feedbackCycleRepository.save(cycle);
    }
    async getFeedbackCycles(paginationDto = { page: 1, limit: 10 }, filters = {}) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.active) {
            const today = new Date();
            where.startDate = (0, typeorm_2.LessThanOrEqual)(today);
            where.endDate = (0, typeorm_2.MoreThanOrEqual)(today);
            where.status = feedback_cycle_entity_1.CycleStatus.ACTIVE;
        }
        const [cycles, total] = await this.feedbackCycleRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { startDate: 'DESC' },
        });
        return new pagination_response_dto_1.PaginationResponseDto(cycles, total, page, limit);
    }
    async findCycleById(id) {
        const cycle = await this.feedbackCycleRepository.findOne({
            where: { id },
            relations: ['requests', 'requests.requester', 'requests.recipient', 'requests.subject'],
        });
        if (!cycle) {
            throw new common_1.NotFoundException(`Feedback Cycle with ID "${id}" not found`);
        }
        return cycle;
    }
    async updateCycle(id, updateCycleDto) {
        const cycle = await this.findCycleById(id);
        if (updateCycleDto.startDate && updateCycleDto.endDate) {
            const startDate = new Date(updateCycleDto.startDate);
            const endDate = new Date(updateCycleDto.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        else if (updateCycleDto.startDate) {
            const startDate = new Date(updateCycleDto.startDate);
            const endDate = cycle.endDate;
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        else if (updateCycleDto.endDate) {
            const startDate = cycle.startDate;
            const endDate = new Date(updateCycleDto.endDate);
            if (endDate <= startDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
        }
        const updatedCycle = this.feedbackCycleRepository.merge(cycle, {
            ...updateCycleDto,
            startDate: updateCycleDto.startDate
                ? new Date(updateCycleDto.startDate)
                : cycle.startDate,
            endDate: updateCycleDto.endDate ? new Date(updateCycleDto.endDate) : cycle.endDate,
        });
        return this.feedbackCycleRepository.save(updatedCycle);
    }
    async deleteCycle(id) {
        const cycle = await this.findCycleById(id);
        const hasFeedback = await this.feedbackRepository.findOne({
            where: { cycleId: id },
        });
        if (hasFeedback) {
            throw new common_1.BadRequestException('Cannot delete cycle with associated feedback. Change status to cancelled instead.');
        }
        await this.feedbackCycleRepository.remove(cycle);
    }
    async createRequest(userId, createRequestDto) {
        await this.usersService.findOne(createRequestDto.recipientId);
        await this.usersService.findOne(createRequestDto.subjectId);
        if (createRequestDto.cycleId) {
            await this.findCycleById(createRequestDto.cycleId);
        }
        const dueDate = new Date(createRequestDto.dueDate);
        const today = new Date();
        if (dueDate <= today) {
            throw new common_1.BadRequestException('Due date must be in the future');
        }
        const request = this.feedbackRequestRepository.create({
            ...createRequestDto,
            requesterId: createRequestDto.requesterId || userId,
        });
        return this.feedbackRequestRepository.save(request);
    }
    async getFeedbackRequests(userId, paginationDto = { page: 1, limit: 10 }, filters = {}) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const where = {};
        if (filters?.requesterId) {
            where.requesterId = filters.requesterId;
        }
        if (filters?.recipientId) {
            where.recipientId = filters.recipientId;
        }
        if (filters?.subjectId) {
            where.subjectId = filters.subjectId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.cycleId) {
            where.cycleId = filters.cycleId;
        }
        const [requests, total] = await this.feedbackRequestRepository.findAndCount({
            where,
            relations: ['requester', 'recipient', 'subject', 'cycle'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return new pagination_response_dto_1.PaginationResponseDto(requests, total, page, limit);
    }
    async findRequestById(id) {
        const request = await this.feedbackRequestRepository.findOne({
            where: { id },
            relations: ['requester', 'recipient', 'subject', 'cycle'],
        });
        if (!request) {
            throw new common_1.NotFoundException(`Feedback Request with ID "${id}" not found`);
        }
        return request;
    }
    async updateRequest(id, userId, updateRequestDto) {
        const request = await this.findRequestById(id);
        if (updateRequestDto.recipientId) {
            await this.usersService.findOne(updateRequestDto.recipientId);
        }
        if (updateRequestDto.dueDate) {
            const dueDate = new Date(updateRequestDto.dueDate);
            const today = new Date();
            if (dueDate <= today) {
                throw new common_1.BadRequestException('Due date must be in the future');
            }
        }
        const updatedRequest = this.feedbackRequestRepository.merge(request, {
            ...updateRequestDto,
            dueDate: updateRequestDto.dueDate
                ? new Date(updateRequestDto.dueDate)
                : request.dueDate,
        });
        return this.feedbackRequestRepository.save(updatedRequest);
    }
    async respondToRequest(id, userId, accept) {
        const request = await this.findRequestById(id);
        if (request.status !== feedback_request_entity_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException('Can only respond to pending requests');
        }
        const status = accept ? feedback_request_entity_1.RequestStatus.PENDING : feedback_request_entity_1.RequestStatus.DECLINED;
        await this.feedbackRequestRepository.update(id, { status });
        return this.findRequestById(id);
    }
    async deleteRequest(id, userId) {
        const request = await this.findRequestById(id);
        if (request.requesterId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this request');
        }
        const hasFeedback = await this.feedbackRepository.findOne({
            where: { requestId: id },
        });
        if (hasFeedback) {
            throw new common_1.BadRequestException('Cannot delete request with associated feedback');
        }
        await this.feedbackRequestRepository.remove(request);
    }
    async generate360FeedbackRequests(cycleId, userId, recipientIds) {
        const cycle = await this.feedbackCycleRepository.findOne({ where: { id: cycleId } });
        if (!cycle) {
            throw new common_1.NotFoundException(`Feedback cycle with ID ${cycleId} not found`);
        }
        await this.usersService.findOne(userId);
        for (const recipientId of recipientIds) {
            await this.usersService.findOne(recipientId);
        }
        const requests = [];
        const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        for (const recipientId of recipientIds) {
            const requestData = {
                type: feedback_entity_1.FeedbackType.THREE_SIXTY,
                requesterId: userId,
                recipientId,
                subjectId: userId,
                status: feedback_request_entity_1.RequestStatus.PENDING,
                cycleId,
                message: 'Please provide your feedback',
                dueDate: dueDate,
                isAnonymous: true,
            };
            const request = this.feedbackRequestRepository.create(requestData);
            const savedRequest = await this.feedbackRequestRepository.save(request);
            requests.push(savedRequest);
        }
        return requests;
    }
    async getFeedbackStats(userId) {
        const where = {};
        if (userId) {
            where.recipientId = userId;
        }
        const total = await this.feedbackRequestRepository.count({ where });
        where.status = feedback_request_entity_1.RequestStatus.PENDING;
        const pending = await this.feedbackRequestRepository.count({ where });
        where.status = feedback_request_entity_1.RequestStatus.COMPLETED;
        const completed = await this.feedbackRequestRepository.count({ where });
        const typeStats = await this.feedbackRequestRepository
            .createQueryBuilder('request')
            .select('request.type', 'type')
            .addSelect('COUNT(request.id)', 'count')
            .where(userId ? 'request.recipientId = :userId' : '1=1', { userId })
            .groupBy('request.type')
            .getRawMany();
        const categories = {};
        typeStats.forEach(stat => {
            categories[stat.type] = parseInt(stat.count, 10);
        });
        return {
            total,
            pending,
            completed,
            categories,
        };
    }
    async getAverageFeedbackRatings(userId) {
        const feedback = await this.feedbackRepository.find({
            where: {
                toUserId: userId,
                status: feedback_entity_1.FeedbackStatus.SUBMITTED,
                ratings: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
            },
            select: ['ratings'],
        });
        if (feedback.length === 0) {
            return {};
        }
        const allRatingCategories = new Set();
        const categoryTotals = {};
        const categoryCounts = {};
        feedback.forEach(item => {
            if (item.ratings) {
                Object.entries(item.ratings).forEach(([category, rating]) => {
                    allRatingCategories.add(category);
                    categoryTotals[category] = (categoryTotals[category] || 0) + Number(rating);
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                });
            }
        });
        const averages = {};
        allRatingCategories.forEach(category => {
            averages[category] = categoryTotals[category] / categoryCounts[category];
        });
        return averages;
    }
    async get360FeedbackSummary(userId, cycleId) {
        const where = {
            toUserId: userId,
            type: feedback_entity_1.FeedbackType.THREE_SIXTY,
            status: feedback_entity_1.FeedbackStatus.SUBMITTED,
        };
        if (cycleId) {
            where.cycleId = cycleId;
        }
        const feedback = await this.feedbackRepository.find({
            where,
            select: ['ratings', 'strengths', 'improvements'],
        });
        if (feedback.length === 0) {
            return {
                averageRatings: {},
                strengthsSummary: [],
                improvementsSummary: [],
                feedbackCount: 0,
            };
        }
        const allRatingCategories = new Set();
        const categoryTotals = {};
        const categoryCounts = {};
        feedback.forEach(item => {
            if (item.ratings) {
                Object.entries(item.ratings).forEach(([category, rating]) => {
                    allRatingCategories.add(category);
                    categoryTotals[category] = (categoryTotals[category] || 0) + Number(rating);
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                });
            }
        });
        const averageRatings = {};
        allRatingCategories.forEach(category => {
            averageRatings[category] = categoryTotals[category] / categoryCounts[category];
        });
        const strengthsSummary = feedback
            .filter(item => item.strengths?.trim())
            .map(item => item.strengths);
        const improvementsSummary = feedback
            .filter(item => item.improvements?.trim())
            .map(item => item.improvements);
        return {
            averageRatings,
            strengthsSummary,
            improvementsSummary,
            feedbackCount: feedback.length,
        };
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __param(1, (0, typeorm_1.InjectRepository)(feedback_cycle_entity_1.FeedbackCycle)),
    __param(2, (0, typeorm_1.InjectRepository)(feedback_request_entity_1.FeedbackRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map