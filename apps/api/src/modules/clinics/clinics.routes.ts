import type { ApiRouter } from '../shared/api-router';
import { ClinicsService } from './clinics.service';
import { ok } from '../shared/response';
import { guardSubscription } from '../shared/subscription';

const clinicsService = new ClinicsService();

export function registerClinicRoutes(router: ApiRouter) {
  router.post(
    '/clinics/register',
    () =>
      ok(
        {
          clinicId: 'clinic_new',
          ownerUserId: 'user_owner',
          subscriptionStatus: 'TRIAL',
        },
        'Registrasi klinik berhasil',
      ),
    {
      summary: 'Register clinic',
      description: 'Registrasi klinik baru dari landing page dan aktifkan trial 14 hari.',
      tags: ['Clinics'],
      auth: 'public',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ClinicRegisterRequest' },
          },
        },
      },
    },
  );

  router.get('/clinics', async () => ok(await clinicsService.listAccessibleClinics()), {
    summary: 'List accessible clinics',
    description: 'SUPER_ADMIN dapat melihat semua klinik. Role tenant lain hanya melihat klinik aktifnya.',
    tags: ['Clinics'],
    auth: 'bearer',
  });

  router.get('/clinics/me', () => ok(clinicsService.getCurrentClinic()), {
    summary: 'Get active clinic',
    tags: ['Clinics'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.get('/clinics/me/subscription', () => ok(clinicsService.getSubscription()), {
    summary: 'Get subscription status',
    tags: ['Clinics'],
    auth: 'bearer',
  });
  router.put('/clinics/me/settings', () => ok(clinicsService.getCurrentClinic(), 'Pengaturan klinik diperbarui'), {
    summary: 'Update clinic settings',
    tags: ['Clinics'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.put('/clinics/me/public-page', () => ok(clinicsService.getPublicPage(), 'Halaman publik diperbarui'), {
    summary: 'Update public clinic page',
    tags: ['Clinics'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.put(
    '/clinics/me/midtrans',
    async ({ body }) => ok(await clinicsService.saveMidtransCredentials(body as { serverKey: string; clientKey: string; merchantId?: string }), 'Credential Midtrans klinik berhasil disimpan'),
    {
      summary: 'Update clinic Midtrans credentials',
      description: 'Simpan credential Midtrans klinik secara terenkripsi. Frontend hanya menerima status setup.',
      tags: ['Clinics'],
      auth: 'bearer',
      subscriptionRequired: true,
    },
  );

  router.get('/app/guarded', () => {
    const guard = guardSubscription('TRIAL');
    if (guard) {
      return guard;
    }

    return ok({ allowed: true });
  }, {
    summary: 'Subscription guard probe',
    tags: ['Clinics'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
}
