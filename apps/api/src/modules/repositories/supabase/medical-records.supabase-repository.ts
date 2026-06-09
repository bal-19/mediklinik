import type { MedicalRecordSummary } from '@mediklinik/types';
import type { MedicalRecordsRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';

export class SupabaseMedicalRecordsRepository implements MedicalRecordsRepositoryContract {
  listByPatient(): MedicalRecordSummary[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseMedicalRecordsRepository.listByPatient belum diimplementasikan penuh.');
  }

  findById(_recordId: string): MedicalRecordSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseMedicalRecordsRepository.findById belum diimplementasikan penuh.');
  }
}

function notImplemented(message: string): never {
  throw new Error(message);
}
