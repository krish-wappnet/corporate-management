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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';

@ApiTags('feedback')
@Controller('feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Feedback Request Endpoints (needs to be before :id to avoid route conflict)
  // Feedback Cycle Endpoints (must come before :id routes)
  @Get('cycles')
  @ApiOperation({ summary: 'Get all feedback cycles' })
  @ApiResponse({ status: 200, description: 'List of feedback cycles', type: PaginationResponseDto })
  @ApiQuery({ name: 'status', required: false, enum: CycleStatus })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async findAllCycles(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: CycleStatus,
    @Query('type') type?: string,
    @Query('active') active?: boolean | string,
  ): Promise<PaginationResponseDto<FeedbackCycle>> {
    const filters = {
      status,
      type,
      active: active === 'true' || active === true,
    };

    return this.feedbackService.getFeedbackCycles(paginationDto, filters);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get all feedback requests' })
  @ApiResponse({ status: 200, description: 'List of feedback requests', type: PaginationResponseDto })
  @ApiQuery({ name: 'requesterId', required: false })
  @ApiQuery({ name: 'recipientId', required: false })
  @ApiQuery({ name: 'subjectId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({ name: 'cycleId', required: false })
  async findAllRequests(
    @Request() req,
    @Query() paginationDto: PaginationDto,
    @Query('requesterId') requesterId?: string,
    @Query('recipientId') recipientId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('status') status?: RequestStatus,
    @Query('cycleId') cycleId?: string,
  ): Promise<PaginationResponseDto<FeedbackRequest>> {
    const filters = {
      requesterId,
      recipientId,
      subjectId,
      status,
      cycleId,
    };

    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.getFeedbackRequests(req.user.userId, paginationDto, filters);
  }

  @Post('requests')
  @ApiOperation({ summary: 'Create a new feedback request' })
  @ApiResponse({ status: 201, description: 'Feedback request created successfully', type: FeedbackRequest })
  createRequest(
    @Request() req,
    @Body() createRequestDto: CreateFeedbackRequestDto,
  ): Promise<FeedbackRequest> {
    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.createRequest(req.user.userId, createRequestDto);
  }

  // Feedback Endpoints
  @Post()
  @ApiOperation({ summary: 'Create new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully', type: Feedback })
  createFeedback(
    @Request() req,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    console.log('Request user:', req.user); // Debug log
    if (!req.user?.userId) {
      console.error('No user ID found in request');
      throw new Error('Authentication required');
    }
    return this.feedbackService.createFeedback(req.user.userId, createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of feedback retrieved successfully' })
  @ApiQuery({ name: 'fromUserId', required: false })
  @ApiQuery({ name: 'toUserId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: FeedbackType })
  @ApiQuery({ name: 'status', required: false, enum: FeedbackStatus })
  @ApiQuery({ name: 'cycleId', required: false })
  findAllFeedback(
    @Query() paginationDto: PaginationDto,
    @Query('fromUserId') fromUserId?: string,
    @Query('toUserId') toUserId?: string,
    @Query('type') type?: FeedbackType,
    @Query('status') status?: FeedbackStatus,
    @Query('cycleId') cycleId?: string,
  ): Promise<PaginationResponseDto<Feedback>> {
    const filters = {
      fromUserId,
      toUserId,
      type,
      status,
      cycleId,
    };

    return this.feedbackService.findAllFeedback(paginationDto, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiResponse({ status: 200, description: 'Feedback retrieved successfully', type: Feedback })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  findOneFeedback(
    @Request() req,
    @Param('id') id: string,
  ): Promise<Feedback> {
    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.findFeedbackById(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feedback' })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully', type: Feedback })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  updateFeedback(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.updateFeedback(id, req.user.userId, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  removeFeedback(@Request() req, @Param('id') id: string): Promise<void> {
    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.deleteFeedback(id, req.user.userId);
  }

  @Post('cycles')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new feedback cycle' })
  @ApiResponse({ status: 201, description: 'Feedback cycle created successfully', type: FeedbackCycle })
  createCycle(@Body() createCycleDto: CreateFeedbackCycleDto): Promise<FeedbackCycle> {
    return this.feedbackService.createCycle(createCycleDto);
  }

  @Get('cycles/:id')
  @ApiOperation({ summary: 'Get a feedback cycle by ID' })
  @ApiResponse({ status: 200, description: 'Feedback cycle retrieved successfully', type: FeedbackCycle })
  @ApiResponse({ status: 404, description: 'Feedback cycle not found' })
  findOneCycle(@Param('id') id: string): Promise<FeedbackCycle> {
    return this.feedbackService.findCycleById(id);
  }

  @Patch('cycles/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update a feedback cycle' })
  @ApiResponse({ status: 200, description: 'Feedback cycle updated successfully', type: FeedbackCycle })
  @ApiResponse({ status: 404, description: 'Feedback cycle not found' })
  updateCycle(
    @Param('id') id: string,
    @Body() updateCycleDto: UpdateFeedbackCycleDto,
  ): Promise<FeedbackCycle> {
    return this.feedbackService.updateCycle(id, updateCycleDto);
  }

  @Delete('cycles/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete a feedback cycle' })
  @ApiResponse({ status: 200, description: 'Feedback cycle deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete cycle with associated feedback' })
  @ApiResponse({ status: 404, description: 'Feedback cycle not found' })
  removeCycle(@Param('id') id: string): Promise<void> {
    return this.feedbackService.deleteCycle(id);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get a feedback request by ID' })
  @ApiResponse({ status: 200, description: 'Feedback request retrieved successfully', type: FeedbackRequest })
  @ApiResponse({ status: 404, description: 'Feedback request not found' })
  findOneRequest(@Param('id') id: string): Promise<FeedbackRequest> {
    return this.feedbackService.findRequestById(id);
  }

  @Patch('requests/:id')
  @ApiOperation({ summary: 'Update a feedback request' })
  @ApiResponse({ status: 200, description: 'Feedback request updated successfully', type: FeedbackRequest })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Feedback request not found' })
  updateRequest(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateFeedbackRequestDto,
  ): Promise<FeedbackRequest> {
    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.updateRequest(id, req.user.userId, updateRequestDto);
  }

  @Post('requests/:id/respond')
  @ApiOperation({ summary: 'Respond to a feedback request (accept/decline)' })
  @ApiResponse({ status: 200, description: 'Response recorded successfully', type: FeedbackRequest })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Feedback request not found' })
  @ApiQuery({ name: 'accept', required: true, type: Boolean })
  respondToRequest(
    @Request() req,
    @Param('id') id: string,
    @Query('accept') accept: boolean,
  ): Promise<FeedbackRequest> {
    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.respondToRequest(id, req.user.userId, accept);
  }

  @Delete('requests/:id')
  @ApiOperation({ summary: 'Delete a feedback request' })
  @ApiResponse({ status: 200, description: 'Feedback request deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Feedback request not found' })
  removeRequest(@Request() req, @Param('id') id: string): Promise<void> {
    if (!req.user?.userId) {
      throw new Error('Authentication required');
    }
    return this.feedbackService.deleteRequest(id, req.user.userId);
  }

  // 360 Feedback Endpoints
  @Post('360/:userId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Generate 360-degree feedback requests' })
  @ApiResponse({ status: 201, description: '360-degree feedback requests generated successfully', type: [FeedbackRequest] })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'User or cycle not found' })
  async generate360Feedback(
    @Param('userId') userId: string,
    @Query('cycleId') cycleId: string,
    @Body() body: { recipientIds: string[] },
  ): Promise<FeedbackRequest[]> {
    return this.feedbackService.generate360FeedbackRequests(cycleId, userId, body.recipientIds);
  }


}