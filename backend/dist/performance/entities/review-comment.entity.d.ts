import { User } from '../../users/entities/user.entity';
import { PerformanceReview } from './performance-review.entity';
export declare class ReviewComment {
    id: string;
    content: string;
    review: PerformanceReview;
    reviewId: string;
    createdBy: User;
    createdById: string;
    createdAt: Date;
}
