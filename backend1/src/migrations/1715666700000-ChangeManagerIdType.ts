import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeManagerIdType1715666700000 implements MigrationInterface {
  name = 'ChangeManagerIdType1715666700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, drop any foreign key constraints
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
  }


  public async down(queryRunner: QueryRunner): Promise<void> {
    // This is a one-way migration - we can't reliably convert back to UUID
    // as the values might not be valid UUIDs anymore
    throw new Error('This migration cannot be reverted');
  }
}
