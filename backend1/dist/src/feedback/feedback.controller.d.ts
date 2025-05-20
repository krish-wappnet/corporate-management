import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { UpdateFeedbackDto } from './dtos/update-feedback.dto';
import { CreateFeedbackCycleDto } from './dtos/create-feedback-cycle.dto';
import { UpdateFeedbackCycleDto } from './dtos/update-feedback-cycle.dto';
import { CreateFeedbackRequestDto } from './dtos/create-feedback-request.dto';
import { UpdateFeedbackRequestDto } from './dtos/update-feedback-request.dto';
import { Feedback, FeedbackStatus, FeedbackType } from './entities/feedback.entity';
import { FeedbackCycle, CycleStatus } from './entities/feedback-cycle.entity';
import { FeedbackRequest, RequestStatus } from './entities/feedback-request.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    findAllCycles(paginationDto: PaginationDto, status?: CycleStatus, type?: string, active?: boolean | string): Promise<PaginationResponseDto<FeedbackCycle>>;
    findAllRequests(req: any, paginationDto: PaginationDto, requesterId?: string, recipientId?: string, subjectId?: string, status?: RequestStatus, cycleId?: string): Promise<PaginationResponseDto<FeedbackRequest>>;
    createRequest(req: any, createRequestDto: CreateFeedbackRequestDto): Promise<FeedbackRequest>;
    createFeedback(req: any, createFeedbackDto: CreateFeedbackDto): Promise<Feedback>;
    findAllFeedback(paginationDto: PaginationDto, fromUserId?: string, toUserId?: string, type?: FeedbackType, status?: FeedbackStatus, cycleId?: string): Promise<PaginationResponseDto<Feedback>>;
    findOneFeedback(req: any, id: string): Promise<Feedback>;
    updateFeedback(req: any, id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback>;
    removeFeedback(req: any, id: string): Promise<void>;
    createCycle(createCycleDto: CreateFeedbackCycleDto): Promise<FeedbackCycle>;
    findOneCycle(id: string): Promise<FeedbackCycle>;
    updateCycle(id: string, updateCycleDto: UpdateFeedbackCycleDto): Promise<FeedbackCycle>;
    removeCycle(id: string): Promise<void>;
    findOneRequest(id: string): Promise<FeedbackRequest>;
    updateRequest(req: any, id: string, updateRequestDto: UpdateFeedbackRequestDto): Promise<FeedbackRequest>;
    respondToRequest(req: any, id: string, accept: boolean): Promise<FeedbackRequest>;
    removeRequest(req: any, id: string): Promise<void>;
    generate360Feedback(userId: string, cycleId: string, body: {
        recipientIds: string[];
    }): Promise<FeedbackRequest[]>;
}
