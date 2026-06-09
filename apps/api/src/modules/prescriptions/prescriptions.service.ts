import type { CreatePrescriptionInput, PrescriptionSummary } from '@mediklinik/types';
import { canUseSupabaseRepositories, getSupabaseAdminClient } from '../shared/supabase-client';
import { getAuthContext } from '../shared/request-context';
import { inMemoryDb } from '../shared/in-memory-db';
import { PushService } from '../push/push.service';

export class PrescriptionsService {
  private readonly pushService = new PushService();

  async create(input: CreatePrescriptionInput): Promise<PrescriptionSummary> {
    if (!input.items.length || input.items.some((item) => item.quantity <= 0)) throw new Error('Resep harus memiliki item dengan jumlah valid.');
    if (canUseSupabaseRepositories()) {
      const { data, error } = await getSupabaseAdminClient().rpc('create_prescription_with_stock', {
        p_clinic_id: getAuthContext()?.clinicId, p_medical_record_id: input.medicalRecordId, p_notes: input.notes ?? '', p_items: input.items,
      });
      if (error) throw new Error(`Gagal menyimpan resep: ${error.message}`);
      return data as PrescriptionSummary;
    }
    const state = inMemoryDb.getState();
    const clinicId = getAuthContext()?.clinicId ?? 'clinic_demo';
    for (const item of input.items) {
      const medicine = state.medicines.find((entry) => entry.id === item.medicineId && entry.clinicId === clinicId);
      if (!medicine || medicine.stockQuantity < item.quantity) throw new Error(`Stok obat ${item.medicineId} tidak cukup.`);
    }
    const prescription: PrescriptionSummary = { id: `pres_${state.prescriptions.length + 1}`, clinicId, medicalRecordId: input.medicalRecordId, notes: input.notes ?? '', items: input.items, createdAt: new Date().toISOString() };
    for (const item of input.items) {
      const medicine = state.medicines.find((entry) => entry.id === item.medicineId)!;
      medicine.stockQuantity -= item.quantity;
      state.stockMutations.unshift({ id: `mut_${state.stockMutations.length + 1}`, clinicId, medicineId: medicine.id, type: 'OUT', quantity: item.quantity, referenceId: prescription.id, notes: 'Resep pasien', createdAt: new Date().toISOString() });
      if (medicine.stockQuantity <= medicine.minStockAlert) void this.pushService.sendLowStock(medicine.name, medicine.stockQuantity);
    }
    state.prescriptions.unshift(prescription);
    return prescription;
  }
}
