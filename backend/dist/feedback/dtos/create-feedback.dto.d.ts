import { FeedbackType, FeedbackStatus } from '../entities/feedback.entity';
export declare class CreateFeedbackDto {
    type: FeedbackType;
    content: string;
    ratings?: Record<string, number>;
    strengths?: string;
    improvements?: string;
    status?: FeedbackStatus;
    cycleId?: string;
    toUserId: string;
    requestId?: string;
    isAnonymous?: boolean;
}
