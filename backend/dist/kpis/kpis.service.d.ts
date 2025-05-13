import { Repository } from 'typeorm';
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
export declare class KpisService {
    private kpisRepository;
    private kpiUpdatesRepository;
    private kpiCategoriesRepository;
    private usersService;
    constructor(kpisRepository: Repository<Kpi>, kpiUpdatesRepository: Repository<KpiUpdate>, kpiCategoriesRepository: Repository<KpiCategory>, usersService: UsersService);
    createKpi(userId: string, createKpiDto: CreateKpiDto): Promise<Kpi>;
    findAllKpis(paginationDto?: PaginationDto, filters?: {
        userId?: string;
        status?: KpiStatus;
        categoryId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<PaginationResponseDto<Kpi>>;
    findKpiById(id: string): Promise<Kpi>;
    updateKpi(id: string, updateKpiDto: UpdateKpiDto): Promise<Kpi>;
    deleteKpi(id: string): Promise<void>;
    createKpiUpdate(userId: string, createKpiUpdateDto: CreateKpiUpdateDto): Promise<KpiUpdate>;
    getKpiUpdates(kpiId: string): Promise<KpiUpdate[]>;
    createCategory(createKpiCategoryDto: CreateKpiCategoryDto): Promise<KpiCategory>;
    findAllCategories(): Promise<KpiCategory[]>;
    findCategoryById(id: string): Promise<KpiCategory>;
    updateCategory(id: string, updateKpiCategoryDto: UpdateKpiCategoryDto): Promise<KpiCategory>;
    deleteCategory(id: string): Promise<void>;
    getKpiCompletionRate(userId?: string): Promise<{
        total: number;
        completed: number;
        rate: number;
    }>;
    getKpiProgressByCategory(): Promise<Array<{
        category: string;
        totalKpis: number;
        avgProgress: number;
    }>>;
    getKpiTrendsByUser(userId: string, startDate: Date, endDate: Date): Promise<Array<{
        date: string;
        avgProgress: number;
    }>>;
}
