import type { MedicalRecordSummary } from '@mediklinik/types';
import { inMemoryDb } from '../shared/in-memory-db';

export class MedicalRecordsRepository {
  listByPatient(): MedicalRecordSummary[] {
    return inMemoryDb.getState().medicalRecords;
  }

  findById(recordId: string): MedicalRecordSummary {
    const record = inMemoryDb.getState().medicalRecords.find((item) => item.id === recordId);
    if (!record) {
      throw new Error('Rekam medis tidak ditemukan.');
    }

    return record;
  }
}
