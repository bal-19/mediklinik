import type { RevenueReportPoint, VisitReportPoint } from '@mediklinik/types';
import type { ReportsRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';
import { requireClinicId } from './utils';

export class SupabaseReportsRepository implements ReportsRepositoryContract {
  async getVisits(): Promise<VisitReportPoint[]> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('queues')
      .select('created_at')
      .eq('clinic_id', clinicId);

    if (error) {
      throw new Error(`Gagal mengambil data kunjungan: ${error.message}`);
    }

    return aggregateByMonth((data ?? []).map((row) => row.created_at), 'visits');
  }

  async getRevenue(): Promise<RevenueReportPoint[]> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('invoices')
      .select('created_at, total_amount')
      .eq('clinic_id', clinicId)
      .in('status', ['PAID', 'PARTIAL']);

    if (error) {
      throw new Error(`Gagal mengambil data pendapatan: ${error.message}`);
    }

    return aggregateRevenueByMonth(data ?? []);
  }
}

function aggregateByMonth(createdAtValues: Array<string | undefined>, mode: 'visits'): VisitReportPoint[] {
  const map = new Map<string, number>();
  for (const value of createdAtValues) {
    if (!value) continue;
    const month = new Date(value).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    map.set(month, (map.get(month) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([month, totalVisits]) => ({
    month,
    totalVisits,
  }));
}

function aggregateRevenueByMonth(rows: Array<{ created_at?: string; total_amount?: number }>): RevenueReportPoint[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    if (!row.created_at) continue;
    const month = new Date(row.created_at).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    map.set(month, (map.get(month) ?? 0) + Number(row.total_amount ?? 0));
  }

  return Array.from(map.entries()).map(([month, totalRevenue]) => ({
    month,
    totalRevenue,
  }));
}
