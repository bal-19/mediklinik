import type { ApiRouter } from '../shared/api-router';
import { ClinicsService } from './clinics.service';
import { ok } from '../shared/response';
import { guardSubscription } from '../shared/subscription';

const clinicsService = new ClinicsService();

export function registerClinicRoutes(router: ApiRouter) {
  router.post('/clinics/register', () =>
    ok(
      {
        clinicId: 'clinic_new',
        ownerUserId: 'user_owner',
        subscriptionStatus: 'TRIAL',
      },
      'Registrasi klinik berhasil',
    ),
  );

  router.get('/clinics/me', () => ok(clinicsService.getCurrentClinic()));
  router.get('/clinics/me/subscription', () => ok(clinicsService.getSubscription()));
  router.put('/clinics/me/settings', () => ok(clinicsService.getCurrentClinic(), 'Pengaturan klinik diperbarui'));
  router.put('/clinics/me/public-page', () => ok(clinicsService.getPublicPage(), 'Halaman publik diperbarui'));
  router.put('/clinics/me/midtrans', () =>
    ok(
      {
        isMidtransConfigured: true,
      },
      'Credential Midtrans klinik berhasil disimpan',
    ),
  );

  router.get('/app/guarded', () => {
    const guard = guardSubscription('TRIAL');
    if (guard) {
      return guard;
    }

    return ok({ allowed: true });
  });
}
