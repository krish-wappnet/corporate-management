import { User } from '../../users/entities/user.entity';
import { KeyResult } from './key-result.entity';
export declare class KeyResultUpdate {
    id: string;
    value: number;
    note: string;
    keyResult: KeyResult;
    keyResultId: string;
    createdBy: User;
    createdById: string;
    createdAt: Date;
}
