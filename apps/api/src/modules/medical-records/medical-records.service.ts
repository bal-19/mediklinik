import type { MedicalRecordSummary } from '@mediklinik/types';
import { medicalRecords } from '../shared/mock-data';

export class MedicalRecordsService {
  getByPatient(): MedicalRecordSummary[] {
    return medicalRecords;
  }

  getById(): MedicalRecordSummary {
    const record = medicalRecords[0];

    if (!record) {
      throw new Error('Rekam medis tidak ditemukan.');
    }

    return record;
  }
}
