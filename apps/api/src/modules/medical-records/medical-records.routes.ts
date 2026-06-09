import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { MedicalRecordsService } from './medical-records.service';

const medicalRecordsService = new MedicalRecordsService();

export function registerMedicalRecordRoutes(router: ApiRouter) {
  router.get('/medical-records/:patientId', () => ok(medicalRecordsService.getByPatient()));
  router.get('/medical-records/detail/:id', () => ok(medicalRecordsService.getById()));
}
