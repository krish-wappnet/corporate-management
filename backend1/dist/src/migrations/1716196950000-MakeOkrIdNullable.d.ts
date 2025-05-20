import { MigrationInterface, QueryRunner } from "typeorm";
export declare class MakeOkrIdNullable1716196950000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
