import { User } from '../../users/entities/user.entity';
export declare enum FeedbackType {
    PEER = "peer",
    MANAGER = "manager",
    SELF = "self",
    UPWARD = "upward",
    THREE_SIXTY = "360"
}
export declare enum FeedbackStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    ACKNOWLEDGED = "acknowledged"
}
export declare class Feedback {
    id: string;
    type: FeedbackType;
    content: string;
    ratings: Record<string, number>;
    strengths: string;
    improvements: string;
    status: FeedbackStatus;
    cycleId: string;
    fromUser: User;
    fromUserId: string;
    toUser: User;
    toUserId: string;
    requestId: string;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
}
