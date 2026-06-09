import type { LowStockAlert, MedicineSummary, StockInInput, StockMutationSummary } from '@mediklinik/types';
import { inMemoryDb } from '../shared/in-memory-db';

export class MedicinesRepository {
  list(): MedicineSummary[] {
    return inMemoryDb.getState().medicines;
  }

  listLowStock(): LowStockAlert[] {
    return inMemoryDb
      .getState()
      .medicines.filter((medicine) => medicine.stockQuantity <= medicine.minStockAlert)
      .map((medicine) => ({
        medicineId: medicine.id,
        medicineName: medicine.name,
        stockQuantity: medicine.stockQuantity,
        minStockAlert: medicine.minStockAlert,
      }));
  }

  listMutations(): StockMutationSummary[] {
    return inMemoryDb.getState().stockMutations;
  }

  stockIn(medicineId: string, input: StockInInput) {
    const state = inMemoryDb.getState();
    const medicine = state.medicines.find((item) => item.id === medicineId);
    if (!medicine) {
      throw new Error('Obat tidak ditemukan.');
    }

    medicine.stockQuantity += input.quantity;

    const mutation: StockMutationSummary = {
      id: `mut_${state.stockMutations.length + 1}`,
      clinicId: medicine.clinicId,
      medicineId,
      type: 'IN',
      quantity: input.quantity,
      referenceId: null,
      notes: input.notes,
      createdAt: new Date().toISOString(),
    };

    state.stockMutations.unshift(mutation);

    return { medicine, mutation };
  }
}
