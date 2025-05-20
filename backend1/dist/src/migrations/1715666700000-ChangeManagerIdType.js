"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeManagerIdType1715666700000 = void 0;
class ChangeManagerIdType1715666700000 {
    constructor() {
        this.name = 'ChangeManagerIdType1715666700000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_e7d1e9ead6b29373a70934554d8";
    `);
        await queryRunner.query(`
      ALTER TABLE "users" RENAME COLUMN "manager_id" TO "manager_id_old";
    `);
        await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "manager_id" character varying;
    `);
        await queryRunner.query(`
      UPDATE "users" SET "manager_id" = "manager_id_old"::text;
    `);
        await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "manager_id_old";
    `);
    }
    async down(queryRunner) {
        throw new Error('This migration cannot be reverted');
    }
}
exports.ChangeManagerIdType1715666700000 = ChangeManagerIdType1715666700000;
//# sourceMappingURL=1715666700000-ChangeManagerIdType.js.map