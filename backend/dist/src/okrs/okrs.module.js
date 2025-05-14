"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OkrsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const okrs_service_1 = require("./okrs.service");
const okrs_controller_1 = require("./okrs.controller");
const okr_entity_1 = require("./entities/okr.entity");
const key_result_entity_1 = require("./entities/key-result.entity");
const key_result_update_entity_1 = require("./entities/key-result-update.entity");
const users_module_1 = require("../users/users.module");
let OkrsModule = class OkrsModule {
};
exports.OkrsModule = OkrsModule;
exports.OkrsModule = OkrsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([okr_entity_1.Okr, key_result_entity_1.KeyResult, key_result_update_entity_1.KeyResultUpdate]),
            users_module_1.UsersModule,
        ],
        controllers: [okrs_controller_1.OkrsController],
        providers: [okrs_service_1.OkrsService],
        exports: [okrs_service_1.OkrsService],
    })
], OkrsModule);
//# sourceMappingURL=okrs.module.js.map