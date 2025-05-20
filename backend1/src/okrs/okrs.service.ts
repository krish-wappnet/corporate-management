import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  Repository, 
  In, 
  FindOptionsWhere, 
  MoreThanOrEqual, 
  LessThanOrEqual, 
  Between, 
  EntityManager 
} from 'typeorm';
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

@Injectable()
export class OkrsService {
  constructor(
    @InjectRepository(Okr)
    private okrsRepository: Repository<Okr>,
    @InjectRepository(KeyResult)
    private keyResultsRepository: Repository<KeyResult>,
    @InjectRepository(KeyResultUpdate)
    private keyResultUpdatesRepository: Repository<KeyResultUpdate>,
    private usersService: UsersService,
  ) {}

  // OKR Methods
  async createOkr(userId: string, createOkrDto: CreateOkrDto): Promise<Okr> {
    // Validate dates
    const startDate = new Date(createOkrDto.startDate);
    const endDate = new Date(createOkrDto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Verify user exists if provided
    if (createOkrDto.userId) {
      await this.usersService.findOne(createOkrDto.userId);
    }

    // Verify parent OKR exists if provided
    if (createOkrDto.parentOkrId) {
      await this.findOkrById(createOkrDto.parentOkrId);
    }

    // Create OKR with key results
    return this.okrsRepository.manager.transaction(async (manager: EntityManager) => {
      // Create the OKR
      const okr = manager.create(Okr, {
        ...createOkrDto,
        startDate,
        endDate,
        userId: createOkrDto.userId || userId, // If no userId provided, use creator
      });

      // Save OKR first
      const savedOkr = await manager.save(okr);

      // Create and save key results if they exist
      if (createOkrDto.keyResults && createOkrDto.keyResults.length > 0) {
        const keyResults = createOkrDto.keyResults.map((krDto: CreateKeyResultDto) => {
          return manager.create(KeyResult, {
            ...krDto,
            okrId: savedOkr.id,
            // Initialize progress
            progress: 0,
            // Set defaults if not provided
            weight: krDto.weight || 1,
            startValue: krDto.startValue || 0,
            currentValue: krDto.currentValue || 0,
          });
        });

        await manager.save(keyResults);
      }

      // Return full OKR with key results
      return this.findOkrById(savedOkr.id);
    });
  }

  async findAllOkrs(
    paginationDto: PaginationDto = { page: 1, limit: 10 },
    filters?: {
      userId?: string;
      status?: OkrStatus;
      startDate?: Date;
      endDate?: Date;
      type?: OkrType;
    },
  ): Promise<PaginationResponseDto<Okr>> {
    const page = Math.max(1, paginationDto.page ?? 1);
    const limit = Math.max(1, Math.min(100, paginationDto.limit ?? 10));
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Okr> = {};

    // Apply filters if provided
    if (filters) {
      if (filters.userId) {
        where.user = { id: filters.userId };
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.startDate && filters.endDate) {
        where.startDate = Between(filters.startDate, filters.endDate);
      } else {
        if (filters.startDate) {
          where.startDate = MoreThanOrEqual(new Date(filters.startDate));
        }
        if (filters.endDate) {
          where.endDate = LessThanOrEqual(new Date(filters.endDate));
        }
      }
      if (filters.type) {
        where.type = filters.type;
      }
    }

    // Get total count and paginated results
    const [items, total] = await this.okrsRepository.findAndCount({
      where,
      relations: ['user', 'keyResults', 'keyResults.progressUpdates', 'parentOkr'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return new PaginationResponseDto<Okr>(items, total, page, limit);
  }

  async findOkrById(id: string): Promise<Okr> {
    const okr = await this.okrsRepository.findOne({
      where: { id },
      relations: [
        'user',
        'keyResults',
        'parentOkr',
        'childOkrs',
        'keyResults.updates',
        'keyResults.updates.createdBy',
      ],
    });

    if (!okr) {
      throw new NotFoundException(`OKR with ID "${id}" not found`);
    }

    return okr;
  }

  async updateOkr(id: string, updateOkrDto: UpdateOkrDto): Promise<Okr> {
    const okr = await this.findOkrById(id);

    // Validate dates if both are provided
    if (updateOkrDto.startDate && updateOkrDto.endDate) {
      const startDate = new Date(updateOkrDto.startDate);
      const endDate = new Date(updateOkrDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    } else if (updateOkrDto.startDate) {
      const startDate = new Date(updateOkrDto.startDate);
      const endDate = okr.endDate;

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    } else if (updateOkrDto.endDate) {
      const startDate = okr.startDate;
      const endDate = new Date(updateOkrDto.endDate);

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Verify user exists if provided
    if (updateOkrDto.userId) {
      await this.usersService.findOne(updateOkrDto.userId);
    }

    // Verify parent OKR exists if provided and not itself
    if (updateOkrDto.parentOkrId) {
      if (updateOkrDto.parentOkrId === id) {
        throw new BadRequestException('OKR cannot be its own parent');
      }
      await this.findOkrById(updateOkrDto.parentOkrId);
    }

    // Update OKR
    const updatedOkr = this.okrsRepository.merge(okr, {
      ...updateOkrDto,
      startDate: updateOkrDto.startDate
        ? new Date(updateOkrDto.startDate)
        : okr.startDate,
      endDate: updateOkrDto.endDate ? new Date(updateOkrDto.endDate) : okr.endDate,
    });

    await this.okrsRepository.save(updatedOkr);
    return this.findOkrById(id);
  }

  async deleteOkr(id: string): Promise<void> {
    const okr = await this.findOkrById(id);
    await this.okrsRepository.remove(okr);
  }

  // Key Result Methods
  async createKeyResult(
    okrId: string,
    createKeyResultDto: CreateKeyResultDto,
  ): Promise<KeyResult> {
    // Verify OKR exists
    const okr = await this.findOkrById(okrId);

    // Create key result
    const keyResult = this.keyResultsRepository.create({
      ...createKeyResultDto,
      okrId,
      progress: 0,
      // Set defaults if not provided
      weight: createKeyResultDto.weight || 1,
      startValue: createKeyResultDto.startValue || 0,
      currentValue: createKeyResultDto.currentValue || 0,
    });

    const savedKeyResult = await this.keyResultsRepository.save(keyResult);

    // Update OKR progress
    await this.recalculateOkrProgress(okrId);

    return savedKeyResult;
  }

  async findKeyResultById(id: string): Promise<KeyResult> {
    const keyResult = await this.keyResultsRepository.findOne({
      where: { id },
      relations: ['okr', 'updates', 'updates.createdBy'],
    });

    if (!keyResult) {
      throw new NotFoundException(`Key Result with ID "${id}" not found`);
    }

    return keyResult;
  }

  async updateKeyResult(
    id: string,
    updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<KeyResult> {
    const keyResult = await this.findKeyResultById(id);

    // Update key result
    const updatedKeyResult = this.keyResultsRepository.merge(keyResult, updateKeyResultDto);

    // If current value changed, calculate progress
    if (
      updateKeyResultDto.currentValue !== undefined &&
      updateKeyResultDto.currentValue !== keyResult.currentValue
    ) {
      const targetDiff = updatedKeyResult.targetValue - updatedKeyResult.startValue;
      const currentDiff = updatedKeyResult.currentValue - updatedKeyResult.startValue;
      
      if (targetDiff !== 0) {
        updatedKeyResult.progress = Math.min(
          100,
          Math.max(0, (currentDiff / targetDiff) * 100),
        );
      } else {
        updatedKeyResult.progress = updatedKeyResult.currentValue >= updatedKeyResult.targetValue ? 100 : 0;
      }
    }

    await this.keyResultsRepository.save(updatedKeyResult);

    // Recalculate OKR progress if okrId exists
    if (keyResult.okrId) {
      await this.recalculateOkrProgress(keyResult.okrId);
    }

    return this.findKeyResultById(id);
  }

  async deleteKeyResult(id: string): Promise<void> {
    const keyResult = await this.findKeyResultById(id);
    const okrId = keyResult.okrId;
    
    await this.keyResultsRepository.remove(keyResult);
    
    // Recalculate OKR progress if okrId exists
    if (okrId) {
      await this.recalculateOkrProgress(okrId);
    }
  }

  // Key Result Update Methods
  async createKeyResultUpdate(
    userId: string,
    createUpdateDto: CreateKeyResultUpdateDto,
  ): Promise<KeyResultUpdate> {
    // Verify key result exists
    const keyResult = await this.findKeyResultById(createUpdateDto.keyResultId);

    // Create the update
    const update = this.keyResultUpdatesRepository.create({
      ...createUpdateDto,
      createdById: userId,
    });

    const savedUpdate = await this.keyResultUpdatesRepository.save(update);

    // Update key result current value and progress
    const targetDiff = keyResult.targetValue - keyResult.startValue;
    const currentDiff = createUpdateDto.value - keyResult.startValue;
    
    let progress = 0;
    if (targetDiff !== 0) {
      progress = Math.min(100, Math.max(0, (currentDiff / targetDiff) * 100));
    } else {
      progress = createUpdateDto.value >= keyResult.targetValue ? 100 : 0;
    }

    await this.keyResultsRepository.update(keyResult.id, {
      currentValue: createUpdateDto.value,
      progress,
    });

    // Recalculate OKR progress if okrId exists
    if (keyResult.okrId) {
      await this.recalculateOkrProgress(keyResult.okrId);
    }

    return savedUpdate;
  }

  async getKeyResultUpdates(keyResultId: string): Promise<KeyResultUpdate[]> {
    // Verify key result exists
    await this.findKeyResultById(keyResultId);

    // Get updates
    return this.keyResultUpdatesRepository.find({
      where: { keyResultId },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // Helper method to recalculate OKR progress
  private async recalculateOkrProgress(okrId: string): Promise<void> {
    // Get all key results for this OKR
    const keyResults = await this.keyResultsRepository.find({
      where: { okrId },
    });

    if (keyResults.length === 0) {
      await this.okrsRepository.update(okrId, { progress: 0 });
      return;
    }

    // Calculate total weights and weighted progress
    let totalWeight = 0;
    let totalWeightedProgress = 0;

    keyResults.forEach((kr) => {
      totalWeight += kr.weight;
      totalWeightedProgress += kr.progress * kr.weight;
    });

    // Calculate overall progress
    const progress = totalWeight > 0 ? totalWeightedProgress / totalWeight : 0;

    // Update OKR progress
    await this.okrsRepository.update(okrId, { progress });

    // If this is a child OKR, update parent OKR progress too
    const okr = await this.okrsRepository.findOne({
      where: { id: okrId },
      select: ['parentOkrId'],
    });

    if (okr && okr.parentOkrId) {
      await this.recalculateOkrProgress(okr.parentOkrId);
    }
  }

  // Analytics Methods
  async getOkrCompletionRate(userId?: string): Promise<{
    total: number;
    completed: number;
    rate: number;
  }> {
    const where: FindOptionsWhere<Okr> = {};

    if (userId) {
      where.userId = userId;
    }

    const total = await this.okrsRepository.count({ where });
    const completed = await this.okrsRepository.count({
      where: {
        ...where,
        status: OkrStatus.COMPLETED,
      },
    });

    const rate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      rate,
    };
  }

  async getUserOkrProgress(userId: string): Promise<{
    activeOkrs: number;
    averageProgress: number;
    topPerformingOkr: Partial<Okr>;
  }> {
    // Verify user exists
    await this.usersService.findOne(userId);

    // Get active OKRs
    const activeOkrs = await this.okrsRepository.find({
      where: {
        userId,
        status: OkrStatus.ACTIVE,
      },
      select: ['id', 'title', 'progress'],
    });

    if (activeOkrs.length === 0) {
      return {
        activeOkrs: 0,
        averageProgress: 0,
        topPerformingOkr: {} as Partial<Okr>,
      };
    }

    // Calculate average progress
    const totalProgress = activeOkrs.reduce(
      (sum, okr) => sum + Number(okr.progress),
      0,
    );
    const averageProgress = totalProgress / activeOkrs.length;

    // Find top performing OKR
    const topPerformingOkr = activeOkrs.reduce((top, current) => {
      return Number(current.progress) > Number(top.progress) ? current : top;
    }, activeOkrs[0]);

    return {
      activeOkrs: activeOkrs.length,
      averageProgress,
      topPerformingOkr,
    };
  }

  async getTeamOkrAlignment(
    managerUserId: string,
  ): Promise<Array<{ userId: string; name: string; alignmentScore: number }>> {
    // Get manager's direct reports
    const directReports = await this.usersService.getDirectReports(managerUserId);

    if (directReports.length === 0) {
      return [];
    }

    // Get all team members' IDs
    const userIds = directReports.map((user) => user.id);

    // Get manager's OKRs
    const managerOkrs = await this.okrsRepository.find({
      where: { userId: managerUserId },
      select: ['id'],
    });

    if (managerOkrs.length === 0) {
      return directReports.map((user) => ({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        alignmentScore: 0,
      }));
    }

    const managerOkrIds = managerOkrs.map((okr) => okr.id);

    // For each team member, check how many of their OKRs are aligned with manager's OKRs
    const results: Array<{ userId: string; name: string; alignmentScore: number }> = [];

    for (const user of directReports) {
      const userOkrs = await this.okrsRepository.find({
        where: { userId: user.id },
        select: ['id', 'parentOkrId'],
      });

      if (userOkrs.length === 0) {
        results.push({
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          alignmentScore: 0,
        });
        continue;
      }

      // Count aligned OKRs (OKRs that have a parent OKR from the manager)
      const alignedOkrs = userOkrs.filter(
        (okr) => okr.parentOkrId && managerOkrIds.includes(okr.parentOkrId),
      );

      const alignmentScore = (alignedOkrs.length / userOkrs.length) * 100;

      results.push({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        alignmentScore,
      });
    }

    return results;
  }
}