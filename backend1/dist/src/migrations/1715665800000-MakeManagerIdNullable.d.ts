import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class MakeManagerIdNullable1715665800000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
