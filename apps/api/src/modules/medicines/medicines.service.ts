import type { LowStockAlert, MedicineSummary, StockInInput, StockMutationSummary } from '@mediklinik/types';
import { getMedicinesRepository } from '../repositories';

export class MedicinesService {
  private readonly medicinesRepository = getMedicinesRepository();

  async list(): Promise<MedicineSummary[]> {
    return this.medicinesRepository.list();
  }

  async getLowStock(): Promise<LowStockAlert[]> {
    return this.medicinesRepository.listLowStock();
  }

  async getMutations(): Promise<StockMutationSummary[]> {
    return this.medicinesRepository.listMutations();
  }

  async stockIn(medicineId: string, input: StockInInput): Promise<{ medicine: MedicineSummary; mutation: StockMutationSummary }> {
    return this.medicinesRepository.stockIn(medicineId, input);
  }
}
