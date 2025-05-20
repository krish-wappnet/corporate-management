import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// Initialize pdfmake with fonts
const pdf = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

// Set the fonts to use
pdf.vfs = vfsFonts.pdfMake.vfs;
import { Buffer } from 'buffer';
import { PerformanceService } from '../performance/performance.service';
import { KpisService } from '../kpis/kpis.service';
import { OkrsService } from '../okrs/okrs.service';
import { FeedbackService } from '../feedback/feedback.service';
import { UsersService } from '../users/users.service';

// Set default font
(pdfMake as any).fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

@Injectable()
export class ReportsService {
  constructor(
    private performanceService: PerformanceService,
    private kpisService: KpisService,
    private okrsService: OkrsService,
    private feedbackService: FeedbackService,
    private usersService: UsersService,
  ) {}

  async generatePerformanceSummaryExcel(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Get user details
    const user = await this.usersService.findOne(userId);

    // Get performance data
    const performanceTrend = await this.performanceService.getUserPerformanceTrend(
      userId,
      { start: startDate, end: endDate },
    );

    // Get KPI data
    const kpiCompletionRate = await this.kpisService.getKpiCompletionRate(userId);

    // Get OKR data
    const okrProgress = await this.okrsService.getUserOkrProgress(userId);

    // Get feedback data
    const feedbackRatings = await this.feedbackService.getAverageFeedbackRatings(userId);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Performance Management System';
    workbook.lastModifiedBy = 'Performance Management System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Add Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add header with styling
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
    
    // Add user info section
    summarySheet.addRow([]);
    summarySheet.addRow(['Employee Information']);
    summarySheet.addRow(['Name', `${user.firstName} ${user.lastName}`]);
    summarySheet.addRow(['Position', user.position || 'N/A']);
    summarySheet.addRow(['Department', user.department || 'N/A']);
    summarySheet.addRow(['Email', user.email]);
    
    // Add performance overview
    summarySheet.addRow([]);
    summarySheet.addRow(['Performance Overview']);
    
    const lastRating = performanceTrend.length > 0 
      ? performanceTrend[performanceTrend.length - 1].rating 
      : 'N/A';
      
    summarySheet.addRow(['Latest Performance Rating', lastRating]);
    summarySheet.addRow(['KPI Completion Rate', `${kpiCompletionRate.rate.toFixed(2)}%`]);
    summarySheet.addRow(['Active OKRs', okrProgress.activeOkrs]);
    summarySheet.addRow(['Average OKR Progress', `${okrProgress.averageProgress.toFixed(2)}%`]);
    
    // Add Performance Trend Sheet
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
    
    // Add Feedback Ratings Sheet
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
    
    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generatePerformanceSummaryPdf(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Get user details
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Get performance data
    const performanceTrend = await this.performanceService.getUserPerformanceTrend(
      userId,
      { start: startDate, end: endDate },
    );

    // Get feedback ratings (using getFeedbackStats as fallback since getFeedbackRatings doesn't exist)
    const feedbackStats = await this.feedbackService.getFeedbackStats(userId);
    const feedbackRatings = []; // Initialize empty array for feedback ratings
    
    // Mock data for 360 feedback (replace with actual implementation)
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

    // Define fonts
    const fonts = {
      Roboto: {
        normal: Buffer.from(
          'AAEAAAASAQAABAAgR0RFRgBKAAgAAAFMAAAAJkdQT1MF3vKQAAABdAAAAKRHU1VCDakLOwAAAhgAAAAwT1MvMnSaAagAAAKoAAAAYGNtYXABBwGMAAADCAAAAUJjdnQgAD8H1AAAAkwAAABIZnBnbVwuyK8AAAWUAAABvGdhc3AACAATAAABNAAAAAxnbHlmZAYAAAAABVAAACj8aGRteBYRJRoAAAE4AAAAFGhlYWT8atJ6AAACiAAAADZoaGVhCroD7AAAAaAAAAAkaG10eC17BHMAAAJEAAAAXGxvY2FB+j3YAAACVAAAADBtYXhwAjkCMAAAAWAAAAAYbmFtZdjryIYAAAr0AAABqnBvc3T/uAAyAAABOAAAACBwcmVwKnc2MQAABLgAAAFX',
          'base64',
        ),
        bold: Buffer.from(
          'AAEAAAASAQAABAAgR0RFRgBKAAgAAAFMAAAAJkdQT1MF3vawAAABdAAAAQxHU1VCDawLPAAAAiAAAAAwT1MvMniaAaYAAALIAAAAYGNtYXABGgHQAAADKAAAAWhjdnQgAEAH1AAAAlQAAABQZnBnbV7vZrQAAAYIAAABs2dhc3AACAATAAABNAAAAAxnbHlm9SCeXgAABYAAACWQaGRteA4RIBoAAAE4AAAAFGhlYWT8a9J8AAACqAAAADZoaGVhCroD7AAAAaAAAAAkaG10eCf7AzAAAAJUAAAARmxvY2E70DVmAAACZAAAACZtYXhwAkQCOgAAAWAAAAAYbmFtZfSuRnEAAAvcAAAB6nBvc3T/uAAyAAABOAAAACBwcmVwTZUzZgAABJgAAAFX',
          'base64',
        ),
      },
    };

    // Create document definition
    const docDefinition: TDocumentDefinitions = {
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

    // Add ratings data to the document
    const content = docDefinition.content as any[];
    
    // Add performance trend if available
    if (performanceTrend && performanceTrend.length > 0) {
      content.push({
        text: 'Performance Trend',
        style: 'sectionHeader'
      });
      
      // Add performance trend data as a table
      const trendData = [
        ['Period', 'Rating'],
        ...performanceTrend.map((item: any) => [
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

    // Add feedback ratings if available
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
            ...feedbackRatings.map((rating: any) => [rating.category, rating.score])
          ]
        },
        margin: [0, 5, 0, 20]
      });
    }

    // Add 360 Feedback Section if data exists
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
          ul: feedback360.strengthsSummary.slice(0, 5), // Limit to 5 for brevity
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
          ul: feedback360.improvementsSummary.slice(0, 5), // Limit to 5 for brevity
          margin: [20, 0, 0, 10]
        });
      }
    }

    // Create PDF document
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const pdfDoc = pdf.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];
        
        pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
        pdfDoc.on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        });
        
        pdfDoc.end();
      } catch (error) {
        console.error('Error generating PDF:', error);
        reject(error);
      }
    });
  }

  async generateTeamPerformanceReport(
    managerId: string,
    startDate: Date,
    endDate: Date,
    format: 'excel' | 'pdf' = 'excel',
  ): Promise<Buffer> {
    // Implementation for team performance report
    // This is a placeholder - implement according to your requirements
    if (format === 'pdf') {
      return this.generateTeamPerformancePdf(managerId, startDate, endDate);
    } else {
      return this.generateTeamPerformanceExcel(managerId, startDate, endDate);
    }
  }

  async generateHrDashboardReport(
    startDate: Date,
    endDate: Date,
    format: 'excel' | 'pdf' = 'excel',
  ): Promise<Buffer> {
    // Implementation for HR dashboard report
    // This is a placeholder - implement according to your requirements
    if (format === 'pdf') {
      return this.generateHrDashboardPdf(startDate, endDate);
    } else {
      return this.generateHrDashboardExcel(startDate, endDate);
    }
  }

  private async generateTeamPerformancePdf(
    managerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Implementation for team performance PDF report
    return Buffer.from([]);
  }

  private async generateTeamPerformanceExcel(
    managerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Implementation for team performance Excel report
    return Buffer.from([]);
  }

  private async generateHrDashboardPdf(
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Implementation for HR dashboard PDF report
    return Buffer.from([]);
  }

  private async generateHrDashboardExcel(
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Implementation for HR dashboard Excel report
    return Buffer.from([]);
  }
}