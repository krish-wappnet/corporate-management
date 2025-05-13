import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpisService } from './kpis.service';
import { KpisController } from './kpis.controller';
import { Kpi } from './entities/kpi.entity';
import { KpiUpdate } from './entities/kpi-update.entity';
import { KpiCategory } from './entities/kpi-category.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kpi, KpiUpdate, KpiCategory]),
    UsersModule,
  ],
  controllers: [KpisController],
  providers: [KpisService],
  exports: [KpisService],
})
export class KpisModule {}