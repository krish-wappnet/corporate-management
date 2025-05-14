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
exports.CreateOkrDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const okr_entity_1 = require("../entities/okr.entity");
const create_key_result_dto_1 = require("./create-key-result.dto");
class CreateOkrDto {
}
exports.CreateOkrDto = CreateOkrDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Increase market share by 10%' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Focus on expanding to new markets and improving customer retention',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: okr_entity_1.OkrType, default: okr_entity_1.OkrType.INDIVIDUAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(okr_entity_1.OkrType),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: okr_entity_1.OkrFrequency, default: okr_entity_1.OkrFrequency.QUARTERLY }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(okr_entity_1.OkrFrequency),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-03-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: okr_entity_1.OkrStatus, default: okr_entity_1.OkrStatus.DRAFT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(okr_entity_1.OkrStatus),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Progress percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOkrDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Department ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Parent OKR ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "parentOkrId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'User ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOkrDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_key_result_dto_1.CreateKeyResultDto], description: 'Key Results' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_key_result_dto_1.CreateKeyResultDto),
    __metadata("design:type", Array)
], CreateOkrDto.prototype, "keyResults", void 0);
//# sourceMappingURL=create-okr.dto.js.map