import { User } from '../../users/entities/user.entity';
import { Kpi } from './kpi.entity';
export declare class KpiUpdate {
    id: string;
    value: number;
    notes: string;
    metadata: any;
    kpi: Kpi;
    kpiId: string;
    createdBy: User;
    createdById: string;
    createdAt: Date;
}
