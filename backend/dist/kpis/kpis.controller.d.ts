import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dtos/create-kpi.dto';
import { UpdateKpiDto } from './dtos/update-kpi.dto';
import { CreateKpiUpdateDto } from './dtos/create-kpi-update.dto';
import { CreateKpiCategoryDto } from './dtos/create-kpi-category.dto';
import { UpdateKpiCategoryDto } from './dtos/update-kpi-category.dto';
import { Kpi, KpiStatus } from './entities/kpi.entity';
import { KpiUpdate } from './entities/kpi-update.entity';
import { KpiCategory } from './entities/kpi-category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
export declare class KpisController {
    private readonly kpisService;
    constructor(kpisService: KpisService);
    create(req: any, createKpiDto: CreateKpiDto): Promise<Kpi>;
    findAll(paginationDto: PaginationDto, userId?: string, status?: KpiStatus, categoryId?: string, startDate?: string, endDate?: string): Promise<PaginationResponseDto<Kpi>>;
    findOne(id: string): Promise<Kpi>;
    update(id: string, updateKpiDto: UpdateKpiDto): Promise<Kpi>;
    remove(id: string): Promise<void>;
    createUpdate(req: any, createKpiUpdateDto: CreateKpiUpdateDto): Promise<KpiUpdate>;
    getUpdates(id: string): Promise<KpiUpdate[]>;
    createCategory(createKpiCategoryDto: CreateKpiCategoryDto): Promise<KpiCategory>;
    findAllCategories(): Promise<KpiCategory[]>;
    findOneCategory(id: string): Promise<KpiCategory>;
    updateCategory(id: string, updateKpiCategoryDto: UpdateKpiCategoryDto): Promise<KpiCategory>;
    removeCategory(id: string): Promise<void>;
    getCompletionRate(userId?: string): Promise<{
        total: number;
        completed: number;
        rate: number;
    }>;
    getProgressByCategory(): Promise<Array<{
        category: string;
        totalKpis: number;
        avgProgress: number;
    }>>;
    getTrends(userId: string, startDate: string, endDate: string): Promise<Array<{
        date: string;
        avgProgress: number;
    }>>;
}
