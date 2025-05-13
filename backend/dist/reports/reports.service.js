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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = __importStar(require("exceljs"));
const pdfMake = __importStar(require("pdfmake/build/pdfmake"));
const pdf = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');
pdf.vfs = vfsFonts.pdfMake.vfs;
const buffer_1 = require("buffer");
const performance_service_1 = require("../performance/performance.service");
const kpis_service_1 = require("../kpis/kpis.service");
const okrs_service_1 = require("../okrs/okrs.service");
const feedback_service_1 = require("../feedback/feedback.service");
const users_service_1 = require("../users/users.service");
pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
};
let ReportsService = class ReportsService {
    constructor(performanceService, kpisService, okrsService, feedbackService, usersService) {
        this.performanceService = performanceService;
        this.kpisService = kpisService;
        this.okrsService = okrsService;
        this.feedbackService = feedbackService;
        this.usersService = usersService;
    }
    async generatePerformanceSummaryExcel(userId, startDate, endDate) {
        const user = await this.usersService.findOne(userId);
        const performanceTrend = await this.performanceService.getUserPerformanceTrend(userId, { start: startDate, end: endDate });
        const kpiCompletionRate = await this.kpisService.getKpiCompletionRate(userId);
        const okrProgress = await this.okrsService.getUserOkrProgress(userId);
        const feedbackRatings = await this.feedbackService.getAverageFeedbackRatings(userId);
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Performance Management System';
        workbook.lastModifiedBy = 'Performance Management System';
        workbook.created = new Date();
        workbook.modified = new Date();
        const summarySheet = workbook.addWorksheet('Summary');
        summarySheet.mergeCells('A1:F1');
        const titleRow = summarySheet.getRow(1);
        titleRow.getCell(1).value = `Performance Summary Report: ${user.firstName} ${user.lastName}`;
        titleRow.font = { size: 14, bold: true };
        titleRow.alignment = { horizontal: 'center' };
        summarySheet.mergeCells('A2:F2');
        const dateRow = summarySheet.getRow(2);
        dateRow.getCell(1).value = `Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
        dateRow.font = { size: 12, italic: true };
        dateRow.alignment = { horizontal: 'center' };
        summarySheet.addRow([]);
        summarySheet.addRow(['Employee Information']);
        summarySheet.addRow(['Name', `${user.firstName} ${user.lastName}`]);
        summarySheet.addRow(['Position', user.position || 'N/A']);
        summarySheet.addRow(['Department', user.department || 'N/A']);
        summarySheet.addRow(['Email', user.email]);
        summarySheet.addRow([]);
        summarySheet.addRow(['Performance Overview']);
        const lastRating = performanceTrend.length > 0
            ? performanceTrend[performanceTrend.length - 1].rating
            : 'N/A';
        summarySheet.addRow(['Latest Performance Rating', lastRating]);
        summarySheet.addRow(['KPI Completion Rate', `${kpiCompletionRate.rate.toFixed(2)}%`]);
        summarySheet.addRow(['Active OKRs', okrProgress.activeOkrs]);
        summarySheet.addRow(['Average OKR Progress', `${okrProgress.averageProgress.toFixed(2)}%`]);
        if (performanceTrend.length > 0) {
            const trendSheet = workbook.addWorksheet('Performance Trend');
            trendSheet.columns = [
                { header: 'Period', key: 'period', width: 20 },
                { header: 'Rating', key: 'rating', width: 15 },
            ];
            trendSheet.getRow(1).font = { bold: true };
            performanceTrend.forEach(item => {
                trendSheet.addRow({ period: item.period, rating: item.rating });
            });
        }
        if (Object.keys(feedbackRatings).length > 0) {
            const feedbackSheet = workbook.addWorksheet('Feedback Ratings');
            feedbackSheet.columns = [
                { header: 'Category', key: 'category', width: 25 },
                { header: 'Average Rating', key: 'rating', width: 15 },
            ];
            feedbackSheet.getRow(1).font = { bold: true };
            Object.entries(feedbackRatings).forEach(([category, rating]) => {
                feedbackSheet.addRow({ category, rating });
            });
        }
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer_1.Buffer.from(buffer);
    }
    async generatePerformanceSummaryPdf(userId, startDate, endDate) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const performanceTrend = await this.performanceService.getUserPerformanceTrend(userId, { start: startDate, end: endDate });
        const feedbackStats = await this.feedbackService.getFeedbackStats(userId);
        const feedbackRatings = [];
        const feedback360 = {
            feedbackCount: 5,
            averageRatings: {
                'Communication': 4.2,
                'Teamwork': 4.5,
                'Problem Solving': 4.0,
            },
            strengthsSummary: [
                'Great team player',
                'Excellent communication skills',
                'Reliable and punctual',
            ],
            improvementsSummary: [
                'Could improve time management',
                'Needs to delegate more effectively',
            ],
        };
        const fonts = {
            Roboto: {
                normal: buffer_1.Buffer.from('AAEAAAASAQAABAAgR0RFRgBKAAgAAAFMAAAAJkdQT1MF3vKQAAABdAAAAKRHU1VCDakLOwAAAhgAAAAwT1MvMnSaAagAAAKoAAAAYGNtYXABBwGMAAADCAAAAUJjdnQgAD8H1AAAAkwAAABIZnBnbVwuyK8AAAWUAAABvGdhc3AACAATAAABNAAAAAxnbHlmZAYAAAAABVAAACj8aGRteBYRJRoAAAE4AAAAFGhlYWT8atJ6AAACiAAAADZoaGVhCroD7AAAAaAAAAAkaG10eC17BHMAAAJEAAAAXGxvY2FB+j3YAAACVAAAADBtYXhwAjkCMAAAAWAAAAAYbmFtZdjryIYAAAr0AAABqnBvc3T/uAAyAAABOAAAACBwcmVwKnc2MQAABLgAAAFX', 'base64'),
                bold: buffer_1.Buffer.from('AAEAAAASAQAABAAgR0RFRgBKAAgAAAFMAAAAJkdQT1MF3vawAAABdAAAAQxHU1VCDawLPAAAAiAAAAAwT1MvMniaAaYAAALIAAAAYGNtYXABGgHQAAADKAAAAWhjdnQgAEAH1AAAAlQAAABQZnBnbV7vZrQAAAYIAAABs2dhc3AACAATAAABNAAAAAxnbHlm9SCeXgAABYAAACWQaGRteA4RIBoAAAE4AAAAFGhlYWT8a9J8AAACqAAAADZoaGVhCroD7AAAAaAAAAAkaG10eCf7AzAAAAJUAAAARmxvY2E70DVmAAACZAAAACZtYXhwAkQCOgAAAWAAAAAYbmFtZfSuRnEAAAvcAAAB6nBvc3T/uAAyAAABOAAAACBwcmVwTZUzZgAABJgAAAFX', 'base64'),
            },
        };
        const docDefinition = {
            content: [
                {
                    text: `Performance Summary Report: ${user.firstName} ${user.lastName}`,
                    style: 'header',
                    margin: [0, 0, 0, 10]
                },
                {
                    text: `Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
                    style: 'subheader',
                    margin: [0, 0, 0, 20]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center'
                },
                subheader: {
                    fontSize: 14,
                    italics: true,
                    alignment: 'center'
                },
                sectionHeader: {
                    fontSize: 16,
                    bold: true,
                    decoration: 'underline',
                    margin: [0, 15, 0, 5]
                }
            }
        };
        const content = docDefinition.content;
        if (performanceTrend && performanceTrend.length > 0) {
            content.push({
                text: 'Performance Trend',
                style: 'sectionHeader'
            });
            const trendData = [
                ['Period', 'Rating'],
                ...performanceTrend.map((item) => [
                    item.period || 'N/A',
                    item.rating?.toString() || 'N/A'
                ])
            ];
            content.push({
                table: {
                    headerRows: 1,
                    widths: ['*', 100],
                    body: trendData
                },
                margin: [0, 5, 0, 20]
            });
        }
        if (feedbackRatings && feedbackRatings.length > 0) {
            content.push({
                text: 'Feedback Ratings',
                style: 'sectionHeader'
            });
            content.push({
                table: {
                    headerRows: 1,
                    widths: ['*', 100],
                    body: [
                        ['Category', 'Rating'],
                        ...feedbackRatings.map((rating) => [rating.category, rating.score])
                    ]
                },
                margin: [0, 5, 0, 20]
            });
        }
        if (feedback360.feedbackCount > 0) {
            content.push({
                text: '360° Feedback Summary',
                style: 'sectionHeader'
            });
            content.push({
                text: `Total Feedback Received: ${feedback360.feedbackCount}`,
                margin: [0, 5, 0, 10]
            });
            if (Object.keys(feedback360.averageRatings).length > 0) {
                const ratingsData = [
                    ['Category', 'Average Rating'],
                    ...Object.entries(feedback360.averageRatings).map(([category, rating]) => [
                        category,
                        typeof rating === 'number' ? rating.toFixed(2) : rating
                    ])
                ];
                content.push({
                    table: {
                        headerRows: 1,
                        widths: ['*', 100],
                        body: ratingsData
                    },
                    margin: [0, 5, 0, 15]
                });
            }
            if (feedback360.strengthsSummary?.length > 0) {
                content.push({
                    text: 'Strengths Highlighted:',
                    bold: true,
                    margin: [0, 10, 0, 5]
                });
                content.push({
                    ul: feedback360.strengthsSummary.slice(0, 5),
                    margin: [20, 0, 0, 10]
                });
            }
            if (feedback360.improvementsSummary?.length > 0) {
                content.push({
                    text: 'Areas for Improvement:',
                    bold: true,
                    margin: [0, 10, 0, 5]
                });
                content.push({
                    ul: feedback360.improvementsSummary.slice(0, 5),
                    margin: [20, 0, 0, 10]
                });
            }
        }
        return new Promise((resolve, reject) => {
            try {
                const pdfDoc = pdf.createPdfKitDocument(docDefinition);
                const chunks = [];
                pdfDoc.on('data', (chunk) => chunks.push(chunk));
                pdfDoc.on('end', () => {
                    const result = buffer_1.Buffer.concat(chunks);
                    resolve(result);
                });
                pdfDoc.end();
            }
            catch (error) {
                console.error('Error generating PDF:', error);
                reject(error);
            }
        });
    }
    async generateTeamPerformanceReport(managerId, startDate, endDate, format = 'excel') {
        if (format === 'pdf') {
            return this.generateTeamPerformancePdf(managerId, startDate, endDate);
        }
        else {
            return this.generateTeamPerformanceExcel(managerId, startDate, endDate);
        }
    }
    async generateHrDashboardReport(startDate, endDate, format = 'excel') {
        if (format === 'pdf') {
            return this.generateHrDashboardPdf(startDate, endDate);
        }
        else {
            return this.generateHrDashboardExcel(startDate, endDate);
        }
    }
    async generateTeamPerformancePdf(managerId, startDate, endDate) {
        return buffer_1.Buffer.from([]);
    }
    async generateTeamPerformanceExcel(managerId, startDate, endDate) {
        return buffer_1.Buffer.from([]);
    }
    async generateHrDashboardPdf(startDate, endDate) {
        return buffer_1.Buffer.from([]);
    }
    async generateHrDashboardExcel(startDate, endDate) {
        return buffer_1.Buffer.from([]);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [performance_service_1.PerformanceService,
        kpis_service_1.KpisService,
        okrs_service_1.OkrsService,
        feedback_service_1.FeedbackService,
        users_service_1.UsersService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map