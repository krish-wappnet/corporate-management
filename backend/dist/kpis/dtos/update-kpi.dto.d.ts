import { KpiStatus, KpiType } from '../entities/kpi.entity';
import { MetricDto } from './metric.dto';
export declare class UpdateKpiDto {
    title?: string;
    description?: string;
    type?: KpiType;
    metrics?: MetricDto[];
    targetValue?: number;
    currentValue?: number;
    weight?: number;
    startDate?: string;
    endDate?: string;
    status?: KpiStatus;
    categoryId?: string;
    userId?: string;
}
