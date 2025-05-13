"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../users/entities/user.entity");
const role_enum_1 = require("../../common/enums/role.enum");
const kpi_category_entity_1 = require("../../kpis/entities/kpi-category.entity");
const feedback_cycle_entity_1 = require("../../feedback/entities/feedback-cycle.entity");
let SeedService = class SeedService {
    constructor(usersRepository, kpiCategoryRepository, feedbackCycleRepository) {
        this.usersRepository = usersRepository;
        this.kpiCategoryRepository = kpiCategoryRepository;
        this.feedbackCycleRepository = feedbackCycleRepository;
    }
    async seed() {
        await this.seedUsers();
        await this.seedKpiCategories();
        await this.seedFeedbackCycles();
    }
    async seedUsers() {
        const userCount = await this.usersRepository.count();
        if (userCount > 0) {
            return;
        }
        const salt = await bcrypt.genSalt();
        const adminPassword = await bcrypt.hash('admin123', salt);
        const managerPassword = await bcrypt.hash('manager123', salt);
        const employeePassword = await bcrypt.hash('employee123', salt);
        const admin = this.usersRepository.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: adminPassword,
            roles: [role_enum_1.Role.ADMIN],
            position: 'System Administrator',
            department: 'IT',
        });
        const savedAdmin = await this.usersRepository.save(admin);
        const manager = this.usersRepository.create({
            firstName: 'Manager',
            lastName: 'User',
            email: 'manager@example.com',
            password: managerPassword,
            roles: [role_enum_1.Role.MANAGER],
            position: 'Department Manager',
            department: 'Engineering',
        });
        const savedManager = await this.usersRepository.save(manager);
        const employee1 = this.usersRepository.create({
            firstName: 'Employee',
            lastName: 'One',
            email: 'employee1@example.com',
            password: employeePassword,
            roles: [role_enum_1.Role.EMPLOYEE],
            position: 'Software Engineer',
            department: 'Engineering',
            managerId: savedManager.id,
        });
        const employee2 = this.usersRepository.create({
            firstName: 'Employee',
            lastName: 'Two',
            email: 'employee2@example.com',
            password: employeePassword,
            roles: [role_enum_1.Role.EMPLOYEE],
            position: 'QA Engineer',
            department: 'Engineering',
            managerId: savedManager.id,
        });
        await this.usersRepository.save([employee1, employee2]);
        savedManager.directReports = [employee1, employee2];
        await this.usersRepository.save(savedManager);
    }
    async seedKpiCategories() {
        const categoryCount = await this.kpiCategoryRepository.count();
        if (categoryCount > 0) {
            return;
        }
        const categories = [
            {
                name: 'Financial',
                description: 'Financial performance indicators',
            },
            {
                name: 'Customer',
                description: 'Customer-related performance indicators',
            },
            {
                name: 'Internal Process',
                description: 'Internal process performance indicators',
            },
            {
                name: 'Learning and Growth',
                description: 'Learning and growth performance indicators',
            },
            {
                name: 'Project Delivery',
                description: 'Project delivery performance indicators',
            },
        ];
        const categoryEntities = categories.map(category => this.kpiCategoryRepository.create(category));
        await this.kpiCategoryRepository.save(categoryEntities);
    }
    async seedFeedbackCycles() {
        const cycleCount = await this.feedbackCycleRepository.count();
        if (cycleCount > 0) {
            return;
        }
        const currentYear = new Date().getFullYear();
        const q1Start = new Date(currentYear, 0, 1);
        const q1End = new Date(currentYear, 2, 31);
        const q2Start = new Date(currentYear, 3, 1);
        const q2End = new Date(currentYear, 5, 30);
        const annualStart = new Date(currentYear, 0, 1);
        const annualEnd = new Date(currentYear, 11, 31);
        const cycles = [
            {
                name: `Q1 ${currentYear} Feedback Cycle`,
                description: `Quarterly feedback cycle for Q1 ${currentYear}`,
                type: feedback_cycle_entity_1.CycleType.QUARTERLY,
                startDate: q1Start,
                endDate: q1End,
                status: feedback_cycle_entity_1.CycleStatus.COMPLETED,
                feedbackTemplates: {
                    questions: [
                        'What are the strengths of this employee?',
                        'What areas can the employee improve on?',
                        'How has the employee contributed to team goals?',
                    ],
                    ratingCategories: ['Communication', 'Technical Skills', 'Teamwork', 'Leadership'],
                },
            },
            {
                name: `Q2 ${currentYear} Feedback Cycle`,
                description: `Quarterly feedback cycle for Q2 ${currentYear}`,
                type: feedback_cycle_entity_1.CycleType.QUARTERLY,
                startDate: q2Start,
                endDate: q2End,
                status: feedback_cycle_entity_1.CycleStatus.ACTIVE,
                feedbackTemplates: {
                    questions: [
                        'What are the strengths of this employee?',
                        'What areas can the employee improve on?',
                        'How has the employee contributed to team goals?',
                    ],
                    ratingCategories: ['Communication', 'Technical Skills', 'Teamwork', 'Leadership'],
                },
            },
            {
                name: `Annual Review ${currentYear}`,
                description: `Annual performance review cycle for ${currentYear}`,
                type: feedback_cycle_entity_1.CycleType.ANNUAL,
                startDate: annualStart,
                endDate: annualEnd,
                status: feedback_cycle_entity_1.CycleStatus.ACTIVE,
                feedbackTemplates: {
                    questions: [
                        'What were the employee\'s key achievements this year?',
                        'What are the employee\'s strengths?',
                        'What areas should the employee focus on improving?',
                        'How has the employee demonstrated company values?',
                        'What goals should be set for the next year?',
                    ],
                    ratingCategories: [
                        'Communication',
                        'Technical Skills',
                        'Teamwork',
                        'Leadership',
                        'Innovation',
                        'Quality of Work',
                        'Productivity',
                    ],
                },
            },
        ];
        const cycleEntities = cycles.map(cycle => this.feedbackCycleRepository.create(cycle));
        await this.feedbackCycleRepository.save(cycleEntities);
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(kpi_category_entity_1.KpiCategory)),
    __param(2, (0, typeorm_1.InjectRepository)(feedback_cycle_entity_1.FeedbackCycle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map