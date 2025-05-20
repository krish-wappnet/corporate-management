import { Okr } from './okr.entity';
import { KeyResultUpdate } from './key-result-update.entity';
export declare enum KeyResultType {
    BINARY = "binary",
    PERCENTAGE = "percentage",
    NUMBER = "number",
    CURRENCY = "currency"
}
export declare class KeyResult {
    id: string;
    title: string;
    description: string;
    type: KeyResultType;
    startValue: number;
    targetValue: number;
    currentValue: number;
    weight: number;
    progress: number;
    okr: Okr;
    okrId: string | null;
    updates: KeyResultUpdate[];
    createdAt: Date;
    updatedAt: Date;
}
