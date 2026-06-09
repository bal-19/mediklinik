import type { CreateMedicalRecordInput, MedicalRecordSummary, UpdateMedicalRecordInput } from '@mediklinik/types';
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

  async create(input: CreateMedicalRecordInput): Promise<MedicalRecordSummary> {
    const state = inMemoryDb.getState();
    const record: MedicalRecordSummary = {
      id: `mr_${state.medicalRecords.length + 1}`,
      clinicId: 'clinic_demo',
      patientId: input.patientId,
      doctorId: input.doctorId,
      queueId: input.queueId ?? null,
      chiefComplaint: input.chiefComplaint,
      diagnosis: input.diagnosis,
      notes: input.notes ?? '',
      createdAt: new Date().toISOString(),
      lockedAt: null,
    };
    state.medicalRecords.unshift(record);
    return record;
  }

  async update(recordId: string, input: UpdateMedicalRecordInput): Promise<MedicalRecordSummary> {
    const record = await this.findById(recordId);
    if (Date.now() - new Date(record.createdAt).getTime() >= 24 * 60 * 60 * 1000 || record.lockedAt) {
      throw new Error('Rekam medis terkunci setelah 24 jam dan tidak dapat diubah.');
    }
    Object.assign(record, input);
    return record;
  }
}
