import type { LowStockAlert, MedicineSummary, StockInInput, StockMutationSummary } from '@mediklinik/types';
import type { MedicinesRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';
import { requireClinicId } from './utils';

interface MedicineRow {
  id: string;
  clinic_id: string;
  name: string;
  unit: string;
  stock_quantity: number;
  min_stock_alert: number;
  purchase_price: number;
  sell_price: number;
  is_active: boolean;
}

interface StockMutationRow {
  id: string;
  clinic_id: string;
  medicine_id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reference_id: string | null;
  notes: string | null;
  created_at: string;
}

export class SupabaseMedicinesRepository implements MedicinesRepositoryContract {
  async list(): Promise<MedicineSummary[]> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('medicines')
      .select('id, clinic_id, name, unit, stock_quantity, min_stock_alert, purchase_price, sell_price, is_active')
      .eq('clinic_id', clinicId)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Gagal mengambil data obat: ${error.message}`);
    }

    return (data ?? []).map(mapMedicineRow);
  }

  async listLowStock(): Promise<LowStockAlert[]> {
    const medicines = await this.list();
    return medicines
      .filter((medicine) => medicine.stockQuantity <= medicine.minStockAlert)
      .map((medicine) => ({
        medicineId: medicine.id,
        medicineName: medicine.name,
        stockQuantity: medicine.stockQuantity,
        minStockAlert: medicine.minStockAlert,
      }));
  }

  async listMutations(): Promise<StockMutationSummary[]> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('stock_mutations')
      .select('id, clinic_id, medicine_id, type, quantity, reference_id, notes, created_at')
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Gagal mengambil mutasi stok: ${error.message}`);
    }

    return (data ?? []).map(mapStockMutationRow);
  }

  async stockIn(medicineId: string, input: StockInInput): Promise<{ medicine: MedicineSummary; mutation: StockMutationSummary }> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data: medicineRow, error: medicineError } = await client
      .from('medicines')
      .select('id, clinic_id, name, unit, stock_quantity, min_stock_alert, purchase_price, sell_price, is_active')
      .eq('id', medicineId)
      .eq('clinic_id', clinicId)
      .single();

    if (medicineError || !medicineRow) {
      throw new Error(`Gagal mengambil obat: ${medicineError?.message ?? 'data tidak ditemukan.'}`);
    }

    const nextStockQuantity = medicineRow.stock_quantity + input.quantity;
    const { data: updatedMedicine, error: updateError } = await client
      .from('medicines')
      .update({ stock_quantity: nextStockQuantity })
      .eq('id', medicineId)
      .eq('clinic_id', clinicId)
      .select('id, clinic_id, name, unit, stock_quantity, min_stock_alert, purchase_price, sell_price, is_active')
      .single();

    if (updateError || !updatedMedicine) {
      throw new Error(`Gagal memperbarui stok obat: ${updateError?.message ?? 'update tidak mengembalikan data.'}`);
    }

    const { data: mutationRow, error: mutationError } = await client
      .from('stock_mutations')
      .insert({
        clinic_id: clinicId,
        medicine_id: medicineId,
        type: 'IN',
        quantity: input.quantity,
        reference_id: null,
        notes: input.notes,
      })
      .select('id, clinic_id, medicine_id, type, quantity, reference_id, notes, created_at')
      .single();

    if (mutationError || !mutationRow) {
      throw new Error(`Gagal mencatat mutasi stok: ${mutationError?.message ?? 'insert tidak mengembalikan data.'}`);
    }

    return {
      medicine: mapMedicineRow(updatedMedicine),
      mutation: mapStockMutationRow(mutationRow),
    };
  }
}

function mapMedicineRow(row: MedicineRow): MedicineSummary {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    name: row.name,
    unit: row.unit,
    stockQuantity: row.stock_quantity,
    minStockAlert: row.min_stock_alert,
    purchasePrice: row.purchase_price,
    sellPrice: row.sell_price,
    isActive: row.is_active,
  };
}

function mapStockMutationRow(row: StockMutationRow): StockMutationSummary {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    medicineId: row.medicine_id,
    type: row.type,
    quantity: row.quantity,
    referenceId: row.reference_id,
    notes: row.notes ?? '',
    createdAt: row.created_at,
  };
}
