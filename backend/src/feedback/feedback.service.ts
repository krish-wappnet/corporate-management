import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, IsNull, Not } from 'typeorm';
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

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(FeedbackCycle)
    private feedbackCycleRepository: Repository<FeedbackCycle>,
    @InjectRepository(FeedbackRequest)
    private feedbackRequestRepository: Repository<FeedbackRequest>,
    private usersService: UsersService,
  ) {}

  // Feedback Methods
  async createFeedback(
    userId: string,
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    // Verify users exist
    await this.usersService.findOne(createFeedbackDto.toUserId);

    // Verify cycle exists if provided
    if (createFeedbackDto.cycleId) {
      await this.findCycleById(createFeedbackDto.cycleId);
    }

    // Verify request exists if provided
    if (createFeedbackDto.requestId) {
      const request = await this.findRequestById(createFeedbackDto.requestId);
      
      // Check if user is authorized to respond to this request
      if (request.recipientId !== userId) {
        throw new ForbiddenException('Not authorized to respond to this feedback request');
      }

      // Update request status if submitting
      if (createFeedbackDto.status === FeedbackStatus.SUBMITTED) {
        await this.feedbackRequestRepository.update(request.id, {
          status: RequestStatus.COMPLETED,
        });
      }
    }

    // Create feedback
    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      fromUserId: userId,
    });

    return this.feedbackRepository.save(feedback);
  }

  async findAllFeedback(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    filters: {
      fromUserId?: string;
      toUserId?: string;
      type?: FeedbackType;
      status?: FeedbackStatus;
      cycleId?: string;
    } = {},
  ): Promise<PaginationResponseDto<Feedback>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const where: FindOptionsWhere<Feedback> = {};

    // Apply filters
    if (filters?.fromUserId) {
      where.fromUserId = filters.fromUserId;
    }

    if (filters?.toUserId) {
      where.toUserId = filters.toUserId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.cycleId) {
      where.cycleId = filters.cycleId;
    }

    const [feedback, total] = await this.feedbackRepository.findAndCount({
      where,
      relations: ['fromUser', 'toUser'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Handle anonymity - remove fromUser details if feedback is anonymous
    const processedFeedback = feedback.map(item => {
      if (item.isAnonymous) {
        const { fromUser, ...rest } = item as any;
        return {
          ...rest,
          fromUserId: undefined,
          fromUser: undefined
        } as unknown as Feedback;
      }
      return item;
    });

    return new PaginationResponseDto(processedFeedback, total, page, limit);
  }

  async findFeedbackById(id: string, userId?: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['fromUser', 'toUser'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }

    // Handle anonymity - remove fromUser details if feedback is anonymous
    // and the requesting user is not the author
    if (feedback.isAnonymous && userId !== feedback.fromUserId) {
      const anonymizedFeedback = await this.anonymizeFeedback(feedback);
      return anonymizedFeedback;
    }

    return feedback;
  }

  async anonymizeFeedback(feedback: Feedback): Promise<Feedback> {
    const { fromUser, ...rest } = feedback as any;
    const updatedFeedback = {
      ...rest,
      fromUser: undefined,
      fromUserId: undefined
    };
    return this.feedbackRepository.save(updatedFeedback as Feedback);
  }

  async updateFeedback(
    id: string,
    userId: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }

    // Verify user is the author of the feedback
    if (feedback.fromUserId !== userId) {
      throw new ForbiddenException('Not authorized to update this feedback');
    }

    // Verify cannot update once submitted, unless to acknowledge
    if (
      feedback.status === FeedbackStatus.SUBMITTED &&
      updateFeedbackDto.status !== FeedbackStatus.ACKNOWLEDGED
    ) {
      throw new BadRequestException('Cannot update submitted feedback');
    }

    // Update feedback
    const updatedFeedback = this.feedbackRepository.merge(feedback, updateFeedbackDto);
    return this.feedbackRepository.save(updatedFeedback);
  }

  async deleteFeedback(id: string, userId: string): Promise<void> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }

    // Verify user is the author of the feedback and it's a draft
    if (feedback.fromUserId !== userId) {
      throw new ForbiddenException('Not authorized to delete this feedback');
    }

    if (feedback.status !== FeedbackStatus.DRAFT) {
      throw new BadRequestException('Only draft feedback can be deleted');
    }

    await this.feedbackRepository.remove(feedback);
  }

  // Feedback Cycle Methods
  async createCycle(
    createCycleDto: CreateFeedbackCycleDto,
  ): Promise<FeedbackCycle> {
    // Validate dates
    const startDate = new Date(createCycleDto.startDate);
    const endDate = new Date(createCycleDto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Create cycle
    const cycle = this.feedbackCycleRepository.create({
      ...createCycleDto,
      startDate,
      endDate,
    });

    return this.feedbackCycleRepository.save(cycle);
  }

  async getFeedbackCycles(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    filters: {
      status?: CycleStatus;
      type?: string;
      active?: boolean;
    } = {},
  ): Promise<PaginationResponseDto<FeedbackCycle>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const where: FindOptionsWhere<FeedbackCycle> = {};

    // Apply filters
    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.type = filters.type as any;
    }

    if (filters?.active) {
      const today = new Date();
      where.startDate = LessThanOrEqual(today);
      where.endDate = MoreThanOrEqual(today);
      where.status = CycleStatus.ACTIVE;
    }

    const [cycles, total] = await this.feedbackCycleRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { startDate: 'DESC' },
    });

    return new PaginationResponseDto(cycles, total, page, limit);
  }

  async findCycleById(id: string): Promise<FeedbackCycle> {
    const cycle = await this.feedbackCycleRepository.findOne({
      where: { id },
      relations: ['requests', 'requests.requester', 'requests.recipient', 'requests.subject'],
    });

    if (!cycle) {
      throw new NotFoundException(`Feedback Cycle with ID "${id}" not found`);
    }

    return cycle;
  }

  async updateCycle(
    id: string,
    updateCycleDto: UpdateFeedbackCycleDto,
  ): Promise<FeedbackCycle> {
    const cycle = await this.findCycleById(id);

    // Validate dates if both are provided
    if (updateCycleDto.startDate && updateCycleDto.endDate) {
      const startDate = new Date(updateCycleDto.startDate);
      const endDate = new Date(updateCycleDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    } else if (updateCycleDto.startDate) {
      const startDate = new Date(updateCycleDto.startDate);
      const endDate = cycle.endDate;

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    } else if (updateCycleDto.endDate) {
      const startDate = cycle.startDate;
      const endDate = new Date(updateCycleDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Update cycle
    const updatedCycle = this.feedbackCycleRepository.merge(cycle, {
      ...updateCycleDto,
      startDate: updateCycleDto.startDate
        ? new Date(updateCycleDto.startDate)
        : cycle.startDate,
      endDate: updateCycleDto.endDate ? new Date(updateCycleDto.endDate) : cycle.endDate,
    });

    return this.feedbackCycleRepository.save(updatedCycle);
  }

  async deleteCycle(id: string): Promise<void> {
    const cycle = await this.findCycleById(id);

    // Check if there's any feedback associated with this cycle
    const hasFeedback = await this.feedbackRepository.findOne({
      where: { cycleId: id },
    });

    if (hasFeedback) {
      throw new BadRequestException(
        'Cannot delete cycle with associated feedback. Change status to cancelled instead.',
      );
    }

    await this.feedbackCycleRepository.remove(cycle);
  }

  // Feedback Request Methods
  async createRequest(
    userId: string,
    createRequestDto: CreateFeedbackRequestDto,
  ): Promise<FeedbackRequest> {
    // Verify users exist
    await this.usersService.findOne(createRequestDto.recipientId);
    await this.usersService.findOne(createRequestDto.subjectId);

    // Verify cycle exists if provided
    if (createRequestDto.cycleId) {
      await this.findCycleById(createRequestDto.cycleId);
    }

    // Validate due date
    const dueDate = new Date(createRequestDto.dueDate);
    const today = new Date();

    if (dueDate <= today) {
      throw new BadRequestException('Due date must be in the future');
    }

    // Create request
    const request = this.feedbackRequestRepository.create({
      ...createRequestDto,
      requesterId: createRequestDto.requesterId || userId,
    });

    return this.feedbackRequestRepository.save(request);
  }

  async getFeedbackRequests(
    userId: string,
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    filters: {
      status?: RequestStatus;
      cycleId?: string;
      requesterId?: string;
      recipientId?: string;
      subjectId?: string;
    } = {},
  ): Promise<PaginationResponseDto<FeedbackRequest>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const where: FindOptionsWhere<FeedbackRequest> = {};

    // Apply filters
    if (filters?.requesterId) {
      where.requesterId = filters.requesterId;
    }

    if (filters?.recipientId) {
      where.recipientId = filters.recipientId;
    }

    if (filters?.subjectId) {
      where.subjectId = filters.subjectId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.cycleId) {
      where.cycleId = filters.cycleId;
    }

    const [requests, total] = await this.feedbackRequestRepository.findAndCount({
      where,
      relations: ['requester', 'recipient', 'subject', 'cycle'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return new PaginationResponseDto(requests, total, page, limit);
  }

  async findRequestById(id: string): Promise<FeedbackRequest> {
    const request = await this.feedbackRequestRepository.findOne({
      where: { id },
      relations: ['requester', 'recipient', 'subject', 'cycle'],
    });

    if (!request) {
      throw new NotFoundException(`Feedback Request with ID "${id}" not found`);
    }

    return request;
  }

  async updateRequest(
    id: string,
    userId: string,
    updateRequestDto: UpdateFeedbackRequestDto,
  ): Promise<FeedbackRequest> {
    const request = await this.findRequestById(id);

    // Verify user is the requester
    if (request.requesterId !== userId) {
      throw new ForbiddenException('Not authorized to update this request');
    }

    // Verify recipient exists if provided
    if (updateRequestDto.recipientId) {
      await this.usersService.findOne(updateRequestDto.recipientId);
    }

    // Validate due date if provided
    if (updateRequestDto.dueDate) {
      const dueDate = new Date(updateRequestDto.dueDate);
      const today = new Date();

      if (dueDate <= today) {
        throw new BadRequestException('Due date must be in the future');
      }
    }

    // Update request
    const updatedRequest = this.feedbackRequestRepository.merge(request, {
      ...updateRequestDto,
      dueDate: updateRequestDto.dueDate
        ? new Date(updateRequestDto.dueDate)
        : request.dueDate,
    });

    return this.feedbackRequestRepository.save(updatedRequest);
  }

  async respondToRequest(
    id: string,
    userId: string,
    accept: boolean,
  ): Promise<FeedbackRequest> {
    const request = await this.findRequestById(id);

    // Verify user is the recipient
    if (request.recipientId !== userId) {
      throw new ForbiddenException('Not authorized to respond to this request');
    }

    // Verify request is still pending
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Can only respond to pending requests');
    }

    // Update request status
    const status = accept ? RequestStatus.PENDING : RequestStatus.DECLINED;
    await this.feedbackRequestRepository.update(id, { status });

    return this.findRequestById(id);
  }

  async deleteRequest(id: string, userId: string): Promise<void> {
    const request = await this.findRequestById(id);

    // Verify user is the requester
    if (request.requesterId !== userId) {
      throw new ForbiddenException('Not authorized to delete this request');
    }

    // Check if there's any feedback associated with this request
    const hasFeedback = await this.feedbackRepository.findOne({
      where: { requestId: id },
    });

    if (hasFeedback) {
      throw new BadRequestException(
        'Cannot delete request with associated feedback',
      );
    }

    await this.feedbackRequestRepository.remove(request);
  }

  // Generate 360 Feedback Requests
  async generate360FeedbackRequests(
    cycleId: string,
    userId: string,
    recipientIds: string[],
  ): Promise<FeedbackRequest[]> {
    // Validate cycle exists
    const cycle = await this.feedbackCycleRepository.findOne({ where: { id: cycleId } });
    if (!cycle) {
      throw new NotFoundException(`Feedback cycle with ID ${cycleId} not found`);
    }

    // Validate user exists
    await this.usersService.findOne(userId);

    // Validate all recipient IDs
    for (const recipientId of recipientIds) {
      await this.usersService.findOne(recipientId);
    }

    // Create requests for all recipients
    const requests: FeedbackRequest[] = [];
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    for (const recipientId of recipientIds) {
      const requestData = {
        type: FeedbackType.THREE_SIXTY,
        requesterId: userId,
        recipientId,
        subjectId: userId, // The subject is the user for whom feedback is being requested
        status: RequestStatus.PENDING,
        cycleId,
        message: 'Please provide your feedback',
        dueDate: dueDate,
        isAnonymous: true, // 360 feedback is typically anonymous
      };

      const request = this.feedbackRequestRepository.create(requestData);
      const savedRequest = await this.feedbackRequestRepository.save(request);
      requests.push(savedRequest as unknown as FeedbackRequest);
    }

    return requests;
  }

  // Analytics Methods
  async getFeedbackStats(userId?: string): Promise<{
    total: number;
    pending: number;
    completed: number;
    categories: Record<string, number>;
  }> {
    const where: FindOptionsWhere<FeedbackRequest> = {};

    if (userId) {
      where.recipientId = userId;
    }

    const total = await this.feedbackRequestRepository.count({ where });

    where.status = RequestStatus.PENDING;
    const pending = await this.feedbackRequestRepository.count({ where });

    where.status = RequestStatus.COMPLETED;
    const completed = await this.feedbackRequestRepository.count({ where });

    // Get category stats
    const typeStats = await this.feedbackRequestRepository
      .createQueryBuilder('request')
      .select('request.type', 'type')
      .addSelect('COUNT(request.id)', 'count')
      .where(userId ? 'request.recipientId = :userId' : '1=1', { userId })
      .groupBy('request.type')
      .getRawMany();

    const categories = {};
    typeStats.forEach(stat => {
      categories[stat.type] = parseInt(stat.count, 10);
    });

    return {
      total,
      pending,
      completed,
      categories,
    };
  }

  async getAverageFeedbackRatings(userId: string): Promise<Record<string, number>> {
    // Get all ratings for this user
    const feedback = await this.feedbackRepository.find({
      where: {
        toUserId: userId,
        status: FeedbackStatus.SUBMITTED,
        ratings: Not(IsNull()),
      },
      select: ['ratings'],
    });

    if (feedback.length === 0) {
      return {};
    }

    // Aggregate all rating categories
    const allRatingCategories = new Set<string>();
    const categoryTotals: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    feedback.forEach(item => {
      if (item.ratings) {
        Object.entries(item.ratings).forEach(([category, rating]) => {
          allRatingCategories.add(category);
          categoryTotals[category] = (categoryTotals[category] || 0) + Number(rating);
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
      }
    });

    // Calculate averages
    const averages: Record<string, number> = {};
    allRatingCategories.forEach(category => {
      averages[category] = categoryTotals[category] / categoryCounts[category];
    });

    return averages;
  }

  async get360FeedbackSummary(userId: string, cycleId?: string): Promise<{
    averageRatings: Record<string, number>;
    strengthsSummary: string[];
    improvementsSummary: string[];
    feedbackCount: number;
  }> {
    // Get all submitted 360 feedback for this user
    const where: FindOptionsWhere<Feedback> = {
      toUserId: userId,
      type: FeedbackType.THREE_SIXTY,
      status: FeedbackStatus.SUBMITTED,
    };

    if (cycleId) {
      where.cycleId = cycleId;
    }

    const feedback = await this.feedbackRepository.find({
      where,
      select: ['ratings', 'strengths', 'improvements'],
    });

    if (feedback.length === 0) {
      return {
        averageRatings: {},
        strengthsSummary: [],
        improvementsSummary: [],
        feedbackCount: 0,
      };
    }

    // Aggregate all rating categories
    const allRatingCategories = new Set<string>();
    const categoryTotals: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    feedback.forEach(item => {
      if (item.ratings) {
        Object.entries(item.ratings).forEach(([category, rating]) => {
          allRatingCategories.add(category);
          categoryTotals[category] = (categoryTotals[category] || 0) + Number(rating);
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
      }
    });

    // Calculate averages
    const averageRatings: Record<string, number> = {};
    allRatingCategories.forEach(category => {
      averageRatings[category] = categoryTotals[category] / categoryCounts[category];
    });

    // Extract strengths and improvements
    const strengthsSummary = feedback
      .filter(item => item.strengths?.trim())
      .map(item => item.strengths);

    const improvementsSummary = feedback
      .filter(item => item.improvements?.trim())
      .map(item => item.improvements);

    return {
      averageRatings,
      strengthsSummary,
      improvementsSummary,
      feedbackCount: feedback.length,
    };
  }
}