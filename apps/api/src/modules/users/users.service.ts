import type { DashboardUser, SubscriptionStatus } from '@mediklinik/types';
import { getSupabaseAdminClient } from '../shared/supabase-client';
import { getAuthContext } from '../shared/request-context';

interface CurrentUserRow {
  id: string;
  clinic_id: string | null;
  email: string;
  role: DashboardUser['role'];
  profiles: { full_name: string | null } | Array<{ full_name: string | null }> | null;
  clinics:
    | { subscription_status: SubscriptionStatus }
    | Array<{ subscription_status: SubscriptionStatus }>
    | null;
}

function getFirstProfileName(profile: CurrentUserRow['profiles']) {
  if (Array.isArray(profile)) {
    return profile[0]?.full_name ?? null;
  }

  return profile?.full_name ?? null;
}

function getSubscriptionStatus(clinic: CurrentUserRow['clinics']) {
  if (Array.isArray(clinic)) {
    return clinic[0]?.subscription_status ?? null;
  }

  return clinic?.subscription_status ?? null;
}

export class UsersService {
  async getCurrentUser(): Promise<DashboardUser> {
    const auth = getAuthContext();
    if (!auth) {
      throw new Error('Unauthorized.');
    }

    const { data, error } = await getSupabaseAdminClient()
      .from('users')
      .select('id, clinic_id, email, role, profiles(full_name), clinics!users_clinic_id_fkey(subscription_status)')
      .eq('id', auth.userId)
      .maybeSingle<CurrentUserRow>();

    if (error) {
      throw new Error(`Gagal mengambil profil user: ${error.message}`);
    }

    if (!data) {
      throw new Error('User tidak ditemukan.');
    }

    return {
      id: data.id,
      clinicId: data.clinic_id,
      email: data.email,
      fullName: getFirstProfileName(data.profiles) ?? data.email,
      role: data.role,
      subscriptionStatus: data.role === 'SUPER_ADMIN' ? 'ACTIVE' : (getSubscriptionStatus(data.clinics) ?? 'TRIAL'),
    };
  }
}
