import { KeyResultType } from '../entities/key-result.entity';
export declare class UpdateKeyResultDto {
    title?: string;
    description?: string;
    type?: KeyResultType;
    startValue?: number;
    targetValue?: number;
    currentValue?: number;
    weight?: number;
    progress?: number;
}
