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
exports.PerformanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const performance_review_entity_1 = require("./entities/performance-review.entity");
const review_comment_entity_1 = require("./entities/review-comment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const pagination_response_dto_1 = require("../common/dtos/pagination-response.dto");
const users_service_1 = require("../users/users.service");
let PerformanceService = class PerformanceService {
    constructor(performanceReviewRepository, reviewCommentRepository, usersService) {
        this.performanceReviewRepository = performanceReviewRepository;
        this.reviewCommentRepository = reviewCommentRepository;
        this.usersService = usersService;
    }
    async createReview(createReviewDto) {
        await this.usersService.findOne(createReviewDto.employeeId);
        await this.usersService.findOne(createReviewDto.reviewerId);
        const periodStart = new Date(createReviewDto.periodStart);
        const periodEnd = new Date(createReviewDto.periodEnd);
        if (periodEnd <= periodStart) {
            throw new common_1.BadRequestException('Period end date must be after start date');
        }
        if (createReviewDto.dueDate) {
            const dueDate = new Date(createReviewDto.dueDate);
            const today = new Date();
            if (dueDate < today) {
                throw new common_1.BadRequestException('Due date must be in the future');
            }
        }
        const review = new performance_review_entity_1.PerformanceReview();
        review.title = createReviewDto.title;
        if (createReviewDto.description !== undefined) {
            review.description = createReviewDto.description;
        }
        review.type = createReviewDto.type || performance_review_entity_1.ReviewType.QUARTERLY;
        review.periodStart = periodStart;
        review.periodEnd = periodEnd;
        if (createReviewDto.dueDate) {
            review.dueDate = new Date(createReviewDto.dueDate);
        }
        review.status = createReviewDto.status || performance_review_entity_1.ReviewStatus.DRAFT;
        review.ratings = createReviewDto.ratings || {};
        if (createReviewDto.overallRating !== undefined) {
            review.overallRating = createReviewDto.overallRating;
        }
        if (createReviewDto.achievements) {
            review.achievements = createReviewDto.achievements;
        }
        if (createReviewDto.areasForImprovement) {
            review.areasForImprovement = createReviewDto.areasForImprovement;
        }
        if (createReviewDto.goalsForNextPeriod) {
            review.goalsForNextPeriod = createReviewDto.goalsForNextPeriod;
        }
        if (createReviewDto.additionalComments) {
            review.additionalComments = createReviewDto.additionalComments;
        }
        const employee = new user_entity_1.User();
        employee.id = createReviewDto.employeeId;
        review.employee = employee;
        const reviewer = new user_entity_1.User();
        reviewer.id = createReviewDto.reviewerId;
        review.reviewer = reviewer;
        return this.performanceReviewRepository.save(review);
    }
    async findAllReviews(paginationDto = { page: 1, limit: 10 }, filters) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const where = {};
        if (filters?.employeeId) {
            where.employeeId = filters.employeeId;
        }
        if (filters?.reviewerId) {
            where.reviewerId = filters.reviewerId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.periodStart && filters?.periodEnd) {
            where.periodStart = (0, typeorm_2.Between)(filters.periodStart, filters.periodEnd);
        }
        if (filters?.dueDate) {
            where.dueDate = (0, typeorm_2.LessThanOrEqual)(filters.dueDate);
        }
        const [reviews, total] = await this.performanceReviewRepository.findAndCount({
            where,
            relations: ['employee', 'reviewer'],
            skip: (page - 1) * limit,
            take: limit,
            order: { updatedAt: 'DESC' },
        });
        return new pagination_response_dto_1.PaginationResponseDto(reviews, total, page, limit);
    }
    async findReviewById(id) {
        const review = await this.performanceReviewRepository.findOne({
            where: { id },
            relations: ['employee', 'reviewer', 'comments', 'comments.createdBy'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Performance Review with ID "${id}" not found`);
        }
        return review;
    }
    async updateReview(id, userId, updateReviewDto) {
        const review = await this.findReviewById(id);
        if (review.reviewerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this review');
        }
        if (updateReviewDto.periodStart && updateReviewDto.periodEnd) {
            const periodStart = new Date(updateReviewDto.periodStart);
            const periodEnd = new Date(updateReviewDto.periodEnd);
            if (periodEnd <= periodStart) {
                throw new common_1.BadRequestException('Period end date must be after start date');
            }
        }
        else if (updateReviewDto.periodStart) {
            const periodStart = new Date(updateReviewDto.periodStart);
            const periodEnd = review.periodEnd;
            if (periodEnd <= periodStart) {
                throw new common_1.BadRequestException('Period end date must be after start date');
            }
        }
        else if (updateReviewDto.periodEnd) {
            const periodStart = review.periodStart;
            const periodEnd = new Date(updateReviewDto.periodEnd);
            if (periodEnd <= periodStart) {
                throw new common_1.BadRequestException('Period end date must be after start date');
            }
        }
        if (updateReviewDto.dueDate) {
            const dueDate = new Date(updateReviewDto.dueDate);
            const today = new Date();
            if (dueDate < today) {
                throw new common_1.BadRequestException('Due date must be in the future');
            }
        }
        if (updateReviewDto.employeeId) {
            await this.usersService.findOne(updateReviewDto.employeeId);
        }
        if (updateReviewDto.reviewerId) {
            await this.usersService.findOne(updateReviewDto.reviewerId);
        }
        const updatedReview = this.performanceReviewRepository.merge(review, {
            ...updateReviewDto,
            periodStart: updateReviewDto.periodStart
                ? new Date(updateReviewDto.periodStart)
                : review.periodStart,
            periodEnd: updateReviewDto.periodEnd
                ? new Date(updateReviewDto.periodEnd)
                : review.periodEnd,
            dueDate: updateReviewDto.dueDate
                ? new Date(updateReviewDto.dueDate)
                : review.dueDate,
        });
        return this.performanceReviewRepository.save(updatedReview);
    }
    async deleteReview(id, userId) {
        const review = await this.findReviewById(id);
        if (review.reviewerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this review');
        }
        if (review.status !== performance_review_entity_1.ReviewStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft reviews can be deleted');
        }
        await this.performanceReviewRepository.remove(review);
    }
    async addComment(userId, createCommentDto) {
        const review = await this.findReviewById(createCommentDto.reviewId);
        if (review.employeeId !== userId && review.reviewerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to comment on this review');
        }
        const comment = this.reviewCommentRepository.create({
            ...createCommentDto,
            createdById: userId,
        });
        return this.reviewCommentRepository.save(comment);
    }
    async getReviewComments(reviewId) {
        await this.findReviewById(reviewId);
        return this.reviewCommentRepository.find({
            where: { reviewId },
            relations: ['createdBy'],
            order: { createdAt: 'ASC' },
        });
    }
    async submitReview(id, userId) {
        const review = await this.findReviewById(id);
        if (review.reviewerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to submit this review');
        }
        if (review.status !== performance_review_entity_1.ReviewStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft reviews can be submitted');
        }
        review.status = performance_review_entity_1.ReviewStatus.SUBMITTED;
        return this.performanceReviewRepository.save(review);
    }
    async acknowledgeReview(id, userId) {
        const review = await this.findReviewById(id);
        if (review.employeeId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to acknowledge this review');
        }
        if (review.status !== performance_review_entity_1.ReviewStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Only submitted reviews can be acknowledged');
        }
        review.status = performance_review_entity_1.ReviewStatus.ACKNOWLEDGED;
        return this.performanceReviewRepository.save(review);
    }
    async finalizeReview(id, userId) {
        const review = await this.findReviewById(id);
        if (review.reviewerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to finalize this review');
        }
        if (review.status !== performance_review_entity_1.ReviewStatus.ACKNOWLEDGED) {
            throw new common_1.BadRequestException('Only acknowledged reviews can be finalized');
        }
        review.status = performance_review_entity_1.ReviewStatus.FINALIZED;
        return this.performanceReviewRepository.save(review);
    }
    async getUserPerformanceTrend(userId, period) {
        await this.usersService.findOne(userId);
        const reviews = await this.performanceReviewRepository.find({
            where: {
                employeeId: userId,
                status: performance_review_entity_1.ReviewStatus.FINALIZED,
                periodEnd: (0, typeorm_2.Between)(period.start, period.end),
            },
            select: ['periodEnd', 'overallRating', 'type'],
            order: { periodEnd: 'ASC' },
        });
        if (reviews.length === 0) {
            return [];
        }
        const periodMap = new Map();
        reviews.forEach((review) => {
            const periodDate = review.periodEnd;
            let periodKey;
            if (review.type === performance_review_entity_1.ReviewType.MONTHLY) {
                periodKey = `${periodDate.getFullYear()}-${(periodDate.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}`;
            }
            else if (review.type === performance_review_entity_1.ReviewType.QUARTERLY) {
                const quarter = Math.floor(periodDate.getMonth() / 3) + 1;
                periodKey = `${periodDate.getFullYear()}-Q${quarter}`;
            }
            else {
                periodKey = periodDate.getFullYear().toString();
            }
            if (!periodMap.has(periodKey)) {
                periodMap.set(periodKey, { sum: 0, count: 0 });
            }
            const current = periodMap.get(periodKey);
            if (current) {
                current.sum += Number(review.overallRating);
                current.count += 1;
            }
        });
        const result = Array.from(periodMap.entries()).map(([period, { sum, count }]) => ({
            period,
            rating: sum / count,
        }));
        return result;
    }
    async getDepartmentPerformance() {
        const result = await this.performanceReviewRepository
            .createQueryBuilder('review')
            .leftJoin('users', 'user', 'review.employeeId = user.id')
            .select('user.department', 'department')
            .addSelect('AVG(review.overallRating)', 'avgRating')
            .addSelect('COUNT(review.id)', 'reviewCount')
            .where('review.status = :status', { status: performance_review_entity_1.ReviewStatus.FINALIZED })
            .andWhere('user.department IS NOT NULL')
            .groupBy('user.department')
            .getRawMany();
        return result.map((item) => ({
            department: item.department,
            avgRating: parseFloat(item.avgRating) || 0,
            reviewCount: parseInt(item.reviewCount, 10),
        }));
    }
    async getReviewsStatusSummary() {
        const result = await this.performanceReviewRepository
            .createQueryBuilder('review')
            .select('review.status', 'status')
            .addSelect('COUNT(review.id)', 'count')
            .groupBy('review.status')
            .getRawMany();
        const summary = {};
        Object.values(performance_review_entity_1.ReviewStatus).forEach((status) => {
            summary[status] = 0;
        });
        result.forEach((item) => {
            summary[item.status] = parseInt(item.count, 10);
        });
        return summary;
    }
    async getRatingDistribution() {
        const result = await this.performanceReviewRepository
            .createQueryBuilder('review')
            .select('ROUND(review.overallRating, 0)', 'rating')
            .addSelect('COUNT(review.id)', 'count')
            .where('review.overallRating IS NOT NULL')
            .groupBy('ROUND(review.overallRating, 0)')
            .orderBy('rating', 'ASC')
            .getRawMany();
        return result.map((item) => ({
            rating: parseInt(item.rating, 10),
            count: parseInt(item.count, 10),
        }));
    }
};
exports.PerformanceService = PerformanceService;
exports.PerformanceService = PerformanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(performance_review_entity_1.PerformanceReview)),
    __param(1, (0, typeorm_1.InjectRepository)(review_comment_entity_1.ReviewComment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], PerformanceService);
//# sourceMappingURL=performance.service.js.map