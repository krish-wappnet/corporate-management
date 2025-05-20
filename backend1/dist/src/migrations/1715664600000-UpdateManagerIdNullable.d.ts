import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UpdateManagerIdNullable1715664600000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
