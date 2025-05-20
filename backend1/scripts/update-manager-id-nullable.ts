import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
config({ path: join(__dirname, '../../.env') });

async function updateManagerIdNullable() {
  // Load environment variables from .env file
  config({ path: join(__dirname, '../../.env') });

  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'performance_management',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Drop the foreign key constraint if it exists
      await queryRunner.query(`
        ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_e7d1e9ead6b29373a70934554d8";
      `);
      
      // Make the manager_id column nullable
      await queryRunner.query(`
        ALTER TABLE "users" ALTER COLUMN "manager_id" DROP NOT NULL;
      `);

      await queryRunner.commitTransaction();
      console.log('Successfully updated users table to make manager_id nullable');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during database update:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('Error initializing data source:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

updateManagerIdNullable();
