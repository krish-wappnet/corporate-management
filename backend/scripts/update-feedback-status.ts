import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
config({ path: path.resolve(__dirname, '../.env') });

async function updateFeedbackStatus() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'performance_management',
  });

  try {
    await dataSource.initialize();
    console.log('Connected to the database');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if the type already exists
      const typeExists = await queryRunner.query(`
        SELECT 1 FROM pg_type WHERE typname = 'feedback_requests_status_enum';
      `);

      if (!typeExists || typeExists.length === 0) {
        // Create a new enum type with 'approved' instead of 'completed'
        await queryRunner.query(`
          CREATE TYPE feedback_requests_status_enum AS ENUM ('pending', 'approved', 'declined', 'expired');
        `);
      }

      // First, drop the default constraint if it exists
      const defaultConstraint = await queryRunner.query(`
        SELECT conname 
        FROM pg_constraint 
        WHERE conname = 'feedback_requests_status_default';
      `);

      if (defaultConstraint && defaultConstraint.length > 0) {
        await queryRunner.query(`
          ALTER TABLE feedback_requests 
          ALTER COLUMN status DROP DEFAULT;
        `);
      }

      // Now alter the column type
      await queryRunner.query(`
        ALTER TABLE feedback_requests 
        ALTER COLUMN status TYPE TEXT 
        USING (
          CASE status::text
            WHEN 'completed' THEN 'approved'
            ELSE status::text
          END
        );
      `);

      // Then alter it to the new enum type
      await queryRunner.query(`
        ALTER TABLE feedback_requests 
        ALTER COLUMN status TYPE feedback_requests_status_enum 
        USING (status::feedback_requests_status_enum);
      `);

      // Restore the default value
      await queryRunner.query(`
        ALTER TABLE feedback_requests 
        ALTER COLUMN status SET DEFAULT 'pending';
      `);



      await queryRunner.commitTransaction();
      console.log('Successfully updated feedback request status enum');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during migration:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await dataSource.destroy();
  }
}

updateFeedbackStatus().catch(console.error);
