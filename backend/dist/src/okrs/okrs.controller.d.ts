import { OkrsService } from './okrs.service';
import { CreateOkrDto } from './dtos/create-okr.dto';
import { UpdateOkrDto } from './dtos/update-okr.dto';
import { CreateKeyResultDto } from './dtos/create-key-result.dto';
import { UpdateKeyResultDto } from './dtos/update-key-result.dto';
import { CreateKeyResultUpdateDto } from './dtos/create-key-result-update.dto';
import { Okr, OkrStatus, OkrType } from './entities/okr.entity';
import { KeyResult } from './entities/key-result.entity';
import { KeyResultUpdate } from './entities/key-result-update.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
export declare class OkrsController {
    private readonly okrsService;
    constructor(okrsService: OkrsService);
    create(req: any, createOkrDto: CreateOkrDto): Promise<Okr>;
    findAll(paginationDto: PaginationDto, userId?: string, status?: OkrStatus, startDate?: string, endDate?: string, type?: OkrType): Promise<PaginationResponseDto<Okr>>;
    findOne(id: string): Promise<Okr>;
    update(id: string, updateOkrDto: UpdateOkrDto): Promise<Okr>;
    remove(id: string): Promise<void>;
    createKeyResult(okrId: string, createKeyResultDto: CreateKeyResultDto): Promise<KeyResult>;
    findOneKeyResult(id: string): Promise<KeyResult>;
    updateKeyResult(id: string, updateKeyResultDto: UpdateKeyResultDto): Promise<KeyResult>;
    removeKeyResult(id: string): Promise<void>;
    createKeyResultUpdate(req: any, createUpdateDto: CreateKeyResultUpdateDto): Promise<KeyResultUpdate>;
    getKeyResultUpdates(id: string): Promise<KeyResultUpdate[]>;
    getCompletionRate(userId?: string): Promise<{
        total: number;
        completed: number;
        rate: number;
    }>;
    getUserProgress(userId: string): Promise<{
        activeOkrs: number;
        averageProgress: number;
        topPerformingOkr: Partial<Okr>;
    }>;
    getTeamAlignment(managerUserId: string): Promise<Array<{
        userId: string;
        name: string;
        alignmentScore: number;
    }>>;
}
