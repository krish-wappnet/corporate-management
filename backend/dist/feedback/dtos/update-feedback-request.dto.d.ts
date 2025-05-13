import { RequestStatus } from '../entities/feedback-request.entity';
export declare class UpdateFeedbackRequestDto {
    message?: string;
    dueDate?: string;
    status?: RequestStatus;
    recipientId?: string;
    isAnonymous?: boolean;
}
