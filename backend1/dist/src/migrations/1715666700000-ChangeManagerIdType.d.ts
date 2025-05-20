import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class ChangeManagerIdType1715666700000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
