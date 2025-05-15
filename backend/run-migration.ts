import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UpdateFeedbackRequestStatus1715759900000 } from './src/migrations/1715759900000-UpdateFeedbackRequestStatus';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'performance_management',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [UpdateFeedbackRequestStatus1715759900000],
  migrationsRun: true,
  logging: true,
});

async function runMigration() {
  try {
    await AppDataSource.initialize();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

runMigration();
