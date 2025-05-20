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
exports.DepartmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const departments_service_1 = require("./departments.service");
const department_entity_1 = require("./entities/department.entity");
const create_department_dto_1 = require("./dtos/create-department.dto");
const update_department_dto_1 = require("./dtos/update-department.dto");
let DepartmentsController = class DepartmentsController {
    constructor(departmentsService) {
        this.departmentsService = departmentsService;
    }
    async create(createDepartmentDto) {
        return this.departmentsService.create(createDepartmentDto);
    }
    async findAll(name, include) {
        const relations = include ? include.split(',') : [];
        return this.departmentsService.findAll(relations);
    }
    async findOne(id, include) {
        const relations = include ? include.split(',') : [];
        return this.departmentsService.findOne(id, relations);
    }
    async update(id, updateDepartmentDto) {
        return this.departmentsService.update(id, updateDepartmentDto);
    }
    async remove(id) {
        return this.departmentsService.remove(id);
    }
};
exports.DepartmentsController = DepartmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new department' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The department has been successfully created.', type: department_entity_1.Department }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_department_dto_1.CreateDepartmentDto]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all departments.', type: [department_entity_1.Department] }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, description: 'Filter departments by name' }),
    (0, swagger_1.ApiQuery)({
        name: 'include',
        required: false,
        description: 'Relations to include (comma-separated), e.g., manager',
        type: String
    }),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('include')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a department by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Department ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the department.', type: department_entity_1.Department }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found.' }),
    (0, swagger_1.ApiQuery)({
        name: 'include',
        required: false,
        description: 'Relations to include (comma-separated), e.g., manager',
        type: String
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('include')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a department' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Department ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The department has been successfully updated.', type: department_entity_1.Department }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_department_dto_1.UpdateDepartmentDto]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a department' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Department ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The department has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "remove", null);
exports.DepartmentsController = DepartmentsController = __decorate([
    (0, swagger_1.ApiTags)('departments'),
    (0, common_1.Controller)('departments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [departments_service_1.DepartmentsService])
], DepartmentsController);
//# sourceMappingURL=departments.controller.js.map