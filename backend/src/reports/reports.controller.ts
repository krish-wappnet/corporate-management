import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('performance/:userId')
  @ApiOperation({ summary: 'Generate a performance summary report for a user' })
  @ApiResponse({ status: 200, description: 'Performance report generated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'format', required: false, enum: ['excel', 'pdf'], schema: { default: 'excel' } })
  async generatePerformanceReport(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: 'excel' | 'pdf' = 'excel',
    @Res() res: Response,
  ): Promise<void> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    let buffer: Buffer;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (format === 'excel') {
      buffer = await this.reportsService.generatePerformanceSummaryExcel(
        userId,
        start,
        end,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=performance_summary_${userId}.xlsx`,
      );
    } else {
      buffer = await this.reportsService.generatePerformanceSummaryPdf(
        userId,
        start,
        end,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=performance_summary_${userId}.pdf`,
      );
    }

    res.send(buffer);
  }

  @Get('team/:managerId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Generate a team performance report' })
  @ApiResponse({ status: 200, description: 'Team performance report generated successfully' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'format', required: false, enum: ['excel', 'pdf'], schema: { default: 'excel' } })
  async generateTeamReport(
    @Param('managerId') managerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: 'excel' | 'pdf' = 'excel',
    @Res() res: Response,
  ): Promise<void> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const buffer = await this.reportsService.generateTeamPerformanceReport(
      managerId,
      new Date(startDate),
      new Date(endDate),
      format,
    );

    if (format === 'excel') {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=team_performance_${managerId}.xlsx`,
      );
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=team_performance_${managerId}.pdf`,
      );
    }

    res.send(buffer);
  }

  @Get('hr-dashboard')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Generate an HR dashboard report' })
  @ApiResponse({ status: 200, description: 'HR dashboard report generated successfully' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'format', required: false, enum: ['excel', 'pdf'], schema: { default: 'excel' } })
  async generateHrDashboardReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: 'excel' | 'pdf' = 'excel',
    @Res() res: Response,
  ): Promise<void> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const buffer = await this.reportsService.generateHrDashboardReport(
      new Date(startDate),
      new Date(endDate),
      format,
    );

    if (format === 'excel') {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=hr_dashboard.xlsx',
      );
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=hr_dashboard.pdf',
      );
    }

    res.send(buffer);
  }
}