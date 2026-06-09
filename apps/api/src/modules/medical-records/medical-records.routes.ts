import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { MedicalRecordsService } from './medical-records.service';

const medicalRecordsService = new MedicalRecordsService();

export function registerMedicalRecordRoutes(router: ApiRouter) {
  router.get('/medical-records/:patientId', () => ok(medicalRecordsService.getByPatient()), {
    summary: 'List patient medical records',
    tags: ['Medical Records'],
    auth: 'bearer',
  });
  router.get('/medical-records/detail/:id', () => ok(medicalRecordsService.getById()), {
    summary: 'Get medical record detail',
    tags: ['Medical Records'],
    auth: 'bearer',
  });
}
