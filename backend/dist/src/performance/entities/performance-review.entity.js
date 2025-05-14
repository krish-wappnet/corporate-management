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
exports.PerformanceReview = exports.ReviewType = exports.ReviewStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const review_comment_entity_1 = require("./review-comment.entity");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["DRAFT"] = "draft";
    ReviewStatus["SUBMITTED"] = "submitted";
    ReviewStatus["ACKNOWLEDGED"] = "acknowledged";
    ReviewStatus["FINALIZED"] = "finalized";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
var ReviewType;
(function (ReviewType) {
    ReviewType["MONTHLY"] = "monthly";
    ReviewType["QUARTERLY"] = "quarterly";
    ReviewType["ANNUAL"] = "annual";
    ReviewType["CUSTOM"] = "custom";
})(ReviewType || (exports.ReviewType = ReviewType = {}));
let PerformanceReview = class PerformanceReview {
};
exports.PerformanceReview = PerformanceReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PerformanceReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PerformanceReview.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewType,
        default: ReviewType.QUARTERLY,
    }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PerformanceReview.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PerformanceReview.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PerformanceReview.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewStatus,
        default: ReviewStatus.DRAFT,
    }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PerformanceReview.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], PerformanceReview.prototype, "overallRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "achievements", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "areasForImprovement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "goalsForNextPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PerformanceReview.prototype, "additionalComments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.performanceReviews),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", user_entity_1.User)
], PerformanceReview.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PerformanceReview.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reviewsGiven),
    (0, typeorm_1.JoinColumn)({ name: 'reviewer_id' }),
    __metadata("design:type", user_entity_1.User)
], PerformanceReview.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PerformanceReview.prototype, "reviewerId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_comment_entity_1.ReviewComment, (comment) => comment.review, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], PerformanceReview.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PerformanceReview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PerformanceReview.prototype, "updatedAt", void 0);
exports.PerformanceReview = PerformanceReview = __decorate([
    (0, typeorm_1.Entity)('performance_reviews')
], PerformanceReview);
//# sourceMappingURL=performance-review.entity.js.map