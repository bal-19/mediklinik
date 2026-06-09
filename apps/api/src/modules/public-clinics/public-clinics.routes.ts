import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { PublicClinicsService } from './public-clinics.service';

const publicClinicsService = new PublicClinicsService();

export function registerPublicClinicRoutes(router: ApiRouter) {
  router.get('/public/clinics/:slug', () => ok(publicClinicsService.getClinicBySlug()), {
    summary: 'Get public clinic page',
    tags: ['Public Clinics'],
    auth: 'public',
  });
  router.get('/public/clinics/:slug/doctors', () => ok(publicClinicsService.getDoctorsByClinicSlug()), {
    summary: 'List public doctors by clinic slug',
    tags: ['Public Clinics'],
    auth: 'public',
  });
  router.post(
    '/public/clinics/:slug/queue',
    () => ok(publicClinicsService.registerQueue(), 'Nomor antrian berhasil dibuat'),
    {
      summary: 'Register public queue',
      description: 'Pasien mengambil nomor antrian dari halaman publik klinik. Membutuhkan auth patient pada implementasi penuh.',
      tags: ['Public Clinics'],
      auth: 'bearer',
    },
  );
}
