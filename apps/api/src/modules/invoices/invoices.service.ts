import type { InvoiceSummary } from '@mediklinik/types';
import { invoices } from '../shared/mock-data';

export class InvoicesService {
  list(): InvoiceSummary[] {
    return invoices;
  }

  getById(): InvoiceSummary {
    const invoice = invoices[0];

    if (!invoice) {
      throw new Error('Invoice tidak ditemukan.');
    }

    return invoice;
  }

  payOnline() {
    return {
      invoiceId: 'inv_1',
      snapToken: 'snap_patient_payment_demo',
      orderId: 'klinik-sehat-INV-001',
    };
  }
}
