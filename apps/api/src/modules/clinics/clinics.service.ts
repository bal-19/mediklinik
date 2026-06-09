import type {
  ClinicPublicPage,
  ClinicSummary,
  SubscriptionSummary,
} from '@mediklinik/types';
import { canUseSupabaseRepositories, getSupabaseAdminClient } from '../shared/supabase-client';
import { getAuthContext } from '../shared/request-context';
import { CredentialEncryptionService } from './credential-encryption.service';

export class ClinicsService {
  private readonly encryption = new CredentialEncryptionService();
  private midtransConfigured = false;

  async listAccessibleClinics(): Promise<ClinicSummary[]> {
    const auth = getAuthContext();
    if (!auth) {
      throw new Error('Unauthorized.');
    }

    if (canUseSupabaseRepositories()) {
      let query = getSupabaseAdminClient()
        .from('clinics')
        .select('id, slug, name, subscription_plan, subscription_status, trial_expires_at, subscription_expires_at, midtrans_server_key_encrypted')
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

      return (data ?? []).map((clinic) => ({
        id: clinic.id,
        slug: clinic.slug,
        name: clinic.name,
        subscriptionPlan: clinic.subscription_plan,
        subscriptionStatus: clinic.subscription_status,
        trialExpiresAt: clinic.trial_expires_at,
        subscriptionExpiresAt: clinic.subscription_expires_at,
        isMidtransConfigured: Boolean(clinic.midtrans_server_key_encrypted),
      }));
    }

    if (auth.role === 'SUPER_ADMIN') {
      return [
        {
          id: 'clinic_demo',
          slug: 'klinik-sehat',
          name: 'Klinik Sehat Sentosa',
          subscriptionPlan: 'CLINIC',
          subscriptionStatus: 'TRIAL',
          trialExpiresAt: '2026-06-23T00:00:00.000Z',
          subscriptionExpiresAt: null,
          isMidtransConfigured: this.midtransConfigured,
        },
        {
          id: 'clinic_expired',
          slug: 'klinik-expired',
          name: 'Klinik Masa Berlalu',
          subscriptionPlan: 'STARTER',
          subscriptionStatus: 'EXPIRED',
          trialExpiresAt: null,
          subscriptionExpiresAt: '2026-06-02T00:00:00.000Z',
          isMidtransConfigured: false,
        },
      ];
    }

    return [this.getCurrentClinic()];
  }

  getCurrentClinic(): ClinicSummary {
    return {
      id: 'clinic_demo',
      slug: 'klinik-sehat',
      name: 'Klinik Sehat Sentosa',
      subscriptionPlan: 'CLINIC',
      subscriptionStatus: 'TRIAL',
      trialExpiresAt: '2026-06-23T00:00:00.000Z',
      subscriptionExpiresAt: null,
      isMidtransConfigured: this.midtransConfigured,
    };
  }

  getSubscription(): SubscriptionSummary {
    return {
      status: 'TRIAL',
      plan: 'CLINIC',
      trialExpiresAt: '2026-06-23T00:00:00.000Z',
      subscriptionExpiresAt: null,
      daysRemaining: 14,
    };
  }

  getPublicPage(): ClinicPublicPage {
    return {
      slug: 'klinik-sehat',
      name: 'Klinik Sehat Sentosa',
      description: 'Klinik keluarga dengan layanan umum, vaksin, dan konsultasi harian.',
      address: 'Jl. Sehat No. 10, Jakarta',
      phone: '021-555-0101',
      openHours: {
        mon: '08:00-17:00',
        tue: '08:00-17:00',
        wed: '08:00-17:00',
        thu: '08:00-17:00',
        fri: '08:00-17:00',
        sat: '08:00-13:00',
        sun: 'Tutup',
      },
      subscriptionStatus: 'TRIAL',
      isPublicPageVisible: true,
    };
  }

  async saveMidtransCredentials(input: { serverKey: string; clientKey: string; merchantId?: string }) {
    if (!input.serverKey || !input.clientKey) throw new Error('Server key dan client key Midtrans wajib diisi.');
    const encryptedServerKey = this.encryption.encrypt(input.serverKey);
    const encryptedClientKey = this.encryption.encrypt(input.clientKey);
    if (canUseSupabaseRepositories()) {
      const clinicId = getAuthContext()?.clinicId;
      if (!clinicId) {
        throw new Error('Clinic context tidak ditemukan untuk menyimpan credential Midtrans.');
      }
      const { error } = await getSupabaseAdminClient().from('clinics').update({
        midtrans_server_key_encrypted: encryptedServerKey,
        midtrans_client_key_encrypted: encryptedClientKey,
        merchant_id: input.merchantId,
      }).eq('id', clinicId);
      if (error) throw new Error(`Gagal menyimpan credential Midtrans: ${error.message}`);
    }
    this.midtransConfigured = true;
    return { isMidtransConfigured: true };
  }
}
