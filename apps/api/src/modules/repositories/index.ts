import { canUseSupabaseRepositories } from '../shared/supabase-client';
import type {
  DashboardRepositoryContract,
  InvoicesRepositoryContract,
  MedicalRecordsRepositoryContract,
  MedicinesRepositoryContract,
  QueuesRepositoryContract,
  ReportsRepositoryContract,
} from './contracts';
import { DashboardRepository } from './dashboard.repository';
import { InvoicesRepository } from './invoices.repository';
import { MedicalRecordsRepository } from './medical-records.repository';
import { MedicinesRepository } from './medicines.repository';
import { QueuesRepository } from './queues.repository';
import { ReportsRepository } from './reports.repository';
import { SupabaseDashboardRepository } from './supabase/dashboard.supabase-repository';
import { SupabaseInvoicesRepository } from './supabase/invoices.supabase-repository';
import { SupabaseMedicalRecordsRepository } from './supabase/medical-records.supabase-repository';
import { SupabaseMedicinesRepository } from './supabase/medicines.supabase-repository';
import { SupabaseQueuesRepository } from './supabase/queues.supabase-repository';
import { SupabaseReportsRepository } from './supabase/reports.supabase-repository';

const dashboardRepository: DashboardRepositoryContract = canUseSupabaseRepositories()
  ? new SupabaseDashboardRepository()
  : new DashboardRepository();

const queuesRepository: QueuesRepositoryContract = canUseSupabaseRepositories()
  ? new SupabaseQueuesRepository()
  : new QueuesRepository();

const medicalRecordsRepository: MedicalRecordsRepositoryContract = canUseSupabaseRepositories()
  ? new SupabaseMedicalRecordsRepository()
  : new MedicalRecordsRepository();

const medicinesRepository: MedicinesRepositoryContract = canUseSupabaseRepositories()
  ? new SupabaseMedicinesRepository()
  : new MedicinesRepository();

const invoicesRepository: InvoicesRepositoryContract = canUseSupabaseRepositories()
  ? new SupabaseInvoicesRepository()
  : new InvoicesRepository();

const reportsRepository: ReportsRepositoryContract = canUseSupabaseRepositories()
  ? new SupabaseReportsRepository()
  : new ReportsRepository();

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
