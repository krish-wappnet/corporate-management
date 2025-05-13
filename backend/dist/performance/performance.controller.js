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
exports.PerformanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const performance_service_1 = require("./performance.service");
const create_performance_review_dto_1 = require("./dtos/create-performance-review.dto");
const update_performance_review_dto_1 = require("./dtos/update-performance-review.dto");
const create_review_comment_dto_1 = require("./dtos/create-review-comment.dto");
const performance_review_entity_1 = require("./entities/performance-review.entity");
const review_comment_entity_1 = require("./entities/review-comment.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
let PerformanceController = class PerformanceController {
    constructor(performanceService) {
        this.performanceService = performanceService;
    }
    createReview(createReviewDto) {
        return this.performanceService.createReview(createReviewDto);
    }
    findAllReviews(paginationDto, employeeId, reviewerId, status, type, periodStart, periodEnd, dueDate) {
        const filters = {
            employeeId,
            reviewerId,
            status,
            type,
            periodStart: periodStart ? new Date(periodStart) : undefined,
            periodEnd: periodEnd ? new Date(periodEnd) : undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        };
        return this.performanceService.findAllReviews(paginationDto, filters);
    }
    findOneReview(id) {
        return this.performanceService.findReviewById(id);
    }
    updateReview(req, id, updateReviewDto) {
        return this.performanceService.updateReview(id, req.user.userId, updateReviewDto);
    }
    removeReview(req, id) {
        return this.performanceService.deleteReview(id, req.user.userId);
    }
    submitReview(req, id) {
        return this.performanceService.submitReview(id, req.user.userId);
    }
    acknowledgeReview(req, id) {
        return this.performanceService.acknowledgeReview(id, req.user.userId);
    }
    finalizeReview(req, id) {
        return this.performanceService.finalizeReview(id, req.user.userId);
    }
    addComment(req, createCommentDto) {
        return this.performanceService.addComment(req.user.userId, createCommentDto);
    }
    getReviewComments(id) {
        return this.performanceService.getReviewComments(id);
    }
    getUserPerformanceTrend(userId, startDate, endDate) {
        return this.performanceService.getUserPerformanceTrend(userId, {
            start: new Date(startDate),
            end: new Date(endDate),
        });
    }
    getDepartmentPerformance() {
        return this.performanceService.getDepartmentPerformance();
    }
    getReviewsStatusSummary() {
        return this.performanceService.getReviewsStatusSummary();
    }
    getRatingDistribution() {
        return this.performanceService.getRatingDistribution();
    }
};
exports.PerformanceController = PerformanceController;
__decorate([
    (0, common_1.Post)('reviews'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new performance review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Performance review created successfully', type: performance_review_entity_1.PerformanceReview }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_performance_review_dto_1.CreatePerformanceReviewDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all performance reviews with pagination and filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of performance reviews retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'reviewerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: performance_review_entity_1.ReviewStatus }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: performance_review_entity_1.ReviewType }),
    (0, swagger_1.ApiQuery)({ name: 'periodStart', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'periodEnd', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dueDate', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, common_1.Query)('reviewerId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('periodStart')),
    __param(6, (0, common_1.Query)('periodEnd')),
    __param(7, (0, common_1.Query)('dueDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "findAllReviews", null);
__decorate([
    (0, common_1.Get)('reviews/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a performance review by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance review retrieved successfully', type: performance_review_entity_1.PerformanceReview }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Performance review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "findOneReview", null);
__decorate([
    (0, common_1.Patch)('reviews/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a performance review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance review updated successfully', type: performance_review_entity_1.PerformanceReview }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Performance review not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_performance_review_dto_1.UpdatePerformanceReviewDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)('reviews/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a performance review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance review deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Performance review not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "removeReview", null);
__decorate([
    (0, common_1.Post)('reviews/:id/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a performance review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance review submitted successfully', type: performance_review_entity_1.PerformanceReview }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Performance review not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "submitReview", null);
__decorate([
    (0, common_1.Post)('reviews/:id/acknowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge a performance review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance review acknowledged successfully', type: performance_review_entity_1.PerformanceReview }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Performance review not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "acknowledgeReview", null);
__decorate([
    (0, common_1.Post)('reviews/:id/finalize'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalize a performance review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance review finalized successfully', type: performance_review_entity_1.PerformanceReview }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Performance review not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "finalizeReview", null);
__decorate([
    (0, common_1.Post)('comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a performance review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment added successfully', type: review_comment_entity_1.ReviewComment }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_review_comment_dto_1.CreateReviewCommentDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('reviews/:id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all comments for a performance review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of comments retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Performance review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getReviewComments", null);
__decorate([
    (0, common_1.Get)('analytics/user-trend/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get performance trend for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance trend retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getUserPerformanceTrend", null);
__decorate([
    (0, common_1.Get)('analytics/department-performance'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get performance by department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department performance retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getDepartmentPerformance", null);
__decorate([
    (0, common_1.Get)('analytics/status-summary'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get review status summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review status summary retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getReviewsStatusSummary", null);
__decorate([
    (0, common_1.Get)('analytics/rating-distribution'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get rating distribution' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating distribution retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getRatingDistribution", null);
exports.PerformanceController = PerformanceController = __decorate([
    (0, swagger_1.ApiTags)('performance'),
    (0, common_1.Controller)('performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [performance_service_1.PerformanceService])
], PerformanceController);
//# sourceMappingURL=performance.controller.js.map