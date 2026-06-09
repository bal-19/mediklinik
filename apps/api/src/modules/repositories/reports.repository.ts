import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import { inMemoryDb } from '../shared/in-memory-db';

export class ReportsRepository {
  getVisits(): VisitReportPoint[] {
    return inMemoryDb.getState().visitReport;
  }

  getRevenue(): RevenueReportPoint[] {
    return inMemoryDb.getState().revenueReport;
  }
}
