"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '../../.env') });
async function updateManagerIdNullable() {
    (0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '../../.env') });
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12345',
        database: 'performance_management',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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
        ALTER TABLE "users" ALTER COLUMN "manager_id" DROP NOT NULL;
      `);
            await queryRunner.commitTransaction();
            console.log('Successfully updated users table to make manager_id nullable');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error during database update:', error);
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
updateManagerIdNullable();
//# sourceMappingURL=update-manager-id-nullable.js.map