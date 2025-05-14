import { Role } from '../../common/enums/role.enum';
import { Kpi } from '../../kpis/entities/kpi.entity';
import { Okr } from '../../okrs/entities/okr.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { PerformanceReview } from '../../performance/entities/performance-review.entity';
import { Department } from '../../departments/entities/department.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: Role[];
    position: string;
    department: string;
    managerId: string | null;
    kpis: Kpi[];
    okrs: Okr[];
    givenFeedback: Feedback[];
    receivedFeedback: Feedback[];
    performanceReviews: PerformanceReview[];
    reviewsGiven: PerformanceReview[];
    managedDepartments: Department[];
    createdAt: Date;
    updatedAt: Date;
}
