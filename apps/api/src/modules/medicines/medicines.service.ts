import type { LowStockAlert, MedicineSummary, StockMutationSummary } from '@mediklinik/types';
import { getLowStockAlerts, medicines, stockMutations } from '../shared/mock-data';

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
}
