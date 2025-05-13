import { User } from '../../users/entities/user.entity';
import { KeyResult } from './key-result.entity';
export declare enum OkrStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum OkrType {
    INDIVIDUAL = "individual",
    TEAM = "team",
    COMPANY = "company"
}
export declare enum OkrFrequency {
    QUARTERLY = "quarterly",
    ANNUAL = "annual",
    CUSTOM = "custom"
}
export declare class Okr {
    id: string;
    title: string;
    description: string;
    type: OkrType;
    frequency: OkrFrequency;
    startDate: Date;
    endDate: Date;
    status: OkrStatus;
    progress: number;
    departmentId: string;
    parentOkrId: string;
    parentOkr: Okr;
    childOkrs: Okr[];
    user: User;
    userId: string;
    keyResults: KeyResult[];
    createdAt: Date;
    updatedAt: Date;
}
