import { FeedbackType, FeedbackStatus } from '../entities/feedback.entity';
export declare class UpdateFeedbackDto {
    type?: FeedbackType;
    content?: string;
    ratings?: Record<string, number>;
    strengths?: string;
    improvements?: string;
    status?: FeedbackStatus;
    cycleId?: string;
    toUserId?: string;
    isAnonymous?: boolean;
}
