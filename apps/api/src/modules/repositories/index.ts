import type {
  DashboardRepositoryContract,
  InvoicesRepositoryContract,
  MedicalRecordsRepositoryContract,
  MedicinesRepositoryContract,
  QueuesRepositoryContract,
  ReportsRepositoryContract,
} from './contracts';
import { SupabaseDashboardRepository } from './supabase/dashboard.supabase-repository';
import { SupabaseInvoicesRepository } from './supabase/invoices.supabase-repository';
import { SupabaseMedicalRecordsRepository } from './supabase/medical-records.supabase-repository';
import { SupabaseMedicinesRepository } from './supabase/medicines.supabase-repository';
import { SupabaseQueuesRepository } from './supabase/queues.supabase-repository';
import { SupabaseReportsRepository } from './supabase/reports.supabase-repository';

const dashboardRepository: DashboardRepositoryContract = new SupabaseDashboardRepository();
const queuesRepository: QueuesRepositoryContract = new SupabaseQueuesRepository();
const medicalRecordsRepository: MedicalRecordsRepositoryContract = new SupabaseMedicalRecordsRepository();
const medicinesRepository: MedicinesRepositoryContract = new SupabaseMedicinesRepository();
const invoicesRepository: InvoicesRepositoryContract = new SupabaseInvoicesRepository();
const reportsRepository: ReportsRepositoryContract = new SupabaseReportsRepository();

export function getDashboardRepository() {
  return dashboardRepository;
}

export function getQueuesRepository() {
  return queuesRepository;
}

export function getMedicalRecordsRepository() {
  return medicalRecordsRepository;
}

export function getMedicinesRepository() {
  return medicinesRepository;
}

export function getInvoicesRepository() {
  return invoicesRepository;
}

export function getReportsRepository() {
  return reportsRepository;
}
