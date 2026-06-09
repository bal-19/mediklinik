import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import { ReportsRepository } from '../repositories/reports.repository';

export class ReportsService {
  private readonly reportsRepository = new ReportsRepository();

  getVisits(): VisitReportPoint[] {
    return this.reportsRepository.getVisits();
  }

  getRevenue(): RevenueReportPoint[] {
    return this.reportsRepository.getRevenue();
  }
}
