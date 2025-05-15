"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path = __importStar(require("path"));
(0, dotenv_1.config)({ path: path.resolve(__dirname, '../.env') });
async function updateFeedbackStatus() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'performance_management',
    });
    try {
        await dataSource.initialize();
        console.log('Connected to the database');
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const typeExists = await queryRunner.query(`
        SELECT 1 FROM pg_type WHERE typname = 'feedback_requests_status_enum';
      `);
            if (!typeExists || typeExists.length === 0) {
                await queryRunner.query(`
          CREATE TYPE feedback_requests_status_enum AS ENUM ('pending', 'approved', 'declined', 'expired');
        `);
            }
            const defaultConstraint = await queryRunner.query(`
        SELECT conname 
        FROM pg_constraint 
        WHERE conname = 'feedback_requests_status_default';
      `);
            if (defaultConstraint && defaultConstraint.length > 0) {
                await queryRunner.query(`
          ALTER TABLE feedback_requests 
          ALTER COLUMN status DROP DEFAULT;
        `);
            }
            await queryRunner.query(`
        ALTER TABLE feedback_requests 
        ALTER COLUMN status TYPE TEXT 
        USING (
          CASE status::text
            WHEN 'completed' THEN 'approved'
            ELSE status::text
          END
        );
      `);
            await queryRunner.query(`
        ALTER TABLE feedback_requests 
        ALTER COLUMN status TYPE feedback_requests_status_enum 
        USING (status::feedback_requests_status_enum);
      `);
            await queryRunner.query(`
        ALTER TABLE feedback_requests 
        ALTER COLUMN status SET DEFAULT 'pending';
      `);
            await queryRunner.commitTransaction();
            console.log('Successfully updated feedback request status enum');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error during migration:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
    finally {
        await dataSource.destroy();
    }
}
updateFeedbackStatus().catch(console.error);
//# sourceMappingURL=update-feedback-status.js.map