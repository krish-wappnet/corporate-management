"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '../../.env') });
async function runMigration() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12345',
        database: 'performance_management',
        entities: [(0, path_1.join)(__dirname, '../src/**/*.entity{.ts,.js}')],
        synchronize: false,
        logging: true,
    });
    try {
        await dataSource.initialize();
        console.log('Data Source has been initialized!');
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`
        ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_e7d1e9ead6b29373a70934554d8";
      `);
            await queryRunner.query(`
        ALTER TABLE "users" RENAME COLUMN "manager_id" TO "manager_id_old";
      `);
            await queryRunner.query(`
        ALTER TABLE "users" ADD COLUMN "manager_id" character varying;
      `);
            await queryRunner.query(`
        UPDATE "users" SET "manager_id" = "manager_id_old"::text;
      `);
            await queryRunner.query(`
        ALTER TABLE "users" DROP COLUMN "manager_id_old";
      `);
            await queryRunner.commitTransaction();
            console.log('Successfully updated manager_id column type to VARCHAR');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error during database migration:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    catch (error) {
        console.error('Error initializing data source:', error);
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}
runMigration();
//# sourceMappingURL=run-manager-id-migration.js.map