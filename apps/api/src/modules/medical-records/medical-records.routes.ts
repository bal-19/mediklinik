import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { MedicalRecordsService } from './medical-records.service';

const medicalRecordsService = new MedicalRecordsService();

export function registerMedicalRecordRoutes(router: ApiRouter) {
  router.get('/medical-records/:patientId', async () => ok(await medicalRecordsService.getByPatient()), {
    summary: 'List patient medical records',
    tags: ['Medical Records'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.get('/medical-records/detail/:id', async ({ params }) => ok(await medicalRecordsService.getById(params.id ?? 'mr_1')), {
    summary: 'Get medical record detail',
    tags: ['Medical Records'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.post('/medical-records', async ({ body }) => ok(await medicalRecordsService.create(body as import('@mediklinik/types').CreateMedicalRecordInput), 'Rekam medis dibuat'), {
    summary: 'Create medical record', description: 'Membuat rekam medis yang dapat diedit maksimal 24 jam.', tags: ['Medical Records'], auth: 'bearer', subscriptionRequired: true,
  });
  router.patch('/medical-records/:id', async ({ params, body }) => ok(await medicalRecordsService.update(params.id!, body as import('@mediklinik/types').UpdateMedicalRecordInput), 'Rekam medis diperbarui'), {
    summary: 'Update medical record', description: 'Ditolak jika rekam medis telah berumur 24 jam.', tags: ['Medical Records'], auth: 'bearer', subscriptionRequired: true,
  });
}
