"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeedbackRequestStatus1715759900000 = void 0;
class UpdateFeedbackRequestStatus1715759900000 {
    constructor() {
        this.name = 'UpdateFeedbackRequestStatus1715759900000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "feedback_requests_status_enum_new" AS ENUM('pending', 'approved', 'declined', 'expired')`);
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
        await queryRunner.query(`DROP TYPE "feedback_requests_status_enum"`);
        await queryRunner.query(`ALTER TYPE "feedback_requests_status_enum_new" RENAME TO "feedback_requests_status_enum"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "feedback_requests_status_enum_old" AS ENUM('pending', 'completed', 'declined', 'expired')`);
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
        await queryRunner.query(`ALTER TYPE "feedback_requests_status_enum_old" RENAME TO "feedback_requests_status_enum"`);
    }
}
exports.UpdateFeedbackRequestStatus1715759900000 = UpdateFeedbackRequestStatus1715759900000;
//# sourceMappingURL=1715759900000-UpdateFeedbackRequestStatus.js.map