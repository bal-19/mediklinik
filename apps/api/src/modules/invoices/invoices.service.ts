import type { InvoiceSummary, PayCashInput } from '@mediklinik/types';
import { InvoicesRepository } from '../repositories/invoices.repository';

export class InvoicesService {
  private readonly invoicesRepository = new InvoicesRepository();

  list(): InvoiceSummary[] {
    return this.invoicesRepository.list();
  }

  getById(): InvoiceSummary {
    return this.invoicesRepository.findById('inv_1');
  }

  payOnline() {
    return {
      invoiceId: 'inv_1',
      snapToken: 'snap_patient_payment_demo',
      orderId: 'klinik-sehat-INV-001',
    };
  }

  payCash(invoiceId: string, input: PayCashInput): InvoiceSummary {
    return this.invoicesRepository.payCash(invoiceId, input);
  }

  createFromMedicalRecord(medicalRecordId: string): InvoiceSummary {
    return this.invoicesRepository.createFromMedicalRecord(medicalRecordId);
  }
}
