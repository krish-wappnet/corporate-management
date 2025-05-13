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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateKpiDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const kpi_entity_1 = require("../entities/kpi.entity");
class CreateKpiDto {
}
exports.CreateKpiDto = CreateKpiDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Increase sales by 20%' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Increase sales through targeted marketing campaigns' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: kpi_entity_1.KpiType, default: kpi_entity_1.KpiType.QUANTITATIVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(kpi_entity_1.KpiType),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { unit: 'dollars', frequency: 'monthly' },
        description: 'Additional metrics information',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateKpiDto.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100000, description: 'Target value to achieve' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKpiDto.prototype, "targetValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Current value' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKpiDto.prototype, "currentValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1.5,
        description: 'Weight of this KPI (importance factor)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKpiDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-12-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: kpi_entity_1.KpiStatus, default: kpi_entity_1.KpiStatus.DRAFT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(kpi_entity_1.KpiStatus),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the KPI category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the user this KPI is assigned to',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateKpiDto.prototype, "userId", void 0);
//# sourceMappingURL=create-kpi.dto.js.map