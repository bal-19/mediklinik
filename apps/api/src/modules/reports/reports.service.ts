import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import { revenueReport, visitReport } from '../shared/mock-data';

export class ReportsService {
  getVisits(): VisitReportPoint[] {
    return visitReport;
  }

  getRevenue(): RevenueReportPoint[] {
    return revenueReport;
  }
}
