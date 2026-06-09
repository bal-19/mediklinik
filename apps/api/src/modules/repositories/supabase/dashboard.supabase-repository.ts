import type { DashboardRepositoryContract } from '../contracts';
import type { DashboardSummary } from '@mediklinik/types';
import { DashboardRepository } from '../dashboard.repository';
import { ReportsRepository } from '../reports.repository';
import { SupabaseMedicinesRepository } from './medicines.supabase-repository';
import { SupabaseQueuesRepository } from './queues.supabase-repository';

export class SupabaseDashboardRepository implements DashboardRepositoryContract {
  private readonly queuesRepository = new SupabaseQueuesRepository();
  private readonly medicinesRepository = new SupabaseMedicinesRepository();

  async getSummary(): Promise<DashboardSummary> {
    const [queues, lowStockAlerts] = await Promise.all([
      this.queuesRepository.listToday(),
      this.medicinesRepository.listLowStock(),
    ]);

    const currentQueue = [...queues]
      .sort((left, right) => left.queueNumber.localeCompare(right.queueNumber))
      .find((item) => item.status === 'IN_PROGRESS' || item.status === 'CALLED' || item.status === 'WAITING');

    return {
      todayQueueNumber: currentQueue?.queueNumber ?? 'A-000',
      activeQueueCount: queues.filter((item) => item.status !== 'DONE' && item.status !== 'SKIP').length,
      totalPatientsToday: queues.length,
      todayRevenue: 0,
      lowStockAlerts,
      subscription: {
        status: 'TRIAL',
        plan: 'CLINIC',
        trialExpiresAt: null,
        subscriptionExpiresAt: null,
        daysRemaining: 0,
      },
    };
  }
}
