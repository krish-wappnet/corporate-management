import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
config({ path: join(__dirname, '../../.env') });

async function runMigration() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'performance_management',
    entities: [join(__dirname, '../src/**/*.entity{.ts,.js}')],
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
      // Drop any existing foreign key constraints
      await queryRunner.query(`
        ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_e7d1e9ead6b29373a70934554d8";
      `);

      // Rename the existing column
      await queryRunner.query(`
        ALTER TABLE "users" RENAME COLUMN "manager_id" TO "manager_id_old";
      `);

      // Add the new column as varchar
      await queryRunner.query(`
        ALTER TABLE "users" ADD COLUMN "manager_id" character varying;
      `);

      // Copy data from old column to new column
      await queryRunner.query(`
        UPDATE "users" SET "manager_id" = "manager_id_old"::text;
      `);

      // Drop the old column
      await queryRunner.query(`
        ALTER TABLE "users" DROP COLUMN "manager_id_old";
      `);

      await queryRunner.commitTransaction();
      console.log('Successfully updated manager_id column type to VARCHAR');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during database migration:', error);
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

runMigration();
