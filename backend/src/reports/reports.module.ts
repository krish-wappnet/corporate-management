import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PerformanceModule } from '../performance/performance.module';
import { KpisModule } from '../kpis/kpis.module';
import { OkrsModule } from '../okrs/okrs.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PerformanceModule,
    KpisModule,
    OkrsModule,
    FeedbackModule,
    UsersModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}