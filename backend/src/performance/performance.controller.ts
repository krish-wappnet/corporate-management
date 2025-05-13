import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { PerformanceService } from './performance.service';
import { CreatePerformanceReviewDto } from './dtos/create-performance-review.dto';
import { UpdatePerformanceReviewDto } from './dtos/update-performance-review.dto';
import { CreateReviewCommentDto } from './dtos/create-review-comment.dto';
import { PerformanceReview, ReviewStatus, ReviewType } from './entities/performance-review.entity';
import { ReviewComment } from './entities/review-comment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';

@ApiTags('performance')
@Controller('performance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // Performance Review Endpoints
  @Post('reviews')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new performance review' })
  @ApiResponse({ status: 201, description: 'Performance review created successfully', type: PerformanceReview })
  createReview(
    @Body() createReviewDto: CreatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    return this.performanceService.createReview(createReviewDto);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get all performance reviews with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of performance reviews retrieved successfully' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'reviewerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ReviewStatus })
  @ApiQuery({ name: 'type', required: false, enum: ReviewType })
  @ApiQuery({ name: 'periodStart', required: false })
  @ApiQuery({ name: 'periodEnd', required: false })
  @ApiQuery({ name: 'dueDate', required: false })
  findAllReviews(
    @Query() paginationDto: PaginationDto,
    @Query('employeeId') employeeId?: string,
    @Query('reviewerId') reviewerId?: string,
    @Query('status') status?: ReviewStatus,
    @Query('type') type?: ReviewType,
    @Query('periodStart') periodStart?: string,
    @Query('periodEnd') periodEnd?: string,
    @Query('dueDate') dueDate?: string,
  ): Promise<PaginationResponseDto<PerformanceReview>> {
    const filters = {
      employeeId,
      reviewerId,
      status,
      type,
      periodStart: periodStart ? new Date(periodStart) : undefined,
      periodEnd: periodEnd ? new Date(periodEnd) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    return this.performanceService.findAllReviews(paginationDto, filters);
  }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Get a performance review by ID' })
  @ApiResponse({ status: 200, description: 'Performance review retrieved successfully', type: PerformanceReview })
  @ApiResponse({ status: 404, description: 'Performance review not found' })
  findOneReview(@Param('id') id: string): Promise<PerformanceReview> {
    return this.performanceService.findReviewById(id);
  }

  @Patch('reviews/:id')
  @ApiOperation({ summary: 'Update a performance review' })
  @ApiResponse({ status: 200, description: 'Performance review updated successfully', type: PerformanceReview })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Performance review not found' })
  updateReview(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    return this.performanceService.updateReview(id, req.user.userId, updateReviewDto);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete a performance review' })
  @ApiResponse({ status: 200, description: 'Performance review deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Performance review not found' })
  removeReview(@Request() req, @Param('id') id: string): Promise<void> {
    return this.performanceService.deleteReview(id, req.user.userId);
  }

  // Review Status Update Endpoints
  @Post('reviews/:id/submit')
  @ApiOperation({ summary: 'Submit a performance review' })
  @ApiResponse({ status: 200, description: 'Performance review submitted successfully', type: PerformanceReview })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Performance review not found' })
  submitReview(
    @Request() req,
    @Param('id') id: string,
  ): Promise<PerformanceReview> {
    return this.performanceService.submitReview(id, req.user.userId);
  }

  @Post('reviews/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge a performance review' })
  @ApiResponse({ status: 200, description: 'Performance review acknowledged successfully', type: PerformanceReview })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Performance review not found' })
  acknowledgeReview(
    @Request() req,
    @Param('id') id: string,
  ): Promise<PerformanceReview> {
    return this.performanceService.acknowledgeReview(id, req.user.userId);
  }

  @Post('reviews/:id/finalize')
  @ApiOperation({ summary: 'Finalize a performance review' })
  @ApiResponse({ status: 200, description: 'Performance review finalized successfully', type: PerformanceReview })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Performance review not found' })
  finalizeReview(
    @Request() req,
    @Param('id') id: string,
  ): Promise<PerformanceReview> {
    return this.performanceService.finalizeReview(id, req.user.userId);
  }

  // Review Comment Endpoints
  @Post('comments')
  @ApiOperation({ summary: 'Add a comment to a performance review' })
  @ApiResponse({ status: 201, description: 'Comment added successfully', type: ReviewComment })
  addComment(
    @Request() req,
    @Body() createCommentDto: CreateReviewCommentDto,
  ): Promise<ReviewComment> {
    return this.performanceService.addComment(req.user.userId, createCommentDto);
  }

  @Get('reviews/:id/comments')
  @ApiOperation({ summary: 'Get all comments for a performance review' })
  @ApiResponse({ status: 200, description: 'List of comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Performance review not found' })
  getReviewComments(@Param('id') id: string): Promise<ReviewComment[]> {
    return this.performanceService.getReviewComments(id);
  }

  // Analytics Endpoints
  @Get('analytics/user-trend/:userId')
  @ApiOperation({ summary: 'Get performance trend for a user' })
  @ApiResponse({ status: 200, description: 'Performance trend retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  getUserPerformanceTrend(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Array<{ period: string; rating: number }>> {
    return this.performanceService.getUserPerformanceTrend(
      userId,
      {
        start: new Date(startDate),
        end: new Date(endDate),
      },
    );
  }

  @Get('analytics/department-performance')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get performance by department' })
  @ApiResponse({ status: 200, description: 'Department performance retrieved successfully' })
  getDepartmentPerformance(): Promise<
    Array<{ department: string; avgRating: number; reviewCount: number }>
  > {
    return this.performanceService.getDepartmentPerformance();
  }

  @Get('analytics/status-summary')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get review status summary' })
  @ApiResponse({ status: 200, description: 'Review status summary retrieved successfully' })
  getReviewsStatusSummary(): Promise<Record<ReviewStatus, number>> {
    return this.performanceService.getReviewsStatusSummary();
  }

  @Get('analytics/rating-distribution')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get rating distribution' })
  @ApiResponse({ status: 200, description: 'Rating distribution retrieved successfully' })
  getRatingDistribution(): Promise<Array<{ rating: number; count: number }>> {
    return this.performanceService.getRatingDistribution();
  }
}