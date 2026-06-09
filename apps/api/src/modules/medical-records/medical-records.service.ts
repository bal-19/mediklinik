import type { MedicalRecordSummary } from '@mediklinik/types';
import { getMedicalRecordsRepository } from '../repositories';

export class MedicalRecordsService {
  private readonly medicalRecordsRepository = getMedicalRecordsRepository();

  async getByPatient(): Promise<MedicalRecordSummary[]> {
    return this.medicalRecordsRepository.listByPatient();
  }

  async getById(recordId = 'mr_1'): Promise<MedicalRecordSummary> {
    return this.medicalRecordsRepository.findById(recordId);
  }
}
