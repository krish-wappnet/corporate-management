import { OkrStatus, OkrType, OkrFrequency } from '../entities/okr.entity';
export declare class UpdateOkrDto {
    title?: string;
    description?: string;
    type?: OkrType;
    frequency?: OkrFrequency;
    startDate?: string;
    endDate?: string;
    status?: OkrStatus;
    progress?: number;
    departmentId?: string;
    parentOkrId?: string;
    userId?: string;
}
