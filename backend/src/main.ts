import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SeedService } from './database/seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('Seeding database...');
    const seedService = app.get(SeedService);
    await seedService.seed();
    console.log('Seeding completed!');
    await app.close();
  } catch (error) {
    console.error('Seeding failed!', error);
    await app.close();
    process.exit(1);
  }

  const server = await NestFactory.create(AppModule);

  // Security
  server.use(helmet());
  server.enableCors();

  // Validation
  server.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Corporate Performance Management API')
    .setDescription('API for the Corporate Performance Management Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(server, config);
  SwaggerModule.setup('api', server, document);

  // Start server
  await server.listen(3000);
  console.log(`Application is running on: ${await server.getUrl()}`);
}
bootstrap();