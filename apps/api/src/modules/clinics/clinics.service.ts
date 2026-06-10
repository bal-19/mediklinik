import type {
  ClinicPublicPage,
  ClinicSummary,
  SubscriptionSummary,
} from '@mediklinik/types';
import { getSupabaseAdminClient } from '../shared/supabase-client';
import { getAuthContext } from '../shared/request-context';

export class ClinicsService {
  private mapClinicSummary(clinic: {
    id: string;
    slug: string;
    name: string;
    subscription_plan: ClinicSummary['subscriptionPlan'];
    subscription_status: ClinicSummary['subscriptionStatus'];
    trial_expires_at: string | null;
    subscription_expires_at: string | null;
  }): ClinicSummary {
    return {
      id: clinic.id,
      slug: clinic.slug,
      name: clinic.name,
      subscriptionPlan: clinic.subscription_plan,
      subscriptionStatus: clinic.subscription_status,
      trialExpiresAt: clinic.trial_expires_at,
      subscriptionExpiresAt: clinic.subscription_expires_at,
    };
  }

  async listAccessibleClinics(): Promise<ClinicSummary[]> {
    const auth = getAuthContext();
    if (!auth) {
      throw new Error('Unauthorized.');
    }

    let query = getSupabaseAdminClient()
      .from('clinics')
      .select('id, slug, name, subscription_plan, subscription_status, trial_expires_at, subscription_expires_at')
      .order('created_at', { ascending: true });

    if (auth.role !== 'SUPER_ADMIN') {
      if (!auth.clinicId) {
        throw new Error('Clinic context tidak ditemukan untuk user ini.');
      }
      query = query.eq('id', auth.clinicId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Gagal mengambil data klinik: ${error.message}`);
    }

    return (data ?? []).map((clinic) => this.mapClinicSummary(clinic));
  }

  async getCurrentClinic(): Promise<ClinicSummary> {
    const auth = getAuthContext();
    if (!auth) {
      throw new Error('Unauthorized.');
    }

    if (auth.role === 'SUPER_ADMIN' && !auth.clinicId) {
      throw new Error('SUPER_ADMIN harus memilih klinik untuk endpoint /clinics/me.');
    }

    if (!auth.clinicId) {
      throw new Error('Clinic context tidak ditemukan untuk user ini.');
    }

    const { data, error } = await getSupabaseAdminClient()
      .from('clinics')
      .select('id, slug, name, subscription_plan, subscription_status, trial_expires_at, subscription_expires_at')
      .eq('id', auth.clinicId)
      .maybeSingle();

    if (error) {
      throw new Error(`Gagal mengambil klinik aktif: ${error.message}`);
    }

    if (!data) {
      throw new Error('Klinik aktif tidak ditemukan.');
    }

    return this.mapClinicSummary(data);
  }

  async getSubscription(): Promise<SubscriptionSummary> {
    const clinic = await this.getCurrentClinic();
    const targetDate = clinic.subscriptionExpiresAt ?? clinic.trialExpiresAt;
    const daysRemaining = targetDate
      ? Math.max(0, Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0;

    return {
      status: clinic.subscriptionStatus,
      plan: clinic.subscriptionPlan,
      trialExpiresAt: clinic.trialExpiresAt,
      subscriptionExpiresAt: clinic.subscriptionExpiresAt,
      daysRemaining,
    };
  }

  async getPublicPage(slug: string): Promise<ClinicPublicPage> {
    const { data, error } = await getSupabaseAdminClient()
      .from('clinics')
      .select('id, slug, name, public_description, public_address, public_phone, public_open_hours, subscription_status, is_public_page_visible')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw new Error(`Gagal mengambil halaman publik klinik: ${error.message}`);
    if (!data) throw new Error('Klinik tidak ditemukan.');
    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.public_description ?? '',
      address: data.public_address ?? '',
      phone: data.public_phone ?? '',
      openHours: data.public_open_hours ?? {},
      subscriptionStatus: data.subscription_status,
      isPublicPageVisible: data.is_public_page_visible,
    };
  }

  async register(input: { clinicName: string; ownerName: string; email: string; password: string }) {
    const slug = input.clinicName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const trialExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: clinic, error: clinicError } = await getSupabaseAdminClient().from('clinics').insert({
      name: input.clinicName,
      slug,
      subscription_status: 'TRIAL',
      subscription_plan: 'CLINIC',
      trial_expires_at: trialExpiresAt,
    }).select('id').single();
    if (clinicError || !clinic) throw new Error(`Gagal membuat klinik: ${clinicError?.message ?? 'insert gagal.'}`);

    const passwordHash = await Bun.password.hash(input.password, { algorithm: 'bcrypt' });
    const { data: user, error: userError } = await getSupabaseAdminClient().from('users').insert({
      clinic_id: clinic.id, email: input.email, password_hash: passwordHash, role: 'ADMIN', is_active: true,
    }).select('id').single();
    if (userError || !user) throw new Error(`Gagal membuat pemilik klinik: ${userError?.message ?? 'insert gagal.'}`);

    const { error: profileError } = await getSupabaseAdminClient().from('profiles').insert({ user_id: user.id, full_name: input.ownerName });
    if (profileError) throw new Error(`Gagal membuat profil pemilik: ${profileError.message}`);
    const { error: ownerError } = await getSupabaseAdminClient().from('clinics').update({ owner_user_id: user.id }).eq('id', clinic.id);
    if (ownerError) throw new Error(`Gagal menetapkan pemilik klinik: ${ownerError.message}`);
    return { clinicId: clinic.id, ownerUserId: user.id, subscriptionStatus: 'TRIAL' as const };
  }
}
