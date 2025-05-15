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
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const feedback_service_1 = require("./feedback.service");
const create_feedback_dto_1 = require("./dtos/create-feedback.dto");
const update_feedback_dto_1 = require("./dtos/update-feedback.dto");
const create_feedback_cycle_dto_1 = require("./dtos/create-feedback-cycle.dto");
const update_feedback_cycle_dto_1 = require("./dtos/update-feedback-cycle.dto");
const create_feedback_request_dto_1 = require("./dtos/create-feedback-request.dto");
const update_feedback_request_dto_1 = require("./dtos/update-feedback-request.dto");
const feedback_entity_1 = require("./entities/feedback.entity");
const feedback_cycle_entity_1 = require("./entities/feedback-cycle.entity");
const feedback_request_entity_1 = require("./entities/feedback-request.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const pagination_response_dto_1 = require("../common/dtos/pagination-response.dto");
let FeedbackController = class FeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async findAllRequests(req, paginationDto, requesterId, recipientId, subjectId, status, cycleId) {
        const filters = {
            requesterId,
            recipientId,
            subjectId,
            status,
            cycleId,
        };
        return this.feedbackService.getFeedbackRequests(req.user.userId, paginationDto, filters);
    }
    createRequest(req, createRequestDto) {
        return this.feedbackService.createRequest(req.user.userId, createRequestDto);
    }
    createFeedback(req, createFeedbackDto) {
        return this.feedbackService.createFeedback(req.user.userId, createFeedbackDto);
    }
    findAllFeedback(paginationDto, fromUserId, toUserId, type, status, cycleId) {
        const filters = {
            fromUserId,
            toUserId,
            type,
            status,
            cycleId,
        };
        return this.feedbackService.findAllFeedback(paginationDto, filters);
    }
    findOneFeedback(req, id) {
        return this.feedbackService.findFeedbackById(id, req.user.userId);
    }
    updateFeedback(req, id, updateFeedbackDto) {
        return this.feedbackService.updateFeedback(id, req.user.userId, updateFeedbackDto);
    }
    removeFeedback(req, id) {
        return this.feedbackService.deleteFeedback(id, req.user.userId);
    }
    createCycle(createCycleDto) {
        return this.feedbackService.createCycle(createCycleDto);
    }
    async findAllCycles(paginationDto, status, type, active) {
        const filters = {
            status,
            type,
            active: active === 'true' || active === true,
        };
        return this.feedbackService.getFeedbackCycles(paginationDto, filters);
    }
    findOneCycle(id) {
        return this.feedbackService.findCycleById(id);
    }
    updateCycle(id, updateCycleDto) {
        return this.feedbackService.updateCycle(id, updateCycleDto);
    }
    removeCycle(id) {
        return this.feedbackService.deleteCycle(id);
    }
    findOneRequest(id) {
        return this.feedbackService.findRequestById(id);
    }
    updateRequest(req, id, updateRequestDto) {
        return this.feedbackService.updateRequest(id, req.user.userId, updateRequestDto);
    }
    respondToRequest(req, id, accept) {
        return this.feedbackService.respondToRequest(id, req.user.userId, accept);
    }
    removeRequest(req, id) {
        return this.feedbackService.deleteRequest(id, req.user.userId);
    }
    async generate360Feedback(userId, cycleId, body) {
        return this.feedbackService.generate360FeedbackRequests(cycleId, userId, body.recipientIds);
    }
    get360Summary(userId, cycleId) {
        return this.feedbackService.get360FeedbackSummary(userId, cycleId);
    }
    getFeedbackStats(userId) {
        return this.feedbackService.getFeedbackStats(userId);
    }
    getAverageRatings(userId) {
        return this.feedbackService.getAverageFeedbackRatings(userId);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all feedback requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of feedback requests', type: pagination_response_dto_1.PaginationResponseDto }),
    (0, swagger_1.ApiQuery)({ name: 'requesterId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'recipientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'subjectId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: feedback_request_entity_1.RequestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'cycleId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('requesterId')),
    __param(3, (0, common_1.Query)('recipientId')),
    __param(4, (0, common_1.Query)('subjectId')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findAllRequests", null);
__decorate([
    (0, common_1.Post)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new feedback request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback request created successfully', type: feedback_request_entity_1.FeedbackRequest }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_feedback_request_dto_1.CreateFeedbackRequestDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new feedback' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback created successfully', type: feedback_entity_1.Feedback }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_feedback_dto_1.CreateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all feedback with pagination and filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of feedback retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'fromUserId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'toUserId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: feedback_entity_1.FeedbackType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: feedback_entity_1.FeedbackStatus }),
    (0, swagger_1.ApiQuery)({ name: 'cycleId', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('fromUserId')),
    __param(2, (0, common_1.Query)('toUserId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findAllFeedback", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback retrieved successfully', type: feedback_entity_1.Feedback }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findOneFeedback", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback updated successfully', type: feedback_entity_1.Feedback }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_feedback_dto_1.UpdateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateFeedback", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "removeFeedback", null);
__decorate([
    (0, common_1.Post)('cycles'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new feedback cycle' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback cycle created successfully', type: feedback_cycle_entity_1.FeedbackCycle }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_feedback_cycle_dto_1.CreateFeedbackCycleDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "createCycle", null);
__decorate([
    (0, common_1.Get)('cycles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all feedback cycles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of feedback cycles', type: pagination_response_dto_1.PaginationResponseDto }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: feedback_cycle_entity_1.CycleStatus }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'active', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findAllCycles", null);
__decorate([
    (0, common_1.Get)('cycles/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a feedback cycle by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback cycle retrieved successfully', type: feedback_cycle_entity_1.FeedbackCycle }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback cycle not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findOneCycle", null);
__decorate([
    (0, common_1.Patch)('cycles/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a feedback cycle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback cycle updated successfully', type: feedback_cycle_entity_1.FeedbackCycle }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback cycle not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_feedback_cycle_dto_1.UpdateFeedbackCycleDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateCycle", null);
__decorate([
    (0, common_1.Delete)('cycles/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a feedback cycle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback cycle deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete cycle with associated feedback' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback cycle not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "removeCycle", null);
__decorate([
    (0, common_1.Get)('requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a feedback request by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback request retrieved successfully', type: feedback_request_entity_1.FeedbackRequest }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findOneRequest", null);
__decorate([
    (0, common_1.Patch)('requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a feedback request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback request updated successfully', type: feedback_request_entity_1.FeedbackRequest }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback request not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_feedback_request_dto_1.UpdateFeedbackRequestDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateRequest", null);
__decorate([
    (0, common_1.Post)('requests/:id/respond'),
    (0, swagger_1.ApiOperation)({ summary: 'Respond to a feedback request (accept/decline)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Response recorded successfully', type: feedback_request_entity_1.FeedbackRequest }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback request not found' }),
    (0, swagger_1.ApiQuery)({ name: 'accept', required: true, type: Boolean }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('accept')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Boolean]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "respondToRequest", null);
__decorate([
    (0, common_1.Delete)('requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a feedback request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback request deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback request not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "removeRequest", null);
__decorate([
    (0, common_1.Post)('360/:userId'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Generate 360-degree feedback requests' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '360-degree feedback requests generated successfully', type: [feedback_request_entity_1.FeedbackRequest] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or cycle not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('cycleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "generate360Feedback", null);
__decorate([
    (0, common_1.Get)('360/:userId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get 360 feedback summary for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback summary retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiQuery)({ name: 'cycleId', required: false }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "get360Summary", null);
__decorate([
    (0, common_1.Get)('analytics/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback statistics retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbackStats", null);
__decorate([
    (0, common_1.Get)('analytics/ratings/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get average feedback ratings for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Average ratings retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getAverageRatings", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, swagger_1.ApiTags)('feedback'),
    (0, common_1.Controller)('feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map