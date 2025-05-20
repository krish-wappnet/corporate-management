import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
    logger.log('Seeding completed successfully');
  } catch (error) {
    logger.error('Seeding failed');
    logger.error(error);
  } finally {
    await app.close();
  }
}

bootstrap();