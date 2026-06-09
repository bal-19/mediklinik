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
}
