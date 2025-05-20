"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeManagerIdNullable1715665800000 = void 0;
class MakeManagerIdNullable1715665800000 {
    constructor() {
        this.name = 'MakeManagerIdNullable1715665800000';
    }
    async up(queryRunner) {
        try {
            await queryRunner.query(`
        ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_e7d1e9ead6b29373a70934554d8"
      `);
        }
        catch (error) {
            console.log('No foreign key constraint found to drop');
        }
        await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "manager_id" DROP NOT NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      UPDATE "users" SET "manager_id" = 'system' WHERE "manager_id" IS NULL
    `);
        await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "manager_id" SET NOT NULL
    `);
    }
}
exports.MakeManagerIdNullable1715665800000 = MakeManagerIdNullable1715665800000;
//# sourceMappingURL=1715665800000-MakeManagerIdNullable.js.map