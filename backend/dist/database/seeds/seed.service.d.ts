import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { KpiCategory } from '../../kpis/entities/kpi-category.entity';
import { FeedbackCycle } from '../../feedback/entities/feedback-cycle.entity';
export declare class SeedService {
    private usersRepository;
    private kpiCategoryRepository;
    private feedbackCycleRepository;
    constructor(usersRepository: Repository<User>, kpiCategoryRepository: Repository<KpiCategory>, feedbackCycleRepository: Repository<FeedbackCycle>);
    seed(): Promise<void>;
    private seedUsers;
    private seedKpiCategories;
    private seedFeedbackCycles;
}
