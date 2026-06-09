import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import { getReportsRepository } from '../repositories';

export class ReportsService {
  private readonly reportsRepository = getReportsRepository();

  getVisits(): VisitReportPoint[] {
    return this.reportsRepository.getVisits();
  }

  getRevenue(): RevenueReportPoint[] {
    return this.reportsRepository.getRevenue();
  }
}
