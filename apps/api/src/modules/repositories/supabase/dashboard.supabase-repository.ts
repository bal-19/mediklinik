import type { DashboardRepositoryContract } from '../contracts';
import type { DashboardSummary } from '@mediklinik/types';
import { SupabaseMedicinesRepository } from './medicines.supabase-repository';
import { SupabaseQueuesRepository } from './queues.supabase-repository';
import { getSupabaseAdminClient } from '../../shared/supabase-client';
import { requireClinicId } from './utils';

export class SupabaseDashboardRepository implements DashboardRepositoryContract {
  private readonly queuesRepository = new SupabaseQueuesRepository();
  private readonly medicinesRepository = new SupabaseMedicinesRepository();

  async getSummary(): Promise<DashboardSummary> {
    const clinicId = requireClinicId();
    const today = new Date().toISOString().slice(0, 10);
    const [queues, lowStockAlerts, invoicesResult, clinicResult] = await Promise.all([
      this.queuesRepository.listToday(),
      this.medicinesRepository.listLowStock(),
      getSupabaseAdminClient().from('invoices').select('total_amount').eq('clinic_id', clinicId).eq('status', 'PAID').gte('paid_at', `${today}T00:00:00.000Z`),
      getSupabaseAdminClient().from('clinics').select('subscription_status, subscription_plan, trial_expires_at, subscription_expires_at').eq('id', clinicId).single(),
    ]);
    if (invoicesResult.error) throw new Error(`Gagal mengambil pendapatan hari ini: ${invoicesResult.error.message}`);
    if (clinicResult.error || !clinicResult.data) throw new Error(`Gagal mengambil subscription klinik: ${clinicResult.error?.message ?? 'data tidak ditemukan.'}`);

    const currentQueue = [...queues]
      .sort((left, right) => left.queueNumber.localeCompare(right.queueNumber))
      .find((item) => item.status === 'IN_PROGRESS' || item.status === 'CALLED' || item.status === 'WAITING');

    return {
      todayQueueNumber: currentQueue?.queueNumber ?? 'A-000',
      activeQueueCount: queues.filter((item) => item.status !== 'DONE' && item.status !== 'SKIP').length,
      totalPatientsToday: queues.length,
      todayRevenue: (invoicesResult.data ?? []).reduce((total, invoice) => total + Number(invoice.total_amount), 0),
      lowStockAlerts,
      subscription: {
        status: clinicResult.data.subscription_status,
        plan: clinicResult.data.subscription_plan,
        trialExpiresAt: clinicResult.data.trial_expires_at,
        subscriptionExpiresAt: clinicResult.data.subscription_expires_at,
        daysRemaining: calculateDaysRemaining(clinicResult.data.subscription_expires_at ?? clinicResult.data.trial_expires_at),
      },
    };
  }
}

function calculateDaysRemaining(value: string | null) {
  if (!value) return 0;
  return Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}
