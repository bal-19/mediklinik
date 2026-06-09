import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import type { ReportsRepositoryContract } from './contracts';
import { inMemoryDb } from '../shared/in-memory-db';

export class ReportsRepository implements ReportsRepositoryContract {
  async getVisits(): Promise<VisitReportPoint[]> {
    return inMemoryDb.getState().visitReport;
  }

  async getRevenue(): Promise<RevenueReportPoint[]> {
    return inMemoryDb.getState().revenueReport;
  }
}
