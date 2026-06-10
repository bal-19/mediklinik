import type { ApiRouter } from '../shared/api-router';
import { ClinicsService } from './clinics.service';
import { ok } from '../shared/response';
import { guardSubscription } from '../shared/subscription';

const clinicsService = new ClinicsService();

export function registerClinicRoutes(router: ApiRouter) {
  router.post(
    '/clinics/register',
    async ({ body }) => ok(await clinicsService.register(body as { clinicName: string; ownerName: string; email: string; password: string }), 'Registrasi klinik berhasil'),
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

  router.get('/clinics/me', async () => ok(await clinicsService.getCurrentClinic()), {
    summary: 'Get active clinic',
    tags: ['Clinics'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.get('/clinics/me/subscription', async () => ok(await clinicsService.getSubscription()), {
    summary: 'Get subscription status',
    tags: ['Clinics'],
    auth: 'bearer',
  });
  router.put('/clinics/me/settings', async () => ok(await clinicsService.getCurrentClinic(), 'Pengaturan klinik diperbarui'), {
    summary: 'Update clinic settings',
    tags: ['Clinics'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.put('/clinics/me/public-page', async () => {
    const clinic = await clinicsService.getCurrentClinic();
    return ok(await clinicsService.getPublicPage(clinic.slug), 'Halaman publik diperbarui');
  }, {
    summary: 'Update public clinic page',
    tags: ['Clinics'],
    auth: 'bearer',
    subscriptionRequired: true,
  });

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
