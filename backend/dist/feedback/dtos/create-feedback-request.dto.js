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
exports.CreateFeedbackRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const feedback_entity_1 = require("../entities/feedback.entity");
const feedback_request_entity_1 = require("../entities/feedback-request.entity");
class CreateFeedbackRequestDto {
}
exports.CreateFeedbackRequestDto = CreateFeedbackRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: feedback_entity_1.FeedbackType, example: feedback_entity_1.FeedbackType.PEER }),
    (0, class_validator_1.IsEnum)(feedback_entity_1.FeedbackType),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Please provide feedback on John\'s performance on the recent project',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-03-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: feedback_request_entity_1.RequestStatus, default: feedback_request_entity_1.RequestStatus.PENDING }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(feedback_request_entity_1.RequestStatus),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the user requesting feedback (defaults to current user)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "requesterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the user who should provide feedback',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the user who the feedback is about',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "subjectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the feedback cycle',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFeedbackRequestDto.prototype, "cycleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Whether the feedback should be anonymous',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFeedbackRequestDto.prototype, "isAnonymous", void 0);
//# sourceMappingURL=create-feedback-request.dto.js.map