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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async generatePerformanceReport(userId, startDate, endDate, format = 'excel', res) {
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('startDate and endDate are required');
        }
        let buffer;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (format === 'excel') {
            buffer = await this.reportsService.generatePerformanceSummaryExcel(userId, start, end);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=performance_summary_${userId}.xlsx`);
        }
        else {
            buffer = await this.reportsService.generatePerformanceSummaryPdf(userId, start, end);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=performance_summary_${userId}.pdf`);
        }
        res.send(buffer);
    }
    async generateTeamReport(managerId, startDate, endDate, format = 'excel', res) {
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('startDate and endDate are required');
        }
        const buffer = await this.reportsService.generateTeamPerformanceReport(managerId, new Date(startDate), new Date(endDate), format);
        if (format === 'excel') {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=team_performance_${managerId}.xlsx`);
        }
        else {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=team_performance_${managerId}.pdf`);
        }
        res.send(buffer);
    }
    async generateHrDashboardReport(startDate, endDate, format = 'excel', res) {
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('startDate and endDate are required');
        }
        const buffer = await this.reportsService.generateHrDashboardReport(new Date(startDate), new Date(endDate), format);
        if (format === 'excel') {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=hr_dashboard.xlsx');
        }
        else {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=hr_dashboard.pdf');
        }
        res.send(buffer);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('performance/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a performance summary report for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance report generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: false, enum: ['excel', 'pdf'], schema: { default: 'excel' } }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('format')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generatePerformanceReport", null);
__decorate([
    (0, common_1.Get)('team/:managerId'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a team performance report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team performance report generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Manager not found' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: false, enum: ['excel', 'pdf'], schema: { default: 'excel' } }),
    __param(0, (0, common_1.Param)('managerId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('format')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateTeamReport", null);
__decorate([
    (0, common_1.Get)('hr-dashboard'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Generate an HR dashboard report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HR dashboard report generated successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: false, enum: ['excel', 'pdf'], schema: { default: 'excel' } }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('format')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateHrDashboardReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map