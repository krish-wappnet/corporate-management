import { Repository } from 'typeorm';
import { PerformanceReview, ReviewStatus, ReviewType } from './entities/performance-review.entity';
import { ReviewComment } from './entities/review-comment.entity';
import { CreatePerformanceReviewDto } from './dtos/create-performance-review.dto';
import { UpdatePerformanceReviewDto } from './dtos/update-performance-review.dto';
import { CreateReviewCommentDto } from './dtos/create-review-comment.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { UsersService } from '../users/users.service';
export declare class PerformanceService {
    private performanceReviewRepository;
    private reviewCommentRepository;
    private usersService;
    constructor(performanceReviewRepository: Repository<PerformanceReview>, reviewCommentRepository: Repository<ReviewComment>, usersService: UsersService);
    createReview(createReviewDto: CreatePerformanceReviewDto): Promise<PerformanceReview>;
    findAllReviews(paginationDto?: PaginationDto, filters?: {
        employeeId?: string;
        reviewerId?: string;
        status?: ReviewStatus;
        type?: ReviewType;
        periodStart?: Date;
        periodEnd?: Date;
        dueDate?: Date;
    }): Promise<PaginationResponseDto<PerformanceReview>>;
    findReviewById(id: string): Promise<PerformanceReview>;
    updateReview(id: string, userId: string, updateReviewDto: UpdatePerformanceReviewDto): Promise<PerformanceReview>;
    deleteReview(id: string, userId: string): Promise<void>;
    addComment(userId: string, createCommentDto: CreateReviewCommentDto): Promise<ReviewComment>;
    getReviewComments(reviewId: string): Promise<ReviewComment[]>;
    submitReview(id: string, userId: string): Promise<PerformanceReview>;
    acknowledgeReview(id: string, userId: string): Promise<PerformanceReview>;
    finalizeReview(id: string, userId: string): Promise<PerformanceReview>;
    getUserPerformanceTrend(userId: string, period: {
        start: Date;
        end: Date;
    }): Promise<Array<{
        period: string;
        rating: number;
    }>>;
    getDepartmentPerformance(): Promise<Array<{
        department: string;
        avgRating: number;
        reviewCount: number;
    }>>;
    getReviewsStatusSummary(): Promise<Record<ReviewStatus, number>>;
    getRatingDistribution(): Promise<Array<{
        rating: number;
        count: number;
    }>>;
}
