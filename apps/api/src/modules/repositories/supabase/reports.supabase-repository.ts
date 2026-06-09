import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import type { ReportsRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';

export class SupabaseReportsRepository implements ReportsRepositoryContract {
  getVisits(): VisitReportPoint[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseReportsRepository.getVisits belum diimplementasikan penuh.');
  }

  getRevenue(): RevenueReportPoint[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseReportsRepository.getRevenue belum diimplementasikan penuh.');
  }
}

function notImplemented(message: string): never {
  throw new Error(message);
}
