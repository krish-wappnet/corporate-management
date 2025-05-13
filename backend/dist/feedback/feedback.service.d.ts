import { Repository } from 'typeorm';
import { Feedback, FeedbackStatus, FeedbackType } from './entities/feedback.entity';
import { FeedbackCycle, CycleStatus } from './entities/feedback-cycle.entity';
import { FeedbackRequest, RequestStatus } from './entities/feedback-request.entity';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { UpdateFeedbackDto } from './dtos/update-feedback.dto';
import { CreateFeedbackCycleDto } from './dtos/create-feedback-cycle.dto';
import { UpdateFeedbackCycleDto } from './dtos/update-feedback-cycle.dto';
import { CreateFeedbackRequestDto } from './dtos/create-feedback-request.dto';
import { UpdateFeedbackRequestDto } from './dtos/update-feedback-request.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { UsersService } from '../users/users.service';
export declare class FeedbackService {
    private feedbackRepository;
    private feedbackCycleRepository;
    private feedbackRequestRepository;
    private usersService;
    constructor(feedbackRepository: Repository<Feedback>, feedbackCycleRepository: Repository<FeedbackCycle>, feedbackRequestRepository: Repository<FeedbackRequest>, usersService: UsersService);
    createFeedback(userId: string, createFeedbackDto: CreateFeedbackDto): Promise<Feedback>;
    findAllFeedback(paginationDto?: PaginationDto, filters?: {
        fromUserId?: string;
        toUserId?: string;
        type?: FeedbackType;
        status?: FeedbackStatus;
        cycleId?: string;
    }): Promise<PaginationResponseDto<Feedback>>;
    findFeedbackById(id: string, userId?: string): Promise<Feedback>;
    anonymizeFeedback(feedback: Feedback): Promise<Feedback>;
    updateFeedback(id: string, userId: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback>;
    deleteFeedback(id: string, userId: string): Promise<void>;
    createCycle(createCycleDto: CreateFeedbackCycleDto): Promise<FeedbackCycle>;
    getFeedbackCycles(paginationDto?: PaginationDto, filters?: {
        status?: CycleStatus;
        type?: string;
        active?: boolean;
    }): Promise<PaginationResponseDto<FeedbackCycle>>;
    findCycleById(id: string): Promise<FeedbackCycle>;
    updateCycle(id: string, updateCycleDto: UpdateFeedbackCycleDto): Promise<FeedbackCycle>;
    deleteCycle(id: string): Promise<void>;
    createRequest(userId: string, createRequestDto: CreateFeedbackRequestDto): Promise<FeedbackRequest>;
    getFeedbackRequests(userId: string, paginationDto?: PaginationDto, filters?: {
        status?: RequestStatus;
        cycleId?: string;
        requesterId?: string;
        recipientId?: string;
        subjectId?: string;
    }): Promise<PaginationResponseDto<FeedbackRequest>>;
    findRequestById(id: string): Promise<FeedbackRequest>;
    updateRequest(id: string, userId: string, updateRequestDto: UpdateFeedbackRequestDto): Promise<FeedbackRequest>;
    respondToRequest(id: string, userId: string, accept: boolean): Promise<FeedbackRequest>;
    deleteRequest(id: string, userId: string): Promise<void>;
    generate360FeedbackRequests(cycleId: string, userId: string, recipientIds: string[]): Promise<FeedbackRequest[]>;
    getFeedbackStats(userId?: string): Promise<{
        total: number;
        pending: number;
        completed: number;
        categories: Record<string, number>;
    }>;
    getAverageFeedbackRatings(userId: string): Promise<Record<string, number>>;
    get360FeedbackSummary(userId: string, cycleId?: string): Promise<{
        averageRatings: Record<string, number>;
        strengthsSummary: string[];
        improvementsSummary: string[];
        feedbackCount: number;
    }>;
}
