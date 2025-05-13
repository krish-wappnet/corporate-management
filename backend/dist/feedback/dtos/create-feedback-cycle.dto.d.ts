import { CycleStatus, CycleType } from '../entities/feedback-cycle.entity';
export declare class CreateFeedbackCycleDto {
    name: string;
    description?: string;
    type?: CycleType;
    startDate: string;
    endDate: string;
    status?: CycleStatus;
    feedbackTemplates?: any;
}
