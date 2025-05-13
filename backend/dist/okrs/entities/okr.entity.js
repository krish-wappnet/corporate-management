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
exports.Okr = exports.OkrFrequency = exports.OkrType = exports.OkrStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const key_result_entity_1 = require("./key-result.entity");
var OkrStatus;
(function (OkrStatus) {
    OkrStatus["DRAFT"] = "draft";
    OkrStatus["ACTIVE"] = "active";
    OkrStatus["COMPLETED"] = "completed";
    OkrStatus["CANCELLED"] = "cancelled";
})(OkrStatus || (exports.OkrStatus = OkrStatus = {}));
var OkrType;
(function (OkrType) {
    OkrType["INDIVIDUAL"] = "individual";
    OkrType["TEAM"] = "team";
    OkrType["COMPANY"] = "company";
})(OkrType || (exports.OkrType = OkrType = {}));
var OkrFrequency;
(function (OkrFrequency) {
    OkrFrequency["QUARTERLY"] = "quarterly";
    OkrFrequency["ANNUAL"] = "annual";
    OkrFrequency["CUSTOM"] = "custom";
})(OkrFrequency || (exports.OkrFrequency = OkrFrequency = {}));
let Okr = class Okr {
};
exports.Okr = Okr;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Okr.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Okr.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Okr.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OkrType,
        default: OkrType.INDIVIDUAL,
    }),
    __metadata("design:type", String)
], Okr.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OkrFrequency,
        default: OkrFrequency.QUARTERLY,
    }),
    __metadata("design:type", String)
], Okr.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Okr.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Okr.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OkrStatus,
        default: OkrStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Okr.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Okr.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Okr.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Okr.prototype, "parentOkrId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Okr, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_okr_id' }),
    __metadata("design:type", Okr)
], Okr.prototype, "parentOkr", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Okr, (okr) => okr.parentOkr),
    __metadata("design:type", Array)
], Okr.prototype, "childOkrs", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.okrs),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Okr.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Okr.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => key_result_entity_1.KeyResult, (keyResult) => keyResult.okr, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Okr.prototype, "keyResults", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Okr.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Okr.prototype, "updatedAt", void 0);
exports.Okr = Okr = __decorate([
    (0, typeorm_1.Entity)('okrs')
], Okr);
//# sourceMappingURL=okr.entity.js.map