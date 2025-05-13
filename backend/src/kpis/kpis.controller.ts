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
import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dtos/create-kpi.dto';
import { UpdateKpiDto } from './dtos/update-kpi.dto';
import { CreateKpiUpdateDto } from './dtos/create-kpi-update.dto';
import { CreateKpiCategoryDto } from './dtos/create-kpi-category.dto';
import { UpdateKpiCategoryDto } from './dtos/update-kpi-category.dto';
import { Kpi, KpiStatus } from './entities/kpi.entity';
import { KpiUpdate } from './entities/kpi-update.entity';
import { KpiCategory } from './entities/kpi-category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';

@ApiTags('kpis')
@Controller('kpis')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  // KPI Endpoints
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new KPI' })
  @ApiResponse({ status: 201, description: 'KPI created successfully', type: Kpi })
  create(@Request() req, @Body() createKpiDto: CreateKpiDto): Promise<Kpi> {
    return this.kpisService.createKpi(req.user.userId, createKpiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all KPIs with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of KPIs retrieved successfully' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: KpiStatus })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('userId') userId?: string,
    @Query('status') status?: KpiStatus,
    @Query('categoryId') categoryId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<PaginationResponseDto<Kpi>> {
    const filters = {
      userId,
      status,
      categoryId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.kpisService.findAllKpis(paginationDto, filters);
  }

  // KPI Categories Endpoints - Must come before :id route to avoid conflict
  @Get('categories')
  @ApiOperation({ summary: 'Get all KPI categories' })
  @ApiResponse({ status: 200, description: 'List of KPI categories', type: [KpiCategory] })
  findAllCategories(): Promise<KpiCategory[]> {
    return this.kpisService.findAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a KPI by ID' })
  @ApiResponse({ status: 200, description: 'KPI retrieved successfully', type: Kpi })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  findOne(@Param('id') id: string): Promise<Kpi> {
    return this.kpisService.findKpiById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update a KPI' })
  @ApiResponse({ status: 200, description: 'KPI updated successfully', type: Kpi })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  update(
    @Param('id') id: string,
    @Body() updateKpiDto: UpdateKpiDto,
  ): Promise<Kpi> {
    return this.kpisService.updateKpi(id, updateKpiDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete a KPI' })
  @ApiResponse({ status: 200, description: 'KPI deleted successfully' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.kpisService.deleteKpi(id);
  }

  // KPI Updates Endpoints
  @Post('updates')
  @ApiOperation({ summary: 'Create a KPI update' })
  @ApiResponse({ status: 201, description: 'KPI update created successfully', type: KpiUpdate })
  createUpdate(
    @Request() req,
    @Body() createKpiUpdateDto: CreateKpiUpdateDto,
  ): Promise<KpiUpdate> {
    return this.kpisService.createKpiUpdate(req.user.userId, createKpiUpdateDto);
  }

  @Get(':id/updates')
  @ApiOperation({ summary: 'Get all updates for a KPI' })
  @ApiResponse({ status: 200, description: 'KPI updates retrieved successfully' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  getUpdates(@Param('id') id: string): Promise<KpiUpdate[]> {
    return this.kpisService.getKpiUpdates(id);
  }



  @Post('categories')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new KPI category' })
  @ApiResponse({ status: 201, description: 'KPI category created successfully', type: KpiCategory })
  createCategory(
    @Body() createKpiCategoryDto: CreateKpiCategoryDto,
  ): Promise<KpiCategory> {
    return this.kpisService.createCategory(createKpiCategoryDto);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get a KPI category by ID' })
  @ApiResponse({ status: 200, description: 'KPI category retrieved successfully', type: KpiCategory })
  @ApiResponse({ status: 404, description: 'KPI category not found' })
  findOneCategory(@Param('id') id: string): Promise<KpiCategory> {
    return this.kpisService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a KPI category' })
  @ApiResponse({ status: 200, description: 'KPI category updated successfully', type: KpiCategory })
  @ApiResponse({ status: 404, description: 'KPI category not found' })
  updateCategory(
    @Param('id') id: string,
    @Body() updateKpiCategoryDto: UpdateKpiCategoryDto,
  ): Promise<KpiCategory> {
    return this.kpisService.updateCategory(id, updateKpiCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a KPI category' })
  @ApiResponse({ status: 200, description: 'KPI category deleted successfully' })
  @ApiResponse({ status: 404, description: 'KPI category not found' })
  removeCategory(@Param('id') id: string): Promise<void> {
    return this.kpisService.deleteCategory(id);
  }

  // Analytics Endpoints
  @Get('analytics/completion-rate')
  @ApiOperation({ summary: 'Get KPI completion rate' })
  @ApiResponse({ status: 200, description: 'KPI completion rate retrieved successfully' })
  @ApiQuery({ name: 'userId', required: false })
  getCompletionRate(@Query('userId') userId?: string): Promise<{
    total: number;
    completed: number;
    rate: number;
  }> {
    return this.kpisService.getKpiCompletionRate(userId);
  }

  @Get('analytics/progress-by-category')
  @ApiOperation({ summary: 'Get KPI progress by category' })
  @ApiResponse({ status: 200, description: 'KPI progress by category retrieved successfully' })
  getProgressByCategory(): Promise<
    Array<{ category: string; totalKpis: number; avgProgress: number }>
  > {
    return this.kpisService.getKpiProgressByCategory();
  }

  @Get('analytics/trends/:userId')
  @ApiOperation({ summary: 'Get KPI trends for a user' })
  @ApiResponse({ status: 200, description: 'KPI trends retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  getTrends(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Array<{ date: string; avgProgress: number }>> {
    return this.kpisService.getKpiTrendsByUser(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}