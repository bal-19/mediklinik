import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import type { ReportsRepositoryContract } from './contracts';
import { inMemoryDb } from '../shared/in-memory-db';

export class ReportsRepository implements ReportsRepositoryContract {
  getVisits(): VisitReportPoint[] {
    return inMemoryDb.getState().visitReport;
  }

  getRevenue(): RevenueReportPoint[] {
    return inMemoryDb.getState().revenueReport;
  }
}
