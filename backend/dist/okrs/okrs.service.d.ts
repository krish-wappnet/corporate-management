import { Repository } from 'typeorm';
import { Okr, OkrStatus, OkrType } from './entities/okr.entity';
import { KeyResult } from './entities/key-result.entity';
import { KeyResultUpdate } from './entities/key-result-update.entity';
import { CreateOkrDto } from './dtos/create-okr.dto';
import { UpdateOkrDto } from './dtos/update-okr.dto';
import { CreateKeyResultDto } from './dtos/create-key-result.dto';
import { UpdateKeyResultDto } from './dtos/update-key-result.dto';
import { CreateKeyResultUpdateDto } from './dtos/create-key-result-update.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { UsersService } from '../users/users.service';
export declare class OkrsService {
    private okrsRepository;
    private keyResultsRepository;
    private keyResultUpdatesRepository;
    private usersService;
    constructor(okrsRepository: Repository<Okr>, keyResultsRepository: Repository<KeyResult>, keyResultUpdatesRepository: Repository<KeyResultUpdate>, usersService: UsersService);
    createOkr(userId: string, createOkrDto: CreateOkrDto): Promise<Okr>;
    findAllOkrs(paginationDto?: PaginationDto, filters?: {
        userId?: string;
        status?: OkrStatus;
        startDate?: Date;
        endDate?: Date;
        type?: OkrType;
    }): Promise<PaginationResponseDto<Okr>>;
    findOkrById(id: string): Promise<Okr>;
    updateOkr(id: string, updateOkrDto: UpdateOkrDto): Promise<Okr>;
    deleteOkr(id: string): Promise<void>;
    createKeyResult(okrId: string, createKeyResultDto: CreateKeyResultDto): Promise<KeyResult>;
    findKeyResultById(id: string): Promise<KeyResult>;
    updateKeyResult(id: string, updateKeyResultDto: UpdateKeyResultDto): Promise<KeyResult>;
    deleteKeyResult(id: string): Promise<void>;
    createKeyResultUpdate(userId: string, createUpdateDto: CreateKeyResultUpdateDto): Promise<KeyResultUpdate>;
    getKeyResultUpdates(keyResultId: string): Promise<KeyResultUpdate[]>;
    private recalculateOkrProgress;
    getOkrCompletionRate(userId?: string): Promise<{
        total: number;
        completed: number;
        rate: number;
    }>;
    getUserOkrProgress(userId: string): Promise<{
        activeOkrs: number;
        averageProgress: number;
        topPerformingOkr: Partial<Okr>;
    }>;
    getTeamOkrAlignment(managerUserId: string): Promise<Array<{
        userId: string;
        name: string;
        alignmentScore: number;
    }>>;
}
