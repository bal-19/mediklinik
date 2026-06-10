import type { CreatePrescriptionInput, PrescriptionSummary } from '@mediklinik/types';
import { getSupabaseAdminClient } from '../shared/supabase-client';
import { getAuthContext } from '../shared/request-context';

export class PrescriptionsService {
  async create(input: CreatePrescriptionInput): Promise<PrescriptionSummary> {
    if (!input.items.length || input.items.some((item) => item.quantity <= 0)) throw new Error('Resep harus memiliki item dengan jumlah valid.');
    const clinicId = getAuthContext()?.clinicId;
    if (!clinicId) throw new Error('Clinic context dibutuhkan untuk membuat resep.');
    const { data, error } = await getSupabaseAdminClient().rpc('create_prescription_with_stock', {
      p_clinic_id: clinicId, p_medical_record_id: input.medicalRecordId, p_notes: input.notes ?? '', p_items: input.items,
    });
    if (error) throw new Error(`Gagal menyimpan resep: ${error.message}`);
    return data as PrescriptionSummary;
  }
}
