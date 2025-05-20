import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFeedbackRequestStatus1715759900000 implements MigrationInterface {
  name = 'UpdateFeedbackRequestStatus1715759900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create a new type with the updated values
    await queryRunner.query(
      `CREATE TYPE "feedback_requests_status_enum_new" AS ENUM('pending', 'approved', 'declined', 'expired')`,
    );

    // Update the column to use the new type with a temporary cast
    await queryRunner.query(`
      ALTER TABLE "feedback_requests" 
      ALTER COLUMN "status" TYPE "feedback_requests_status_enum_new" 
      USING (
        CASE "status"::text
          WHEN 'completed' THEN 'approved'::text
          ELSE "status"::text
        END
      )::"feedback_requests_status_enum_new"
    `);

    // Drop the old type
    await queryRunner.query(`DROP TYPE "feedback_requests_status_enum"`);

    // Rename the new type to the original name
    await queryRunner.query(
      `ALTER TYPE "feedback_requests_status_enum_new" RENAME TO "feedback_requests_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes if needed
    await queryRunner.query(
      `CREATE TYPE "feedback_requests_status_enum_old" AS ENUM('pending', 'completed', 'declined', 'expired')`,
    );

    await queryRunner.query(`
      ALTER TABLE "feedback_requests" 
      ALTER COLUMN "status" TYPE "feedback_requests_status_enum_old" 
      USING (
        CASE "status"::text
          WHEN 'approved' THEN 'completed'::text
          ELSE "status"::text
        END
      )::"feedback_requests_status_enum_old"
    `);

    await queryRunner.query(`DROP TYPE "feedback_requests_status_enum"`);
    
    await queryRunner.query(
      `ALTER TYPE "feedback_requests_status_enum_old" RENAME TO "feedback_requests_status_enum"`,
    );
  }
}
