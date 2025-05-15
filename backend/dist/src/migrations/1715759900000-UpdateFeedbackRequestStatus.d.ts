import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UpdateFeedbackRequestStatus1715759900000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
