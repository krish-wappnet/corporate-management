import { FeedbackType } from '../entities/feedback.entity';
import { RequestStatus } from '../entities/feedback-request.entity';
export declare class CreateFeedbackRequestDto {
    type: FeedbackType;
    message?: string;
    dueDate: string;
    status?: RequestStatus;
    requesterId?: string;
    recipientId: string;
    subjectId: string;
    cycleId?: string;
    isAnonymous?: boolean;
}
