import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { PerformanceReview, ReviewStatus, ReviewType } from './entities/performance-review.entity';
import { ReviewComment } from './entities/review-comment.entity';
import { CreatePerformanceReviewDto } from './dtos/create-performance-review.dto';
import { UpdatePerformanceReviewDto } from './dtos/update-performance-review.dto';
import { CreateReviewCommentDto } from './dtos/create-review-comment.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(PerformanceReview)
    private performanceReviewRepository: Repository<PerformanceReview>,
    @InjectRepository(ReviewComment)
    private reviewCommentRepository: Repository<ReviewComment>,
    private usersService: UsersService,
  ) {}

  // Performance Review Methods
  async createReview(
    createReviewDto: CreatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    // Verify users exist
    await this.usersService.findOne(createReviewDto.employeeId);
    await this.usersService.findOne(createReviewDto.reviewerId);

    // Validate dates
    const periodStart = new Date(createReviewDto.periodStart);
    const periodEnd = new Date(createReviewDto.periodEnd);

    if (periodEnd <= periodStart) {
      throw new BadRequestException('Period end date must be after start date');
    }

    if (createReviewDto.dueDate) {
      const dueDate = new Date(createReviewDto.dueDate);
      const today = new Date();

      if (dueDate < today) {
        throw new BadRequestException('Due date must be in the future');
      }
    }

    // Create review entity
    const review = new PerformanceReview();
    review.title = createReviewDto.title;
    
    if (createReviewDto.description !== undefined) {
      review.description = createReviewDto.description;
    }
    
    review.type = createReviewDto.type || ReviewType.QUARTERLY;
    review.periodStart = periodStart;
    review.periodEnd = periodEnd;
    
    if (createReviewDto.dueDate) {
      review.dueDate = new Date(createReviewDto.dueDate);
    }
    
    review.status = createReviewDto.status || ReviewStatus.DRAFT;
    review.ratings = createReviewDto.ratings || {};
    
    if (createReviewDto.overallRating !== undefined) {
      review.overallRating = createReviewDto.overallRating;
    }
    
    if (createReviewDto.achievements) {
      review.achievements = createReviewDto.achievements;
    }
    
    if (createReviewDto.areasForImprovement) {
      review.areasForImprovement = createReviewDto.areasForImprovement;
    }
    
    if (createReviewDto.goalsForNextPeriod) {
      review.goalsForNextPeriod = createReviewDto.goalsForNextPeriod;
    }
    
    if (createReviewDto.additionalComments) {
      review.additionalComments = createReviewDto.additionalComments;
    }
    
    // Set employee and reviewer relations
    const employee = new User();
    employee.id = createReviewDto.employeeId;
    review.employee = employee;
    
    const reviewer = new User();
    reviewer.id = createReviewDto.reviewerId;
    review.reviewer = reviewer;

    return this.performanceReviewRepository.save(review);
  }

  async findAllReviews(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    filters?: {
      employeeId?: string;
      reviewerId?: string;
      status?: ReviewStatus;
      type?: ReviewType;
      periodStart?: Date;
      periodEnd?: Date;
      dueDate?: Date;
    },
  ): Promise<PaginationResponseDto<PerformanceReview>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const where: FindOptionsWhere<PerformanceReview> = {};

    // Apply filters
    if (filters?.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters?.reviewerId) {
      where.reviewerId = filters.reviewerId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.periodStart && filters?.periodEnd) {
      where.periodStart = Between(filters.periodStart, filters.periodEnd);
    }

    if (filters?.dueDate) {
      where.dueDate = LessThanOrEqual(filters.dueDate);
    }

    const [reviews, total] = await this.performanceReviewRepository.findAndCount({
      where,
      relations: ['employee', 'reviewer'],
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return new PaginationResponseDto(reviews, total, page, limit);
  }

  async findReviewById(id: string): Promise<PerformanceReview> {
    const review = await this.performanceReviewRepository.findOne({
      where: { id },
      relations: ['employee', 'reviewer', 'comments', 'comments.createdBy'],
    });

    if (!review) {
      throw new NotFoundException(`Performance Review with ID "${id}" not found`);
    }

    return review;
  }

  async updateReview(
    id: string,
    userId: string,
    updateReviewDto: UpdatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    const review = await this.findReviewById(id);

    // Verify user is the reviewer or has admin role
    if (review.reviewerId !== userId) {
      // TODO: Check if user has admin role
      throw new ForbiddenException('Not authorized to update this review');
    }

    // Validate dates if provided
    if (updateReviewDto.periodStart && updateReviewDto.periodEnd) {
      const periodStart = new Date(updateReviewDto.periodStart);
      const periodEnd = new Date(updateReviewDto.periodEnd);

      if (periodEnd <= periodStart) {
        throw new BadRequestException('Period end date must be after start date');
      }
    } else if (updateReviewDto.periodStart) {
      const periodStart = new Date(updateReviewDto.periodStart);
      const periodEnd = review.periodEnd;

      if (periodEnd <= periodStart) {
        throw new BadRequestException('Period end date must be after start date');
      }
    } else if (updateReviewDto.periodEnd) {
      const periodStart = review.periodStart;
      const periodEnd = new Date(updateReviewDto.periodEnd);

      if (periodEnd <= periodStart) {
        throw new BadRequestException('Period end date must be after start date');
      }
    }

    if (updateReviewDto.dueDate) {
      const dueDate = new Date(updateReviewDto.dueDate);
      const today = new Date();

      if (dueDate < today) {
        throw new BadRequestException('Due date must be in the future');
      }
    }

    // Verify employee exists if provided
    if (updateReviewDto.employeeId) {
      await this.usersService.findOne(updateReviewDto.employeeId);
    }

    // Verify reviewer exists if provided
    if (updateReviewDto.reviewerId) {
      await this.usersService.findOne(updateReviewDto.reviewerId);
    }

    // Update review
    const updatedReview = this.performanceReviewRepository.merge(review, {
      ...updateReviewDto,
      periodStart: updateReviewDto.periodStart
        ? new Date(updateReviewDto.periodStart)
        : review.periodStart,
      periodEnd: updateReviewDto.periodEnd
        ? new Date(updateReviewDto.periodEnd)
        : review.periodEnd,
      dueDate: updateReviewDto.dueDate
        ? new Date(updateReviewDto.dueDate)
        : review.dueDate,
    });

    return this.performanceReviewRepository.save(updatedReview);
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    const review = await this.findReviewById(id);

    // Verify user is the reviewer or has admin role
    if (review.reviewerId !== userId) {
      // TODO: Check if user has admin role
      throw new ForbiddenException('Not authorized to delete this review');
    }

    // Can only delete draft reviews
    if (review.status !== ReviewStatus.DRAFT) {
      throw new BadRequestException('Only draft reviews can be deleted');
    }

    await this.performanceReviewRepository.remove(review);
  }

  // Review Comment Methods
  async addComment(
    userId: string,
    createCommentDto: CreateReviewCommentDto,
  ): Promise<ReviewComment> {
    // Verify review exists
    const review = await this.findReviewById(createCommentDto.reviewId);

    // Verify user is involved in the review
    if (review.employeeId !== userId && review.reviewerId !== userId) {
      throw new ForbiddenException('Not authorized to comment on this review');
    }

    // Create comment
    const comment = this.reviewCommentRepository.create({
      ...createCommentDto,
      createdById: userId,
    });

    return this.reviewCommentRepository.save(comment);
  }

  async getReviewComments(reviewId: string): Promise<ReviewComment[]> {
    // Verify review exists
    await this.findReviewById(reviewId);

    // Get comments
    return this.reviewCommentRepository.find({
      where: { reviewId },
      relations: ['createdBy'],
      order: { createdAt: 'ASC' },
    });
  }

  // Update status methods
  async submitReview(id: string, userId: string): Promise<PerformanceReview> {
    const review = await this.findReviewById(id);

    // Verify user is the reviewer
    if (review.reviewerId !== userId) {
      throw new ForbiddenException('Not authorized to submit this review');
    }

    // Check if review is in draft state
    if (review.status !== ReviewStatus.DRAFT) {
      throw new BadRequestException('Only draft reviews can be submitted');
    }

    // Update status
    review.status = ReviewStatus.SUBMITTED;
    return this.performanceReviewRepository.save(review);
  }

  async acknowledgeReview(id: string, userId: string): Promise<PerformanceReview> {
    const review = await this.findReviewById(id);

    // Verify user is the employee
    if (review.employeeId !== userId) {
      throw new ForbiddenException('Not authorized to acknowledge this review');
    }

    // Check if review is in submitted state
    if (review.status !== ReviewStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted reviews can be acknowledged');
    }

    // Update status
    review.status = ReviewStatus.ACKNOWLEDGED;
    return this.performanceReviewRepository.save(review);
  }

  async finalizeReview(id: string, userId: string): Promise<PerformanceReview> {
    const review = await this.findReviewById(id);

    // Verify user is the reviewer
    if (review.reviewerId !== userId) {
      throw new ForbiddenException('Not authorized to finalize this review');
    }

    // Check if review is in acknowledged state
    if (review.status !== ReviewStatus.ACKNOWLEDGED) {
      throw new BadRequestException('Only acknowledged reviews can be finalized');
    }

    // Update status
    review.status = ReviewStatus.FINALIZED;
    return this.performanceReviewRepository.save(review);
  }

  // Analytics Methods
  async getUserPerformanceTrend(
    userId: string,
    period: { start: Date; end: Date },
  ): Promise<Array<{ period: string; rating: number }>> {
    // Verify user exists
    await this.usersService.findOne(userId);

    // Get all finalized reviews within the period
    const reviews = await this.performanceReviewRepository.find({
      where: {
        employeeId: userId,
        status: ReviewStatus.FINALIZED,
        periodEnd: Between(period.start, period.end),
      },
      select: ['periodEnd', 'overallRating', 'type'],
      order: { periodEnd: 'ASC' },
    });

    if (reviews.length === 0) {
      return [];
    }

    // Group by period (month/quarter/year) and calculate average
    const periodMap = new Map<string, { sum: number; count: number }>();

    reviews.forEach((review) => {
      const periodDate = review.periodEnd;
      let periodKey: string;

      // Format period key based on review type
      if (review.type === ReviewType.MONTHLY) {
        periodKey = `${periodDate.getFullYear()}-${(periodDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
      } else if (review.type === ReviewType.QUARTERLY) {
        const quarter = Math.floor(periodDate.getMonth() / 3) + 1;
        periodKey = `${periodDate.getFullYear()}-Q${quarter}`;
      } else {
        periodKey = periodDate.getFullYear().toString();
      }

      if (!periodMap.has(periodKey)) {
        periodMap.set(periodKey, { sum: 0, count: 0 });
      }

      const current = periodMap.get(periodKey);
      if (current) {
        current.sum += Number(review.overallRating);
        current.count += 1;
      }
    });

    // Convert map to array of period and average rating
    const result = Array.from(periodMap.entries()).map(([period, { sum, count }]) => ({
      period,
      rating: sum / count,
    }));

    return result;
  }

  async getDepartmentPerformance(): Promise<
    Array<{ department: string; avgRating: number; reviewCount: number }>
  > {
    const result = await this.performanceReviewRepository
      .createQueryBuilder('review')
      .leftJoin('users', 'user', 'review.employeeId = user.id')
      .select('user.department', 'department')
      .addSelect('AVG(review.overallRating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.status = :status', { status: ReviewStatus.FINALIZED })
      .andWhere('user.department IS NOT NULL')
      .groupBy('user.department')
      .getRawMany();

    return result.map((item) => ({
      department: item.department,
      avgRating: parseFloat(item.avgRating) || 0,
      reviewCount: parseInt(item.reviewCount, 10),
    }));
  }

  async getReviewsStatusSummary(): Promise<Record<ReviewStatus, number>> {
    const result = await this.performanceReviewRepository
      .createQueryBuilder('review')
      .select('review.status', 'status')
      .addSelect('COUNT(review.id)', 'count')
      .groupBy('review.status')
      .getRawMany();

    const summary = {} as Record<ReviewStatus, number>;
    
    // Initialize all statuses with 0
    Object.values(ReviewStatus).forEach((status) => {
      summary[status] = 0;
    });

    // Update with actual counts
    result.forEach((item) => {
      summary[item.status] = parseInt(item.count, 10);
    });

    return summary;
  }

  async getRatingDistribution(): Promise<Array<{ rating: number; count: number }>> {
    const result = await this.performanceReviewRepository
      .createQueryBuilder('review')
      .select('ROUND(review.overallRating, 0)', 'rating')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.overallRating IS NOT NULL')
      .groupBy('ROUND(review.overallRating, 0)')
      .orderBy('rating', 'ASC')
      .getRawMany();

    return result.map((item) => ({
      rating: parseInt(item.rating, 10),
      count: parseInt(item.count, 10),
    }));
  }
}