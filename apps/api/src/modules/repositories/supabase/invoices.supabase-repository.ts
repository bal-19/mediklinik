import type { InvoiceSummary, PayCashInput } from '@mediklinik/types';
import type { InvoicesRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';

export class SupabaseInvoicesRepository implements InvoicesRepositoryContract {
  list(): InvoiceSummary[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseInvoicesRepository.list belum diimplementasikan penuh.');
  }

  findById(_invoiceId: string): InvoiceSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseInvoicesRepository.findById belum diimplementasikan penuh.');
  }

  payCash(_invoiceId: string, _input: PayCashInput): InvoiceSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseInvoicesRepository.payCash belum diimplementasikan penuh.');
  }

  createFromMedicalRecord(_medicalRecordId: string): InvoiceSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseInvoicesRepository.createFromMedicalRecord belum diimplementasikan penuh.');
  }
}

function notImplemented(message: string): never {
  throw new Error(message);
}
