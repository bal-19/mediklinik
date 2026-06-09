import type { MedicalRecordSummary } from '@mediklinik/types';
import { MedicalRecordsRepository } from '../repositories/medical-records.repository';

export class MedicalRecordsService {
  private readonly medicalRecordsRepository = new MedicalRecordsRepository();

  getByPatient(): MedicalRecordSummary[] {
    return this.medicalRecordsRepository.listByPatient();
  }

  getById(): MedicalRecordSummary {
    return this.medicalRecordsRepository.findById('mr_1');
  }
}
