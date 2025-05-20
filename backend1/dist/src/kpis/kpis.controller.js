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
exports.KpisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kpis_service_1 = require("./kpis.service");
const create_kpi_dto_1 = require("./dtos/create-kpi.dto");
const update_kpi_dto_1 = require("./dtos/update-kpi.dto");
const create_kpi_update_dto_1 = require("./dtos/create-kpi-update.dto");
const create_kpi_category_dto_1 = require("./dtos/create-kpi-category.dto");
const update_kpi_category_dto_1 = require("./dtos/update-kpi-category.dto");
const kpi_entity_1 = require("./entities/kpi.entity");
const kpi_update_entity_1 = require("./entities/kpi-update.entity");
const kpi_category_entity_1 = require("./entities/kpi-category.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
let KpisController = class KpisController {
    constructor(kpisService) {
        this.kpisService = kpisService;
    }
    create(req, createKpiDto) {
        return this.kpisService.createKpi(req.user.userId, createKpiDto);
    }
    findAll(paginationDto, userId, status, categoryId, startDate, endDate) {
        const filters = {
            userId,
            status,
            categoryId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.kpisService.findAllKpis(paginationDto, filters);
    }
    findAllCategories() {
        return this.kpisService.findAllCategories();
    }
    findOne(id) {
        return this.kpisService.findKpiById(id);
    }
    findByUserId(userId, paginationDto) {
        return this.kpisService.findAllKpis(paginationDto, { userId });
    }
    update(id, updateKpiDto) {
        return this.kpisService.updateKpi(id, updateKpiDto);
    }
    remove(id) {
        return this.kpisService.deleteKpi(id);
    }
    createUpdate(req, createKpiUpdateDto) {
        return this.kpisService.createKpiUpdate(req.user.userId, createKpiUpdateDto);
    }
    getUpdates(id) {
        return this.kpisService.getKpiUpdates(id);
    }
    createCategory(createKpiCategoryDto) {
        return this.kpisService.createCategory(createKpiCategoryDto);
    }
    findOneCategory(id) {
        return this.kpisService.findCategoryById(id);
    }
    updateCategory(id, updateKpiCategoryDto) {
        return this.kpisService.updateCategory(id, updateKpiCategoryDto);
    }
    removeCategory(id) {
        return this.kpisService.deleteCategory(id);
    }
    getCompletionRate(userId) {
        return this.kpisService.getKpiCompletionRate(userId);
    }
    getProgressByCategory() {
        return this.kpisService.getKpiProgressByCategory();
    }
    getTrends(userId, startDate, endDate) {
        return this.kpisService.getKpiTrendsByUser(userId, new Date(startDate), new Date(endDate));
    }
};
exports.KpisController = KpisController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Create a new KPI" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "KPI created successfully",
        type: kpi_entity_1.Kpi,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_kpi_dto_1.CreateKpiDto]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all KPIs with pagination and filters" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of KPIs retrieved successfully",
    }),
    (0, swagger_1.ApiQuery)({ name: "userId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "status", required: false, enum: kpi_entity_1.KpiStatus }),
    (0, swagger_1.ApiQuery)({ name: "categoryId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: false }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)("userId")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("categoryId")),
    __param(4, (0, common_1.Query)("startDate")),
    __param(5, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, swagger_1.ApiOperation)({ summary: "Get all KPI categories" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of KPI categories",
        type: [kpi_category_entity_1.KpiCategory],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a KPI by ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI retrieved successfully",
        type: kpi_entity_1.Kpi,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "KPI not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, swagger_1.ApiOperation)({ summary: "Get all KPIs for a specific user" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of KPIs for the user retrieved successfully",
    }),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Update a KPI" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI updated successfully",
        type: kpi_entity_1.Kpi,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "KPI not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kpi_dto_1.UpdateKpiDto]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Delete a KPI" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "KPI deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "KPI not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)("updates"),
    (0, swagger_1.ApiOperation)({ summary: "Create a KPI update" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "KPI update created successfully",
        type: kpi_update_entity_1.KpiUpdate,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_kpi_update_dto_1.CreateKpiUpdateDto]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "createUpdate", null);
__decorate([
    (0, common_1.Get)(":id/updates"),
    (0, swagger_1.ApiOperation)({ summary: "Get all updates for a KPI" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI updates retrieved successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "KPI not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getUpdates", null);
__decorate([
    (0, common_1.Post)("categories"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create a new KPI category" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "KPI category created successfully",
        type: kpi_category_entity_1.KpiCategory,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kpi_category_dto_1.CreateKpiCategoryDto]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)("categories/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a KPI category by ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI category retrieved successfully",
        type: kpi_category_entity_1.KpiCategory,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "KPI category not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findOneCategory", null);
__decorate([
    (0, common_1.Patch)("categories/:id"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update a KPI category" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI category updated successfully",
        type: kpi_category_entity_1.KpiCategory,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "KPI category not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kpi_category_dto_1.UpdateKpiCategoryDto]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)("categories/:id"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Delete a KPI category" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI category deleted successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "KPI category not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.Get)("analytics/completion-rate"),
    (0, swagger_1.ApiOperation)({ summary: "Get KPI completion rate" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI completion rate retrieved successfully",
    }),
    (0, swagger_1.ApiQuery)({ name: "userId", required: false }),
    __param(0, (0, common_1.Query)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getCompletionRate", null);
__decorate([
    (0, common_1.Get)("analytics/progress-by-category"),
    (0, swagger_1.ApiOperation)({ summary: "Get KPI progress by category" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI progress by category retrieved successfully",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getProgressByCategory", null);
__decorate([
    (0, common_1.Get)("analytics/trends/:userId"),
    (0, swagger_1.ApiOperation)({ summary: "Get KPI trends for a user" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "KPI trends retrieved successfully",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: true }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: true }),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getTrends", null);
exports.KpisController = KpisController = __decorate([
    (0, swagger_1.ApiTags)("kpis"),
    (0, common_1.Controller)("kpis"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [kpis_service_1.KpisService])
], KpisController);
//# sourceMappingURL=kpis.controller.js.map