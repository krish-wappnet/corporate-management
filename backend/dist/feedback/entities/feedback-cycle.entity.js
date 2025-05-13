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
exports.FeedbackCycle = exports.CycleType = exports.CycleStatus = void 0;
const typeorm_1 = require("typeorm");
const feedback_entity_1 = require("./feedback.entity");
const feedback_request_entity_1 = require("./feedback-request.entity");
var CycleStatus;
(function (CycleStatus) {
    CycleStatus["PLANNED"] = "planned";
    CycleStatus["ACTIVE"] = "active";
    CycleStatus["COMPLETED"] = "completed";
    CycleStatus["CANCELLED"] = "cancelled";
})(CycleStatus || (exports.CycleStatus = CycleStatus = {}));
var CycleType;
(function (CycleType) {
    CycleType["QUARTERLY"] = "quarterly";
    CycleType["ANNUAL"] = "annual";
    CycleType["MONTHLY"] = "monthly";
    CycleType["CUSTOM"] = "custom";
    CycleType["THREE_SIXTY"] = "360";
})(CycleType || (exports.CycleType = CycleType = {}));
let FeedbackCycle = class FeedbackCycle {
};
exports.FeedbackCycle = FeedbackCycle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FeedbackCycle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FeedbackCycle.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FeedbackCycle.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CycleType,
        default: CycleType.QUARTERLY,
    }),
    __metadata("design:type", String)
], FeedbackCycle.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], FeedbackCycle.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], FeedbackCycle.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CycleStatus,
        default: CycleStatus.PLANNED,
    }),
    __metadata("design:type", String)
], FeedbackCycle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], FeedbackCycle.prototype, "feedbackTemplates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, (feedback) => feedback.cycleId),
    __metadata("design:type", Array)
], FeedbackCycle.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_request_entity_1.FeedbackRequest, (request) => request.cycle),
    __metadata("design:type", Array)
], FeedbackCycle.prototype, "requests", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FeedbackCycle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FeedbackCycle.prototype, "updatedAt", void 0);
exports.FeedbackCycle = FeedbackCycle = __decorate([
    (0, typeorm_1.Entity)('feedback_cycles')
], FeedbackCycle);
//# sourceMappingURL=feedback-cycle.entity.js.map