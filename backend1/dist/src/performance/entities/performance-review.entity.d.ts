import { User } from '../../users/entities/user.entity';
import { ReviewComment } from './review-comment.entity';
export declare enum ReviewStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    ACKNOWLEDGED = "acknowledged",
    FINALIZED = "finalized"
}
export declare enum ReviewType {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    ANNUAL = "annual",
    CUSTOM = "custom"
}
export declare class PerformanceReview {
    id: string;
    title: string;
    description: string;
    type: ReviewType;
    periodStart: Date;
    periodEnd: Date;
    dueDate: Date;
    status: ReviewStatus;
    ratings: Record<string, number>;
    overallRating: number;
    achievements: string;
    areasForImprovement: string;
    goalsForNextPeriod: string;
    additionalComments: string;
    employee: User;
    employeeId: string;
    reviewer: User;
    reviewerId: string;
    comments: ReviewComment[];
    createdAt: Date;
    updatedAt: Date;
}
