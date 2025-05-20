import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Kpi, KpiStatus } from './entities/kpi.entity';
import { KpiUpdate } from './entities/kpi-update.entity';
import { KpiCategory } from './entities/kpi-category.entity';
import { CreateKpiDto } from './dtos/create-kpi.dto';
import { UpdateKpiDto } from './dtos/update-kpi.dto';
import { CreateKpiUpdateDto } from './dtos/create-kpi-update.dto';
import { CreateKpiCategoryDto } from './dtos/create-kpi-category.dto';
import { UpdateKpiCategoryDto } from './dtos/update-kpi-category.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class KpisService {
  constructor(
    @InjectRepository(Kpi)
    private kpisRepository: Repository<Kpi>,
    @InjectRepository(KpiUpdate)
    private kpiUpdatesRepository: Repository<KpiUpdate>,
    @InjectRepository(KpiCategory)
    private kpiCategoriesRepository: Repository<KpiCategory>,
    private usersService: UsersService,
  ) {}

  // KPI Methods
  async createKpi(userId: string, createKpiDto: CreateKpiDto): Promise<Kpi> {
    // Verify user exists
    await this.usersService.findOne(createKpiDto.userId);

    // Verify category exists if provided
    if (createKpiDto.categoryId) {
      await this.findCategoryById(createKpiDto.categoryId);
    }

    // Validate dates
    const startDate = new Date(createKpiDto.startDate);
    const endDate = new Date(createKpiDto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Create KPI
    const kpi = this.kpisRepository.create({
      ...createKpiDto,
      createdById: userId,
      startDate,
      endDate,
    });

    return this.kpisRepository.save(kpi);
  }

  async findAllKpis(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    filters?: {
      userId?: string;
      status?: KpiStatus;
      categoryId?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<PaginationResponseDto<Kpi>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const where: FindOptionsWhere<Kpi> = {};

    // Apply filters
    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.startDate && filters?.endDate) {
      where.startDate = Between(filters.startDate, filters.endDate);
    }

    const [kpis, total] = await this.kpisRepository.findAndCount({
      where,
      relations: ['user', 'createdBy'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return new PaginationResponseDto(kpis, total, page, limit);
  }

  async findKpiById(id: string): Promise<Kpi> {
    const kpi = await this.kpisRepository.findOne({
      where: { id },
      relations: ['user', 'createdBy', 'updates', 'updates.createdBy'],
    });

    if (!kpi) {
      throw new NotFoundException(`KPI with ID "${id}" not found`);
    }

    return kpi;
  }

  async updateKpi(id: string, updateKpiDto: UpdateKpiDto): Promise<Kpi> {
    const kpi = await this.findKpiById(id);

    // Verify user exists if provided
    if (updateKpiDto.userId) {
      await this.usersService.findOne(updateKpiDto.userId);
    }

    // Verify category exists if provided
    if (updateKpiDto.categoryId) {
      await this.findCategoryById(updateKpiDto.categoryId);
    }

    // Validate dates if both are provided
    if (updateKpiDto.startDate && updateKpiDto.endDate) {
      const startDate = new Date(updateKpiDto.startDate);
      const endDate = new Date(updateKpiDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    } else if (updateKpiDto.startDate) {
      const startDate = new Date(updateKpiDto.startDate);
      const endDate = kpi.endDate;

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    } else if (updateKpiDto.endDate) {
      const startDate = kpi.startDate;
      const endDate = new Date(updateKpiDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Update KPI
    const updatedKpi = this.kpisRepository.merge(kpi, {
      ...updateKpiDto,
      startDate: updateKpiDto.startDate ? new Date(updateKpiDto.startDate) : kpi.startDate,
      endDate: updateKpiDto.endDate ? new Date(updateKpiDto.endDate) : kpi.endDate,
    });

    return this.kpisRepository.save(updatedKpi);
  }

  async deleteKpi(id: string): Promise<void> {
    const kpi = await this.findKpiById(id);
    await this.kpisRepository.remove(kpi);
  }

  // KPI Updates Methods
  async createKpiUpdate(
    userId: string,
    createKpiUpdateDto: CreateKpiUpdateDto,
  ): Promise<KpiUpdate> {
    // Verify KPI exists
    const kpi = await this.findKpiById(createKpiUpdateDto.kpiId);

    // Create update
    const kpiUpdate = this.kpiUpdatesRepository.create({
      ...createKpiUpdateDto,
      createdById: userId,
    });

    const savedUpdate = await this.kpiUpdatesRepository.save(kpiUpdate);

    // Update KPI current value
    await this.kpisRepository.update(kpi.id, {
      currentValue: kpiUpdate.value,
    });

    return savedUpdate;
  }

  async getKpiUpdates(kpiId: string): Promise<KpiUpdate[]> {
    // Verify KPI exists
    await this.findKpiById(kpiId);

    // Get updates
    return this.kpiUpdatesRepository.find({
      where: { kpiId },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // KPI Categories Methods
  async createCategory(
    createKpiCategoryDto: CreateKpiCategoryDto,
  ): Promise<KpiCategory> {
    const category = this.kpiCategoriesRepository.create(createKpiCategoryDto);
    return this.kpiCategoriesRepository.save(category);
  }

  async findAllCategories(): Promise<KpiCategory[]> {
    return this.kpiCategoriesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findCategoryById(id: string): Promise<KpiCategory> {
    const category = await this.kpiCategoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`KPI Category with ID "${id}" not found`);
    }

    return category;
  }

  async updateCategory(
    id: string,
    updateKpiCategoryDto: UpdateKpiCategoryDto,
  ): Promise<KpiCategory> {
    const category = await this.findCategoryById(id);
    const updatedCategory = this.kpiCategoriesRepository.merge(
      category,
      updateKpiCategoryDto,
    );

    return this.kpiCategoriesRepository.save(updatedCategory);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.kpiCategoriesRepository.remove(category);
  }

  // Analytics Methods
  async getKpiCompletionRate(userId?: string): Promise<{
    total: number;
    completed: number;
    rate: number;
  }> {
    const where: FindOptionsWhere<Kpi> = {};

    if (userId) {
      where.userId = userId;
    }

    const total = await this.kpisRepository.count({ where });
    const completed = await this.kpisRepository.count({
      where: {
        ...where,
        status: KpiStatus.COMPLETED,
      },
    });

    const rate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      rate,
    };
  }

  async getKpiProgressByCategory(): Promise<
    Array<{ category: string; totalKpis: number; avgProgress: number }>
  > {
    const result = await this.kpisRepository
      .createQueryBuilder('kpi')
      .leftJoin('kpi_categories', 'category', 'kpi.categoryId = category.id')
      .select('category.name', 'category')
      .addSelect('COUNT(kpi.id)', 'totalKpis')
      .addSelect(
        'AVG((kpi.currentValue / NULLIF(kpi.targetValue, 0)) * 100)',
        'avgProgress',
      )
      .where('category.name IS NOT NULL')
      .groupBy('category.name')
      .getRawMany();

    return result.map(item => ({
      category: item.category,
      totalKpis: parseInt(item.totalKpis, 10),
      avgProgress: parseFloat(item.avgProgress) || 0,
    }));
  }

  async getKpiTrendsByUser(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: string; avgProgress: number }>> {
    // Verify user exists
    await this.usersService.findOne(userId);

    const result = await this.kpiUpdatesRepository
      .createQueryBuilder('update')
      .leftJoin('kpis', 'kpi', 'update.kpiId = kpi.id')
      .select(
        "to_char(update.createdAt, 'YYYY-MM-DD')",
        'date',
      )
      .addSelect(
        'AVG((update.value / NULLIF(kpi.targetValue, 0)) * 100)',
        'avgProgress',
      )
      .where('kpi.userId = :userId', { userId })
      .andWhere('update.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy("to_char(update.createdAt, 'YYYY-MM-DD')")
      .orderBy("to_char(update.createdAt, 'YYYY-MM-DD')", 'ASC')
      .getRawMany();

    return result.map(item => ({
      date: item.date,
      avgProgress: parseFloat(item.avgProgress) || 0,
    }));
  }
}