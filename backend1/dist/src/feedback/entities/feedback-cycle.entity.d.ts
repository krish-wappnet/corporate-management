import { Feedback } from './feedback.entity';
import { FeedbackRequest } from './feedback-request.entity';
export declare enum CycleStatus {
    PLANNED = "planned",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum CycleType {
    QUARTERLY = "quarterly",
    ANNUAL = "annual",
    MONTHLY = "monthly",
    CUSTOM = "custom",
    THREE_SIXTY = "360"
}
export declare class FeedbackCycle {
    id: string;
    name: string;
    description: string;
    type: CycleType;
    startDate: Date;
    endDate: Date;
    status: CycleStatus;
    feedbackTemplates: any;
    feedback: Feedback[];
    requests: FeedbackRequest[];
    createdAt: Date;
    updatedAt: Date;
}
