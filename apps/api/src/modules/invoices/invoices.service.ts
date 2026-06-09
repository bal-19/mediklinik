import type { InvoiceSummary, PayCashInput } from '@mediklinik/types';
import { getInvoicesRepository } from '../repositories';

export class InvoicesService {
  private readonly invoicesRepository = getInvoicesRepository();

  async list(): Promise<InvoiceSummary[]> {
    return this.invoicesRepository.list();
  }

  async getById(invoiceId = 'inv_1'): Promise<InvoiceSummary> {
    return this.invoicesRepository.findById(invoiceId);
  }

  payOnline() {
    return {
      invoiceId: 'inv_1',
      snapToken: 'snap_patient_payment_demo',
      orderId: 'klinik-sehat-INV-001',
    };
  }

  async payCash(invoiceId: string, input: PayCashInput): Promise<InvoiceSummary> {
    return this.invoicesRepository.payCash(invoiceId, input);
  }

  async createFromMedicalRecord(medicalRecordId: string): Promise<InvoiceSummary> {
    return this.invoicesRepository.createFromMedicalRecord(medicalRecordId);
  }
}
