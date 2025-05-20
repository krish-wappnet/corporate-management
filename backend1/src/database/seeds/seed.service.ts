import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import { KpiCategory } from '../../kpis/entities/kpi-category.entity';
import { FeedbackCycle, CycleType, CycleStatus } from '../../feedback/entities/feedback-cycle.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(KpiCategory)
    private kpiCategoryRepository: Repository<KpiCategory>,
    @InjectRepository(FeedbackCycle)
    private feedbackCycleRepository: Repository<FeedbackCycle>,
  ) {}

  async seed(): Promise<void> {
    await this.seedUsers();
    await this.seedKpiCategories();
    await this.seedFeedbackCycles();
  }

  private async seedUsers(): Promise<void> {
    const userCount = await this.usersRepository.count();
    
    if (userCount > 0) {
      return;
    }

    const salt = await bcrypt.genSalt();
    const adminPassword = await bcrypt.hash('admin123', salt);
    const managerPassword = await bcrypt.hash('manager123', salt);
    const employeePassword = await bcrypt.hash('employee123', salt);

    // Create admin
    const admin = this.usersRepository.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminPassword,
      roles: [Role.ADMIN],
      position: 'System Administrator',
      department: 'IT',
    });

    const savedAdmin = await this.usersRepository.save(admin);

    // Create manager
    const manager = this.usersRepository.create({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@example.com',
      password: managerPassword,
      roles: [Role.MANAGER],
      position: 'Department Manager',
      department: 'Engineering',
    });

    const savedManager = await this.usersRepository.save(manager);

    // Create employees
    const employee1 = this.usersRepository.create({
      firstName: 'Employee',
      lastName: 'One',
      email: 'employee1@example.com',
      password: employeePassword,
      roles: [Role.EMPLOYEE],
      position: 'Software Engineer',
      department: 'Engineering',
      managerId: savedManager.id,
    });

    const employee2 = this.usersRepository.create({
      firstName: 'Employee',
      lastName: 'Two',
      email: 'employee2@example.com',
      password: employeePassword,
      roles: [Role.EMPLOYEE],
      position: 'QA Engineer',
      department: 'Engineering',
      managerId: savedManager.id,
    });

    // Set managerId for employees
    employee1.managerId = savedManager.id;
    employee2.managerId = savedManager.id;
    await this.usersRepository.save([employee1, employee2]);
  }

  private async seedKpiCategories(): Promise<void> {
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

    const categoryEntities = categories.map(category =>
      this.kpiCategoryRepository.create(category),
    );

    await this.kpiCategoryRepository.save(categoryEntities);
  }

  private async seedFeedbackCycles(): Promise<void> {
    const cycleCount = await this.feedbackCycleRepository.count();
    
    if (cycleCount > 0) {
      return;
    }

    const currentYear = new Date().getFullYear();
    
    const q1Start = new Date(currentYear, 0, 1); // Jan 1
    const q1End = new Date(currentYear, 2, 31); // Mar 31
    
    const q2Start = new Date(currentYear, 3, 1); // Apr 1
    const q2End = new Date(currentYear, 5, 30); // Jun 30
    
    const annualStart = new Date(currentYear, 0, 1); // Jan 1
    const annualEnd = new Date(currentYear, 11, 31); // Dec 31

    const cycles = [
      {
        name: `Q1 ${currentYear} Feedback Cycle`,
        description: `Quarterly feedback cycle for Q1 ${currentYear}`,
        type: CycleType.QUARTERLY,
        startDate: q1Start,
        endDate: q1End,
        status: CycleStatus.COMPLETED,
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
        type: CycleType.QUARTERLY,
        startDate: q2Start,
        endDate: q2End,
        status: CycleStatus.ACTIVE,
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
        type: CycleType.ANNUAL,
        startDate: annualStart,
        endDate: annualEnd,
        status: CycleStatus.ACTIVE,
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

    const cycleEntities = cycles.map(cycle =>
      this.feedbackCycleRepository.create(cycle),
    );

    await this.feedbackCycleRepository.save(cycleEntities);
  }
}