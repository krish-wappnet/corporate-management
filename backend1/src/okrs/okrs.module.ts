import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OkrsService } from './okrs.service';
import { OkrsController } from './okrs.controller';
import { Okr } from './entities/okr.entity';
import { KeyResult } from './entities/key-result.entity';
import { KeyResultUpdate } from './entities/key-result-update.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Okr, KeyResult, KeyResultUpdate]),
    UsersModule,
  ],
  controllers: [OkrsController],
  providers: [OkrsService],
  exports: [OkrsService],
})
export class OkrsModule {}