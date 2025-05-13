import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seeds/seed.service';
import { User } from '../users/entities/user.entity';
import { KpiCategory } from '../kpis/entities/kpi-category.entity';
import { FeedbackCycle } from '../feedback/entities/feedback-cycle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, KpiCategory, FeedbackCycle]),
  ],
  providers: [SeedService],
  exports: [SeedService, TypeOrmModule],
})
export class DatabaseModule {}