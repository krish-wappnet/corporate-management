"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeOkrIdNullable1716196950000 = void 0;
class MakeOkrIdNullable1716196950000 {
    constructor() {
        this.name = 'MakeOkrIdNullable1716196950000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "key_results" ALTER COLUMN "okr_id" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "key_results" ALTER COLUMN "okr_id" SET NOT NULL`);
    }
}
exports.MakeOkrIdNullable1716196950000 = MakeOkrIdNullable1716196950000;
//# sourceMappingURL=1716196950000-MakeOkrIdNullable.js.map