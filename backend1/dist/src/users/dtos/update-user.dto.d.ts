import { Role } from '../../common/enums/role.enum';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roles?: Role[];
    position?: string;
    department?: string;
    managerId?: string | null;
}
