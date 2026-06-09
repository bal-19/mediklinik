import type { MedicalRecordSummary } from '@mediklinik/types';
import { getMedicalRecordsRepository } from '../repositories';

export class MedicalRecordsService {
  private readonly medicalRecordsRepository = getMedicalRecordsRepository();

  getByPatient(): MedicalRecordSummary[] {
    return this.medicalRecordsRepository.listByPatient();
  }

  getById(): MedicalRecordSummary {
    return this.medicalRecordsRepository.findById('mr_1');
  }
}
