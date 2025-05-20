import { User } from '../../users/entities/user.entity';
import { KpiUpdate } from './kpi-update.entity';
export declare enum KpiStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum KpiType {
    QUANTITATIVE = "quantitative",
    QUALITATIVE = "qualitative"
}
export declare class Kpi {
    id: string;
    title: string;
    description: string;
    type: KpiType;
    metrics: any;
    targetValue: number;
    currentValue: number;
    weight: number;
    startDate: Date;
    endDate: Date;
    status: KpiStatus;
    categoryId: string;
    user: User;
    userId: string;
    createdBy: User;
    createdById: string;
    updates: KpiUpdate[];
    createdAt: Date;
    updatedAt: Date;
}
