import type { DashboardRepositoryContract } from '../contracts';
import type { DashboardSummary } from '@mediklinik/types';
import { getSupabaseAdminClient } from '../../shared/supabase-client';

export class SupabaseDashboardRepository implements DashboardRepositoryContract {
  getSummary(): DashboardSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseDashboardRepository belum diimplementasikan penuh. Gunakan provider memory atau lanjutkan integrasi query agregasi.');
  }
}

function notImplemented(message: string): never {
  throw new Error(message);
}
