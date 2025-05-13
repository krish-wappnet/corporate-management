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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const class_transformer_1 = require("class-transformer");
const kpi_entity_1 = require("../../kpis/entities/kpi.entity");
const okr_entity_1 = require("../../okrs/entities/okr.entity");
const feedback_entity_1 = require("../../feedback/entities/feedback.entity");
const performance_review_entity_1 = require("../../performance/entities/performance-review.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: role_enum_1.Role,
        array: true,
        default: [role_enum_1.Role.EMPLOYEE],
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_id', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'manager_id' }),
    __metadata("design:type", Object)
], User.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpi_entity_1.Kpi, (kpi) => kpi.user),
    __metadata("design:type", Array)
], User.prototype, "kpis", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => okr_entity_1.Okr, (okr) => okr.user),
    __metadata("design:type", Array)
], User.prototype, "okrs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, (feedback) => feedback.fromUser),
    __metadata("design:type", Array)
], User.prototype, "givenFeedback", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, (feedback) => feedback.toUser),
    __metadata("design:type", Array)
], User.prototype, "receivedFeedback", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => performance_review_entity_1.PerformanceReview, (review) => review.employee),
    __metadata("design:type", Array)
], User.prototype, "performanceReviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => performance_review_entity_1.PerformanceReview, (review) => review.reviewer),
    __metadata("design:type", Array)
], User.prototype, "reviewsGiven", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User, { cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: 'user_reports',
        joinColumn: { name: 'manager_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'employee_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "directReports", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Unique)(['email'])
], User);
//# sourceMappingURL=user.entity.js.map