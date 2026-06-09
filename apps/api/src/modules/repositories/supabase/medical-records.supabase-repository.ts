import type { MedicalRecordSummary } from '@mediklinik/types';
import type { MedicalRecordsRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';
import { requireClinicId } from './utils';

interface MedicalRecordRow {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  queue_id: string | null;
  chief_complaint: string | null;
  diagnosis: string | null;
  notes: string | null;
  created_at: string;
  locked_at: string | null;
}

export class SupabaseMedicalRecordsRepository implements MedicalRecordsRepositoryContract {
  async listByPatient(): Promise<MedicalRecordSummary[]> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('medical_records')
      .select('id, clinic_id, patient_id, doctor_id, queue_id, chief_complaint, diagnosis, notes, created_at, locked_at')
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Gagal mengambil rekam medis: ${error.message}`);
    }

    return (data ?? []).map(mapMedicalRecordRow);
  }

  async findById(recordId: string): Promise<MedicalRecordSummary> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('medical_records')
      .select('id, clinic_id, patient_id, doctor_id, queue_id, chief_complaint, diagnosis, notes, created_at, locked_at')
      .eq('id', recordId)
      .eq('clinic_id', clinicId)
      .single();

    if (error || !data) {
      throw new Error(`Gagal mengambil detail rekam medis: ${error?.message ?? 'data tidak ditemukan.'}`);
    }

    return mapMedicalRecordRow(data);
  }
}

function mapMedicalRecordRow(row: MedicalRecordRow): MedicalRecordSummary {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    queueId: row.queue_id,
    chiefComplaint: row.chief_complaint ?? '',
    diagnosis: row.diagnosis ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at,
    lockedAt: row.locked_at,
  };
}
