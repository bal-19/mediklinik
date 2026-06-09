import type { MedicalRecordSummary } from '@mediklinik/types';
import type { MedicalRecordsRepositoryContract } from './contracts';
import { inMemoryDb } from '../shared/in-memory-db';

export class MedicalRecordsRepository implements MedicalRecordsRepositoryContract {
  async listByPatient(): Promise<MedicalRecordSummary[]> {
    return inMemoryDb.getState().medicalRecords;
  }

  async findById(recordId: string): Promise<MedicalRecordSummary> {
    const record = inMemoryDb.getState().medicalRecords.find((item) => item.id === recordId);
    if (!record) {
      throw new Error('Rekam medis tidak ditemukan.');
    }

    return record;
  }
}
