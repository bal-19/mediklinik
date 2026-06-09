import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import { getReportsRepository } from '../repositories';

export class ReportsService {
  private readonly reportsRepository = getReportsRepository();

  async getVisits(): Promise<VisitReportPoint[]> {
    return this.reportsRepository.getVisits();
  }

  async getRevenue(): Promise<RevenueReportPoint[]> {
    return this.reportsRepository.getRevenue();
  }
}
