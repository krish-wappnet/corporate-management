import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generatePerformanceReport(userId: string, startDate: string, endDate: string, format: "excel" | "pdf" | undefined, res: Response): Promise<void>;
    generateTeamReport(managerId: string, startDate: string, endDate: string, format: "excel" | "pdf" | undefined, res: Response): Promise<void>;
    generateHrDashboardReport(startDate: string, endDate: string, format: "excel" | "pdf" | undefined, res: Response): Promise<void>;
}
