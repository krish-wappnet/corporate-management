import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeManagerIdNullable1715665800000 implements MigrationInterface {
  name = 'MakeManagerIdNullable1715665800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, drop any constraints that might be referencing the manager_id column
    try {
      await queryRunner.query(`
        ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_e7d1e9ead6b29373a70934554d8"
      `);
    } catch (error) {
      console.log('No foreign key constraint found to drop');
    }

    // Then alter the column to allow NULL values
    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "manager_id" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // If there are any NULL values, set them to a default value
    await queryRunner.query(`
      UPDATE "users" SET "manager_id" = 'system' WHERE "manager_id" IS NULL
    `);

    // Then set the column back to NOT NULL
    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "manager_id" SET NOT NULL
    `);
  }
}
