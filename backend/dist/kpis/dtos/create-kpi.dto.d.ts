import { KpiStatus, KpiType } from '../entities/kpi.entity';
export declare class CreateKpiDto {
    title: string;
    description: string;
    type?: KpiType;
    metrics?: Record<string, any>;
    targetValue: number;
    currentValue?: number;
    weight?: number;
    startDate: string;
    endDate: string;
    status?: KpiStatus;
    categoryId?: string;
    userId: string;
}
