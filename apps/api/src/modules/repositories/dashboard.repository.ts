import type { DashboardSummary, LowStockAlert } from '@mediklinik/types';
import { inMemoryDb } from '../shared/in-memory-db';

export class DashboardRepository {
  getLowStockAlerts(): LowStockAlert[] {
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

  getSummary(): DashboardSummary {
    const state = inMemoryDb.getState();
    const currentQueue = [...state.queues]
      .sort((left, right) => left.queueNumber.localeCompare(right.queueNumber))
      .find((item) => item.status === 'IN_PROGRESS' || item.status === 'CALLED' || item.status === 'WAITING');

    return {
      todayQueueNumber: currentQueue?.queueNumber ?? 'A-000',
      activeQueueCount: state.queues.filter((item) => item.status !== 'DONE' && item.status !== 'SKIP').length,
      totalPatientsToday: state.queues.length,
      todayRevenue: state.invoices.reduce((total, invoice) => total + invoice.totalAmount, 0),
      lowStockAlerts: this.getLowStockAlerts(),
      subscription: state.subscription,
    };
  }
}
