"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const kpis_module_1 = require("./kpis/kpis.module");
const okrs_module_1 = require("./okrs/okrs.module");
const feedback_module_1 = require("./feedback/feedback.module");
const performance_module_1 = require("./performance/performance.module");
const reports_module_1 = require("./reports/reports.module");
const database_module_1 = require("./database/database.module");
const departments_module_1 = require("./departments/departments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const databaseUrl = configService.get('DATABASE_URL');
                    console.log('Attempting to connect to database with URL:', databaseUrl);
                    return {
                        type: 'postgres',
                        url: databaseUrl,
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: configService.get('NODE_ENV') !== 'production',
                        logging: configService.get('NODE_ENV') !== 'production',
                        ssl: {
                            rejectUnauthorized: false
                        }
                    };
                },
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            kpis_module_1.KpisModule,
            okrs_module_1.OkrsModule,
            feedback_module_1.FeedbackModule,
            performance_module_1.PerformanceModule,
            reports_module_1.ReportsModule,
            database_module_1.DatabaseModule,
            departments_module_1.DepartmentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map