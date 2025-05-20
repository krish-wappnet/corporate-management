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
import { OkrsService } from './okrs.service';
import { CreateOkrDto } from './dtos/create-okr.dto';
import { UpdateOkrDto } from './dtos/update-okr.dto';
import { CreateKeyResultDto } from './dtos/create-key-result.dto';
import { UpdateKeyResultDto } from './dtos/update-key-result.dto';
import { CreateKeyResultUpdateDto } from './dtos/create-key-result-update.dto';
import { Okr, OkrStatus, OkrType } from './entities/okr.entity';
import { KeyResult } from './entities/key-result.entity';
import { KeyResultUpdate } from './entities/key-result-update.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';

type Filters = {
  userId?: string;
  status?: OkrStatus;
  type?: OkrType;
  startDate?: Date;
  endDate?: Date;
};

@ApiTags('okrs')
@Controller('okrs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OkrsController {
  constructor(private readonly okrsService: OkrsService) {}

  // OKR Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new OKR' })
  @ApiResponse({ status: 201, description: 'OKR created successfully', type: Okr })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Request() req, @Body() createOkrDto: CreateOkrDto): Promise<Okr> {
    return this.okrsService.createOkr(req.user.userId, createOkrDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all OKRs with optional filtering' })
  @ApiResponse({ status: 200, description: 'OKRs retrieved successfully', type: [Okr] })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: OkrStatus })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'type', required: false })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('userId') userId?: string,
    @Query('status') status?: OkrStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: OkrType,
  ): Promise<PaginationResponseDto<Okr>> {
    const filters: Filters = {
      userId,
      status,
      type,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.okrsService.findAllOkrs(paginationDto, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an OKR by ID' })
  @ApiResponse({ status: 200, description: 'OKR retrieved successfully', type: Okr })
  @ApiResponse({ status: 404, description: 'OKR not found' })
  findOne(@Param('id') id: string): Promise<Okr> {
    return this.okrsService.findOkrById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an OKR' })
  @ApiResponse({ status: 200, description: 'OKR updated successfully', type: Okr })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'OKR not found' })
  update(
    @Param('id') id: string,
    @Body() updateOkrDto: UpdateOkrDto,
  ): Promise<Okr> {
    return this.okrsService.updateOkr(id, updateOkrDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete an OKR' })
  @ApiResponse({ status: 200, description: 'OKR deleted successfully' })
  @ApiResponse({ status: 404, description: 'OKR not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.okrsService.deleteOkr(id);
  }

  // Key Result Endpoints
  @Post(':okrId/key-results')
  @ApiOperation({ summary: 'Create a new key result for an OKR' })
  @ApiResponse({ status: 201, description: 'Key result created successfully', type: KeyResult })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'OKR not found' })
  createKeyResult(
    @Param('okrId') okrId: string,
    @Body() createKeyResultDto: CreateKeyResultDto,
  ): Promise<KeyResult> {
    return this.okrsService.createKeyResult(okrId, createKeyResultDto);
  }

  @Get('key-results/:id')
  @ApiOperation({ summary: 'Get a key result by ID' })
  @ApiResponse({ status: 200, description: 'Key result retrieved successfully', type: KeyResult })
  @ApiResponse({ status: 404, description: 'Key result not found' })
  findOneKeyResult(@Param('id') id: string): Promise<KeyResult> {
    return this.okrsService.findKeyResultById(id);
  }

  @Patch('key-results/:id')
  @ApiOperation({ summary: 'Update a key result' })
  @ApiResponse({ status: 200, description: 'Key result updated successfully', type: KeyResult })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Key result not found' })
  updateKeyResult(
    @Param('id') id: string,
    @Body() updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<KeyResult> {
    return this.okrsService.updateKeyResult(id, updateKeyResultDto);
  }

  @Delete('key-results/:id')
  @ApiOperation({ summary: 'Delete a key result' })
  @ApiResponse({ status: 200, description: 'Key result deleted successfully' })
  @ApiResponse({ status: 404, description: 'Key result not found' })
  removeKeyResult(@Param('id') id: string): Promise<void> {
    return this.okrsService.deleteKeyResult(id);
  }

  // Key Result Update Endpoints
  @Post('key-results/updates')
  @ApiOperation({ summary: 'Create a key result update' })
  @ApiResponse({ status: 201, description: 'Key result update created successfully', type: KeyResultUpdate })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Key result not found' })
  createKeyResultUpdate(
    @Request() req,
    @Body() createUpdateDto: CreateKeyResultUpdateDto,
  ): Promise<KeyResultUpdate> {
    return this.okrsService.createKeyResultUpdate(req.user.userId, createUpdateDto);
  }

  @Get('key-results/:id/updates')
  @ApiOperation({ summary: 'Get all updates for a key result' })
  @ApiResponse({ status: 200, description: 'Key result updates retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Key result not found' })
  getKeyResultUpdates(@Param('id') id: string): Promise<KeyResultUpdate[]> {
    return this.okrsService.getKeyResultUpdates(id);
  }

  // Analytics Endpoints
  @Get('analytics/completion-rate')
  @ApiOperation({ summary: 'Get OKR completion rate' })
  @ApiResponse({ status: 200, description: 'OKR completion rate retrieved successfully' })
  @ApiQuery({ name: 'userId', required: false })
  getCompletionRate(@Query('userId') userId?: string): Promise<{
    total: number;
    completed: number;
    rate: number;
  }> {
    return this.okrsService.getOkrCompletionRate(userId);
  }

  @Get('analytics/user-progress/:userId')
  @ApiOperation({ summary: 'Get user OKR progress' })
  @ApiResponse({ status: 200, description: 'User OKR progress retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserProgress(@Param('userId') userId: string): Promise<{
    activeOkrs: number;
    averageProgress: number;
    topPerformingOkr: Partial<Okr>;
  }> {
    return this.okrsService.getUserOkrProgress(userId);
  }

  @Get('analytics/team-alignment/:managerUserId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get team OKR alignment for a manager' })
  @ApiResponse({ status: 200, description: 'Team OKR alignment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  getTeamAlignment(
    @Param('managerUserId') managerUserId: string,
  ): Promise<Array<{ userId: string; name: string; alignmentScore: number }>> {
    return this.okrsService.getTeamOkrAlignment(managerUserId);
  }
}