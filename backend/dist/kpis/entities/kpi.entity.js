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
exports.Kpi = exports.KpiType = exports.KpiStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const kpi_update_entity_1 = require("./kpi-update.entity");
var KpiStatus;
(function (KpiStatus) {
    KpiStatus["DRAFT"] = "draft";
    KpiStatus["ACTIVE"] = "active";
    KpiStatus["COMPLETED"] = "completed";
    KpiStatus["CANCELLED"] = "cancelled";
})(KpiStatus || (exports.KpiStatus = KpiStatus = {}));
var KpiType;
(function (KpiType) {
    KpiType["QUANTITATIVE"] = "quantitative";
    KpiType["QUALITATIVE"] = "qualitative";
})(KpiType || (exports.KpiType = KpiType = {}));
let Kpi = class Kpi {
};
exports.Kpi = Kpi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Kpi.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Kpi.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Kpi.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: KpiType,
        default: KpiType.QUANTITATIVE,
    }),
    __metadata("design:type", String)
], Kpi.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Kpi.prototype, "metrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Kpi.prototype, "targetValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Kpi.prototype, "currentValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Kpi.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Kpi.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Kpi.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: KpiStatus,
        default: KpiStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Kpi.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Kpi.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.kpis),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Kpi.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Kpi.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Kpi.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Kpi.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpi_update_entity_1.KpiUpdate, (update) => update.kpi),
    __metadata("design:type", Array)
], Kpi.prototype, "updates", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Kpi.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Kpi.prototype, "updatedAt", void 0);
exports.Kpi = Kpi = __decorate([
    (0, typeorm_1.Entity)('kpis')
], Kpi);
//# sourceMappingURL=kpi.entity.js.map