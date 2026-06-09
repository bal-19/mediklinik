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
