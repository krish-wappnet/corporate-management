import { Okr } from '../../okrs/entities/okr.entity';
import { User } from '../../users/entities/user.entity';
export declare class Department {
    id: string;
    name: string;
    description?: string;
    manager: User | null;
    managerId: string | null;
    createdAt: Date;
    updatedAt: Date;
    okrs: Okr[];
}
