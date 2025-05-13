import { OkrStatus, OkrType, OkrFrequency } from '../entities/okr.entity';
import { CreateKeyResultDto } from './create-key-result.dto';
export declare class CreateOkrDto {
    title: string;
    description?: string;
    type?: OkrType;
    frequency?: OkrFrequency;
    startDate: string;
    endDate: string;
    status?: OkrStatus;
    progress?: number;
    departmentId?: string;
    parentOkrId?: string;
    userId?: string;
    keyResults: CreateKeyResultDto[];
}
