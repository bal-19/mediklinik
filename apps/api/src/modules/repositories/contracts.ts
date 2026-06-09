import type {
  CreateQueueInput,
  DashboardSummary,
  InvoiceSummary,
  LowStockAlert,
  MedicalRecordSummary,
  MedicineSummary,
  PayCashInput,
  QueueItemSummary,
  RevenueReportPoint,
  StockInInput,
  StockMutationSummary,
  UpdateQueueStatusInput,
  VisitReportPoint,
} from '@mediklinik/types';

export interface DashboardRepositoryContract {
  getSummary(): DashboardSummary;
}

export interface QueuesRepositoryContract {
  listToday(): Promise<QueueItemSummary[]>;
  create(input: CreateQueueInput): Promise<QueueItemSummary>;
  callNext(): Promise<QueueItemSummary>;
  updateStatus(queueId: string, input: UpdateQueueStatusInput): Promise<QueueItemSummary>;
}

export interface MedicalRecordsRepositoryContract {
  listByPatient(): MedicalRecordSummary[];
  findById(recordId: string): MedicalRecordSummary;
}

export interface MedicinesRepositoryContract {
  list(): MedicineSummary[];
  listLowStock(): LowStockAlert[];
  listMutations(): StockMutationSummary[];
  stockIn(medicineId: string, input: StockInInput): {
    medicine: MedicineSummary;
    mutation: StockMutationSummary;
  };
}

export interface InvoicesRepositoryContract {
  list(): InvoiceSummary[];
  findById(invoiceId: string): InvoiceSummary;
  payCash(invoiceId: string, input: PayCashInput): InvoiceSummary;
  createFromMedicalRecord(medicalRecordId: string): InvoiceSummary;
}

export interface ReportsRepositoryContract {
  getVisits(): VisitReportPoint[];
  getRevenue(): RevenueReportPoint[];
}
