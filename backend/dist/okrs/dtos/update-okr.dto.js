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
exports.UpdateOkrDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const okr_entity_1 = require("../entities/okr.entity");
class UpdateOkrDto {
}
exports.UpdateOkrDto = UpdateOkrDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Increase market share by 15%' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated description for the objective',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: okr_entity_1.OkrType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(okr_entity_1.OkrType),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: okr_entity_1.OkrFrequency }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(okr_entity_1.OkrFrequency),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2023-02-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2023-04-30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: okr_entity_1.OkrStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(okr_entity_1.OkrStatus),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25, description: 'Progress percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateOkrDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Department ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Parent OKR ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "parentOkrId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'User ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateOkrDto.prototype, "userId", void 0);
//# sourceMappingURL=update-okr.dto.js.map