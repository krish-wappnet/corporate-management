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
exports.FeedbackRequest = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const feedback_cycle_entity_1 = require("./feedback-cycle.entity");
const feedback_entity_1 = require("./feedback.entity");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["DECLINED"] = "declined";
    RequestStatus["EXPIRED"] = "expired";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let FeedbackRequest = class FeedbackRequest {
};
exports.FeedbackRequest = FeedbackRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: feedback_entity_1.FeedbackType,
        default: feedback_entity_1.FeedbackType.PEER,
    }),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], FeedbackRequest.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'requester_id' }),
    __metadata("design:type", user_entity_1.User)
], FeedbackRequest.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "requesterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'recipient_id' }),
    __metadata("design:type", user_entity_1.User)
], FeedbackRequest.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "recipientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", user_entity_1.User)
], FeedbackRequest.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "subjectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => feedback_cycle_entity_1.FeedbackCycle, (cycle) => cycle.requests),
    (0, typeorm_1.JoinColumn)({ name: 'cycle_id' }),
    __metadata("design:type", feedback_cycle_entity_1.FeedbackCycle)
], FeedbackRequest.prototype, "cycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FeedbackRequest.prototype, "cycleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], FeedbackRequest.prototype, "isAnonymous", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FeedbackRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FeedbackRequest.prototype, "updatedAt", void 0);
exports.FeedbackRequest = FeedbackRequest = __decorate([
    (0, typeorm_1.Entity)('feedback_requests')
], FeedbackRequest);
//# sourceMappingURL=feedback-request.entity.js.map