import { User } from '../../users/entities/user.entity';
import { FeedbackCycle } from './feedback-cycle.entity';
import { FeedbackType } from './feedback.entity';
export declare enum RequestStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    DECLINED = "declined",
    EXPIRED = "expired"
}
export declare class FeedbackRequest {
    id: string;
    type: FeedbackType;
    message: string;
    dueDate: Date;
    status: RequestStatus;
    requester: User;
    requesterId: string;
    recipient: User;
    recipientId: string;
    subject: User;
    subjectId: string;
    cycle: FeedbackCycle;
    cycleId: string;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
}
