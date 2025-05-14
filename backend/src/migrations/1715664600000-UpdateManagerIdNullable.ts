import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateManagerIdNullable1715664600000 implements MigrationInterface {
  name = 'UpdateManagerIdNullable1715664600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "manager_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "manager_id" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Set default value for existing null values
    await queryRunner.query(`UPDATE "users" SET "manager_id" = 'system' WHERE "manager_id" IS NULL`);
    
    // Set the column back to NOT NULL
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "manager_id" SET NOT NULL`);
    
    // Optionally, you can set a default value if needed
    // await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "manager_id" SET DEFAULT 'system'`);
  }
}
