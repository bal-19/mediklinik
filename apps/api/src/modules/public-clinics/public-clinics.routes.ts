import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { PublicClinicsService } from './public-clinics.service';

const publicClinicsService = new PublicClinicsService();

export function registerPublicClinicRoutes(router: ApiRouter) {
  router.get('/public/clinics/:slug', () => ok(publicClinicsService.getClinicBySlug()));
  router.get('/public/clinics/:slug/doctors', () => ok(publicClinicsService.getDoctorsByClinicSlug()));
  router.post('/public/clinics/:slug/queue', () =>
    ok(publicClinicsService.registerQueue(), 'Nomor antrian berhasil dibuat'),
  );
}
