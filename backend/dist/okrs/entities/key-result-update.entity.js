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
exports.KeyResultUpdate = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const key_result_entity_1 = require("./key-result.entity");
let KeyResultUpdate = class KeyResultUpdate {
};
exports.KeyResultUpdate = KeyResultUpdate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KeyResultUpdate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], KeyResultUpdate.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KeyResultUpdate.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => key_result_entity_1.KeyResult, (keyResult) => keyResult.updates, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'key_result_id' }),
    __metadata("design:type", key_result_entity_1.KeyResult)
], KeyResultUpdate.prototype, "keyResult", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KeyResultUpdate.prototype, "keyResultId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], KeyResultUpdate.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KeyResultUpdate.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], KeyResultUpdate.prototype, "createdAt", void 0);
exports.KeyResultUpdate = KeyResultUpdate = __decorate([
    (0, typeorm_1.Entity)('key_result_updates')
], KeyResultUpdate);
//# sourceMappingURL=key-result-update.entity.js.map