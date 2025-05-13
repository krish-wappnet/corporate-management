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
exports.UpdatePerformanceReviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const performance_review_entity_1 = require("../entities/performance-review.entity");
class UpdatePerformanceReviewDto {
}
exports.UpdatePerformanceReviewDto = UpdatePerformanceReviewDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated Q1 2023 Performance Review' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated description for the quarterly review',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: performance_review_entity_1.ReviewType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(performance_review_entity_1.ReviewType),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2023-01-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2023-04-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "periodEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2023-04-30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: performance_review_entity_1.ReviewStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(performance_review_entity_1.ReviewStatus),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            communication: 5,
            teamwork: 5,
            technical: 4,
            leadership: 4,
        },
        description: 'Rating scores for different categories',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePerformanceReviewDto.prototype, "ratings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 4.5,
        description: 'Overall performance rating',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdatePerformanceReviewDto.prototype, "overallRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated achievements description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "achievements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated areas for improvement',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "areasForImprovement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated goals for the next period',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "goalsForNextPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated additional comments',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "additionalComments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the employee being reviewed',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the reviewer',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdatePerformanceReviewDto.prototype, "reviewerId", void 0);
//# sourceMappingURL=update-performance-review.dto.js.map