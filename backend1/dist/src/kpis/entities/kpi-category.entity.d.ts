import { Kpi } from './kpi.entity';
export declare class KpiCategory {
    id: string;
    name: string;
    description: string;
    kpis: Kpi[];
    createdAt: Date;
    updatedAt: Date;
}
