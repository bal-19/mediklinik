import type { CreateMedicalRecordInput, MedicalRecordSummary, UpdateMedicalRecordInput } from '@mediklinik/types';
import { getMedicalRecordsRepository } from '../repositories';

export class MedicalRecordsService {
  private readonly medicalRecordsRepository = getMedicalRecordsRepository();

  async getByPatient(): Promise<MedicalRecordSummary[]> {
    return this.medicalRecordsRepository.listByPatient();
  }

  async getById(recordId = 'mr_1'): Promise<MedicalRecordSummary> {
    return this.medicalRecordsRepository.findById(recordId);
  }

  async create(input: CreateMedicalRecordInput) {
    return this.medicalRecordsRepository.create(input);
  }

  async update(recordId: string, input: UpdateMedicalRecordInput) {
    return this.medicalRecordsRepository.update(recordId, input);
  }
}
