import { PerformanceService } from './performance.service';
import { CreatePerformanceReviewDto } from './dtos/create-performance-review.dto';
import { UpdatePerformanceReviewDto } from './dtos/update-performance-review.dto';
import { CreateReviewCommentDto } from './dtos/create-review-comment.dto';
import { PerformanceReview, ReviewStatus, ReviewType } from './entities/performance-review.entity';
import { ReviewComment } from './entities/review-comment.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
export declare class PerformanceController {
    private readonly performanceService;
    constructor(performanceService: PerformanceService);
    createReview(createReviewDto: CreatePerformanceReviewDto): Promise<PerformanceReview>;
    findAllReviews(paginationDto: PaginationDto, employeeId?: string, reviewerId?: string, status?: ReviewStatus, type?: ReviewType, periodStart?: string, periodEnd?: string, dueDate?: string): Promise<PaginationResponseDto<PerformanceReview>>;
    findOneReview(id: string): Promise<PerformanceReview>;
    updateReview(req: any, id: string, updateReviewDto: UpdatePerformanceReviewDto): Promise<PerformanceReview>;
    removeReview(req: any, id: string): Promise<void>;
    submitReview(req: any, id: string): Promise<PerformanceReview>;
    acknowledgeReview(req: any, id: string): Promise<PerformanceReview>;
    finalizeReview(req: any, id: string): Promise<PerformanceReview>;
    addComment(req: any, createCommentDto: CreateReviewCommentDto): Promise<ReviewComment>;
    getReviewComments(id: string): Promise<ReviewComment[]>;
    getUserPerformanceTrend(userId: string, startDate: string, endDate: string): Promise<Array<{
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
