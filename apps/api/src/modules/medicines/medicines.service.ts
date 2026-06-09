import type { LowStockAlert, MedicineSummary, StockInInput, StockMutationSummary } from '@mediklinik/types';
import { MedicinesRepository } from '../repositories/medicines.repository';

export class MedicinesService {
  private readonly medicinesRepository = new MedicinesRepository();

  list(): MedicineSummary[] {
    return this.medicinesRepository.list();
  }

  getLowStock(): LowStockAlert[] {
    return this.medicinesRepository.listLowStock();
  }

  getMutations(): StockMutationSummary[] {
    return this.medicinesRepository.listMutations();
  }

  stockIn(medicineId: string, input: StockInInput) {
    return this.medicinesRepository.stockIn(medicineId, input);
  }
}
