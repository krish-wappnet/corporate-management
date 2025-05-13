import { KeyResultType } from '../entities/key-result.entity';
export declare class CreateKeyResultDto {
    title: string;
    description?: string;
    type?: KeyResultType;
    startValue?: number;
    targetValue: number;
    currentValue?: number;
    weight?: number;
}
