"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDepartments1747141457511 = void 0;
class AddDepartments1747141457511 {
    constructor() {
        this.name = 'AddDepartments1747141457511';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "departments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "manager_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8681da666ad9699d568b3e91064" UNIQUE ("name"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "departments"`);
    }
}
exports.AddDepartments1747141457511 = AddDepartments1747141457511;
//# sourceMappingURL=1747141457511-AddDepartments.js.map