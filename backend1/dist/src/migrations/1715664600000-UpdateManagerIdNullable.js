"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManagerIdNullable1715664600000 = void 0;
class UpdateManagerIdNullable1715664600000 {
    constructor() {
        this.name = 'UpdateManagerIdNullable1715664600000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "manager_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "manager_id" DROP DEFAULT`);
    }
    async down(queryRunner) {
        await queryRunner.query(`UPDATE "users" SET "manager_id" = 'system' WHERE "manager_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "manager_id" SET NOT NULL`);
    }
}
exports.UpdateManagerIdNullable1715664600000 = UpdateManagerIdNullable1715664600000;
//# sourceMappingURL=1715664600000-UpdateManagerIdNullable.js.map