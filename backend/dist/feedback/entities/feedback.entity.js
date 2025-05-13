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
exports.Feedback = exports.FeedbackStatus = exports.FeedbackType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["PEER"] = "peer";
    FeedbackType["MANAGER"] = "manager";
    FeedbackType["SELF"] = "self";
    FeedbackType["UPWARD"] = "upward";
    FeedbackType["THREE_SIXTY"] = "360";
})(FeedbackType || (exports.FeedbackType = FeedbackType = {}));
var FeedbackStatus;
(function (FeedbackStatus) {
    FeedbackStatus["DRAFT"] = "draft";
    FeedbackStatus["SUBMITTED"] = "submitted";
    FeedbackStatus["ACKNOWLEDGED"] = "acknowledged";
})(FeedbackStatus || (exports.FeedbackStatus = FeedbackStatus = {}));
let Feedback = class Feedback {
};
exports.Feedback = Feedback;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FeedbackType,
        default: FeedbackType.PEER,
    }),
    __metadata("design:type", String)
], Feedback.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Feedback.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Feedback.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "strengths", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "improvements", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FeedbackStatus,
        default: FeedbackStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Feedback.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "cycleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.givenFeedback),
    (0, typeorm_1.JoinColumn)({ name: 'from_user_id' }),
    __metadata("design:type", user_entity_1.User)
], Feedback.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Feedback.prototype, "fromUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.receivedFeedback),
    (0, typeorm_1.JoinColumn)({ name: 'to_user_id' }),
    __metadata("design:type", user_entity_1.User)
], Feedback.prototype, "toUser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Feedback.prototype, "toUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Feedback.prototype, "isAnonymous", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Feedback.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Feedback.prototype, "updatedAt", void 0);
exports.Feedback = Feedback = __decorate([
    (0, typeorm_1.Entity)('feedback')
], Feedback);
//# sourceMappingURL=feedback.entity.js.map