import type { InvoiceItemSummary, InvoiceSummary, PayCashInput } from '@mediklinik/types';
import type { InvoicesRepositoryContract } from './contracts';
import { inMemoryDb } from '../shared/in-memory-db';
import { MedicalRecordsRepository } from './medical-records.repository';

export class InvoicesRepository implements InvoicesRepositoryContract {
  private readonly medicalRecordsRepository = new MedicalRecordsRepository();

  async list(): Promise<InvoiceSummary[]> {
    return inMemoryDb.getState().invoices;
  }

  async findById(invoiceId: string): Promise<InvoiceSummary> {
    const invoice = inMemoryDb.getState().invoices.find((item) => item.id === invoiceId);
    if (!invoice) {
      throw new Error('Invoice tidak ditemukan.');
    }

    return invoice;
  }

  async payCash(invoiceId: string, input: PayCashInput): Promise<InvoiceSummary> {
    const invoice = await this.findById(invoiceId);
    invoice.status = input.amountPaid >= invoice.totalAmount ? 'PAID' : 'PARTIAL';
    invoice.paymentMethod = 'CASH';
    invoice.paidAt = new Date().toISOString();
    return invoice;
  }

  async createFromMedicalRecord(medicalRecordId: string): Promise<InvoiceSummary> {
    const state = inMemoryDb.getState();
    const record = await this.medicalRecordsRepository.findById(medicalRecordId);

    const stamp = Date.now();
    const items: InvoiceItemSummary[] = [
      {
        id: `item_${stamp}_1`,
        description: 'Konsultasi Dokter Umum',
        quantity: 1,
        unitPrice: 100000,
        subtotal: 100000,
      },
      {
        id: `item_${stamp}_2`,
        description: 'Paket Obat Dasar',
        quantity: 1,
        unitPrice: 35000,
        subtotal: 35000,
      },
    ];

    const totalAmount = items.reduce((total, item) => total + item.subtotal, 0);
    const nextId = state.invoices.length + 1;

    const invoice: InvoiceSummary = {
      id: `inv_${nextId}`,
      clinicId: record.clinicId,
      patientId: record.patientId,
      medicalRecordId,
      totalAmount,
      status: 'UNPAID',
      paymentMethod: null,
      midtransOrderId: `klinik-sehat-INV-${String(nextId).padStart(3, '0')}`,
      paidAt: null,
      createdAt: new Date().toISOString(),
      items,
    };

    state.invoices.unshift(invoice);
    return invoice;
  }
}
