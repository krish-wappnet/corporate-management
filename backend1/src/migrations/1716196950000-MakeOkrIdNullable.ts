import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeOkrIdNullable1716196950000 implements MigrationInterface {
    name = 'MakeOkrIdNullable1716196950000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key_results" ALTER COLUMN "okr_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key_results" ALTER COLUMN "okr_id" SET NOT NULL`);
    }
}