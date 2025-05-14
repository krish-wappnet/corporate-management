import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddDepartments1747141457511 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
