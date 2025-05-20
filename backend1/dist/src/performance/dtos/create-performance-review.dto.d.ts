import { ReviewStatus, ReviewType } from '../entities/performance-review.entity';
export declare class CreatePerformanceReviewDto {
    title: string;
    description?: string;
    type?: ReviewType;
    periodStart: string;
    periodEnd: string;
    dueDate?: string;
    status?: ReviewStatus;
    ratings?: Record<string, number>;
    overallRating?: number;
    achievements?: string;
    areasForImprovement?: string;
    goalsForNextPeriod?: string;
    additionalComments?: string;
    employeeId: string;
    reviewerId: string;
}
