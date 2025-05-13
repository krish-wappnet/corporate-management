import { Buffer } from 'buffer';
import { PerformanceService } from '../performance/performance.service';
import { KpisService } from '../kpis/kpis.service';
import { OkrsService } from '../okrs/okrs.service';
import { FeedbackService } from '../feedback/feedback.service';
import { UsersService } from '../users/users.service';
export declare class ReportsService {
    private performanceService;
    private kpisService;
    private okrsService;
    private feedbackService;
    private usersService;
    constructor(performanceService: PerformanceService, kpisService: KpisService, okrsService: OkrsService, feedbackService: FeedbackService, usersService: UsersService);
    generatePerformanceSummaryExcel(userId: string, startDate: Date, endDate: Date): Promise<Buffer>;
    generatePerformanceSummaryPdf(userId: string, startDate: Date, endDate: Date): Promise<Buffer>;
    generateTeamPerformanceReport(managerId: string, startDate: Date, endDate: Date, format?: 'excel' | 'pdf'): Promise<Buffer>;
    generateHrDashboardReport(startDate: Date, endDate: Date, format?: 'excel' | 'pdf'): Promise<Buffer>;
    private generateTeamPerformancePdf;
    private generateTeamPerformanceExcel;
    private generateHrDashboardPdf;
    private generateHrDashboardExcel;
}
