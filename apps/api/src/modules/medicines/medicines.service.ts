import type { LowStockAlert, MedicineSummary, StockInInput, StockMutationSummary } from '@mediklinik/types';
import { getLowStockAlerts, medicines, stockInMedicine, stockMutations } from '../shared/mock-data';

export class MedicinesService {
  list(): MedicineSummary[] {
    return medicines;
  }

  getLowStock(): LowStockAlert[] {
    return getLowStockAlerts();
  }

  getMutations(): StockMutationSummary[] {
    return stockMutations;
  }

  stockIn(medicineId: string, input: StockInInput) {
    return stockInMedicine(medicineId, input);
  }
}
