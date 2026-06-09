import type {
  CreateQueueInput,
  CreateMedicalRecordInput,
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
  UpdateMedicalRecordInput,
  VisitReportPoint,
} from '@mediklinik/types';

export interface DashboardRepositoryContract {
  getSummary(): Promise<DashboardSummary>;
}

export interface QueuesRepositoryContract {
  listToday(): Promise<QueueItemSummary[]>;
  create(input: CreateQueueInput): Promise<QueueItemSummary>;
  callNext(): Promise<QueueItemSummary>;
  updateStatus(queueId: string, input: UpdateQueueStatusInput): Promise<QueueItemSummary>;
}

export interface MedicalRecordsRepositoryContract {
  listByPatient(): Promise<MedicalRecordSummary[]>;
  findById(recordId: string): Promise<MedicalRecordSummary>;
  create(input: CreateMedicalRecordInput): Promise<MedicalRecordSummary>;
  update(recordId: string, input: UpdateMedicalRecordInput): Promise<MedicalRecordSummary>;
}

export interface MedicinesRepositoryContract {
  list(): Promise<MedicineSummary[]>;
  listLowStock(): Promise<LowStockAlert[]>;
  listMutations(): Promise<StockMutationSummary[]>;
  stockIn(medicineId: string, input: StockInInput): Promise<{
    medicine: MedicineSummary;
    mutation: StockMutationSummary;
  }>;
}

export interface InvoicesRepositoryContract {
  list(): Promise<InvoiceSummary[]>;
  findById(invoiceId: string): Promise<InvoiceSummary>;
  payCash(invoiceId: string, input: PayCashInput): Promise<InvoiceSummary>;
  createFromMedicalRecord(medicalRecordId: string): Promise<InvoiceSummary>;
}

export interface ReportsRepositoryContract {
  getVisits(): Promise<VisitReportPoint[]>;
  getRevenue(): Promise<RevenueReportPoint[]>;
}
