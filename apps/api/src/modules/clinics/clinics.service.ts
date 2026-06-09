import type {
  ClinicPublicPage,
  ClinicSummary,
  SubscriptionSummary,
} from '@mediklinik/types';

export class ClinicsService {
  getCurrentClinic(): ClinicSummary {
    return {
      id: 'clinic_demo',
      slug: 'klinik-sehat',
      name: 'Klinik Sehat Sentosa',
      subscriptionPlan: 'CLINIC',
      subscriptionStatus: 'TRIAL',
      trialExpiresAt: '2026-06-23T00:00:00.000Z',
      subscriptionExpiresAt: null,
      isMidtransConfigured: false,
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
}
