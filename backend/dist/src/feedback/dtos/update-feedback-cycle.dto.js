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
exports.UpdateFeedbackCycleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const feedback_cycle_entity_1 = require("../entities/feedback-cycle.entity");
class UpdateFeedbackCycleDto {
}
exports.UpdateFeedbackCycleDto = UpdateFeedbackCycleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated Q1 2023 Feedback Cycle' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFeedbackCycleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated description for the quarterly feedback cycle',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFeedbackCycleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: feedback_cycle_entity_1.CycleType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(feedback_cycle_entity_1.CycleType),
    __metadata("design:type", String)
], UpdateFeedbackCycleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2023-01-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFeedbackCycleDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2023-04-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFeedbackCycleDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: feedback_cycle_entity_1.CycleStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(feedback_cycle_entity_1.CycleStatus),
    __metadata("design:type", String)
], UpdateFeedbackCycleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            questions: [
                'Updated: What are the strengths of this employee?',
                'Updated: What areas can the employee improve on?',
            ],
            ratingCategories: ['Communication', 'Technical Skills', 'Teamwork', 'Leadership'],
        },
        description: 'Feedback templates and questions for this cycle',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateFeedbackCycleDto.prototype, "feedbackTemplates", void 0);
//# sourceMappingURL=update-feedback-cycle.dto.js.map