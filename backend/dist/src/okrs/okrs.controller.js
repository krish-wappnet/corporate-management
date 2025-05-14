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
exports.OkrsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const okrs_service_1 = require("./okrs.service");
const create_okr_dto_1 = require("./dtos/create-okr.dto");
const update_okr_dto_1 = require("./dtos/update-okr.dto");
const create_key_result_dto_1 = require("./dtos/create-key-result.dto");
const update_key_result_dto_1 = require("./dtos/update-key-result.dto");
const create_key_result_update_dto_1 = require("./dtos/create-key-result-update.dto");
const okr_entity_1 = require("./entities/okr.entity");
const key_result_entity_1 = require("./entities/key-result.entity");
const key_result_update_entity_1 = require("./entities/key-result-update.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
let OkrsController = class OkrsController {
    constructor(okrsService) {
        this.okrsService = okrsService;
    }
    create(req, createOkrDto) {
        return this.okrsService.createOkr(req.user.userId, createOkrDto);
    }
    async findAll(paginationDto, userId, status, startDate, endDate, type) {
        const filters = {
            userId,
            status,
            type,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.okrsService.findAllOkrs(paginationDto, filters);
    }
    findOne(id) {
        return this.okrsService.findOkrById(id);
    }
    update(id, updateOkrDto) {
        return this.okrsService.updateOkr(id, updateOkrDto);
    }
    remove(id) {
        return this.okrsService.deleteOkr(id);
    }
    createKeyResult(okrId, createKeyResultDto) {
        return this.okrsService.createKeyResult(okrId, createKeyResultDto);
    }
    findOneKeyResult(id) {
        return this.okrsService.findKeyResultById(id);
    }
    updateKeyResult(id, updateKeyResultDto) {
        return this.okrsService.updateKeyResult(id, updateKeyResultDto);
    }
    removeKeyResult(id) {
        return this.okrsService.deleteKeyResult(id);
    }
    createKeyResultUpdate(req, createUpdateDto) {
        return this.okrsService.createKeyResultUpdate(req.user.userId, createUpdateDto);
    }
    getKeyResultUpdates(id) {
        return this.okrsService.getKeyResultUpdates(id);
    }
    getCompletionRate(userId) {
        return this.okrsService.getOkrCompletionRate(userId);
    }
    getUserProgress(userId) {
        return this.okrsService.getUserOkrProgress(userId);
    }
    getTeamAlignment(managerUserId) {
        return this.okrsService.getTeamOkrAlignment(managerUserId);
    }
};
exports.OkrsController = OkrsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new OKR' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'OKR created successfully', type: okr_entity_1.Okr }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_okr_dto_1.CreateOkrDto]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all OKRs with optional filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OKRs retrieved successfully', type: [okr_entity_1.Okr] }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: okr_entity_1.OkrStatus }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an OKR by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OKR retrieved successfully', type: okr_entity_1.Okr }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'OKR not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an OKR' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OKR updated successfully', type: okr_entity_1.Okr }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'OKR not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_okr_dto_1.UpdateOkrDto]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an OKR' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OKR deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'OKR not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':okrId/key-results'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new key result for an OKR' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Key result created successfully', type: key_result_entity_1.KeyResult }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'OKR not found' }),
    __param(0, (0, common_1.Param)('okrId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_key_result_dto_1.CreateKeyResultDto]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "createKeyResult", null);
__decorate([
    (0, common_1.Get)('key-results/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a key result by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Key result retrieved successfully', type: key_result_entity_1.KeyResult }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Key result not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "findOneKeyResult", null);
__decorate([
    (0, common_1.Patch)('key-results/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a key result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Key result updated successfully', type: key_result_entity_1.KeyResult }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Key result not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_key_result_dto_1.UpdateKeyResultDto]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "updateKeyResult", null);
__decorate([
    (0, common_1.Delete)('key-results/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a key result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Key result deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Key result not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "removeKeyResult", null);
__decorate([
    (0, common_1.Post)('key-results/updates'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a key result update' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Key result update created successfully', type: key_result_update_entity_1.KeyResultUpdate }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Key result not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_key_result_update_dto_1.CreateKeyResultUpdateDto]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "createKeyResultUpdate", null);
__decorate([
    (0, common_1.Get)('key-results/:id/updates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all updates for a key result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Key result updates retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Key result not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "getKeyResultUpdates", null);
__decorate([
    (0, common_1.Get)('analytics/completion-rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get OKR completion rate' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OKR completion rate retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "getCompletionRate", null);
__decorate([
    (0, common_1.Get)('analytics/user-progress/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user OKR progress' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User OKR progress retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "getUserProgress", null);
__decorate([
    (0, common_1.Get)('analytics/team-alignment/:managerUserId'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get team OKR alignment for a manager' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team OKR alignment retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Manager not found' }),
    __param(0, (0, common_1.Param)('managerUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OkrsController.prototype, "getTeamAlignment", null);
exports.OkrsController = OkrsController = __decorate([
    (0, swagger_1.ApiTags)('okrs'),
    (0, common_1.Controller)('okrs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [okrs_service_1.OkrsService])
], OkrsController);
//# sourceMappingURL=okrs.controller.js.map