import type { InvoiceSummary, PayCashInput } from '@mediklinik/types';
import { getInvoicesRepository } from '../repositories';

export class InvoicesService {
  private readonly invoicesRepository = getInvoicesRepository();

  async list(): Promise<InvoiceSummary[]> {
    return this.invoicesRepository.list();
  }

  async getById(invoiceId: string): Promise<InvoiceSummary> {
    return this.invoicesRepository.findById(invoiceId);
  }

  async payCash(invoiceId: string, input: PayCashInput): Promise<InvoiceSummary> {
    return this.invoicesRepository.payCash(invoiceId, input);
  }

  async createFromMedicalRecord(medicalRecordId: string): Promise<InvoiceSummary> {
    return this.invoicesRepository.createFromMedicalRecord(medicalRecordId);
  }

  async createPdf(invoiceId: string) {
    const invoice = await this.invoicesRepository.findById(invoiceId);
    const text = `Invoice ${invoice.id} - Total Rp ${invoice.totalAmount} - Status ${invoice.status}`;
    const stream = `BT /F1 12 Tf 50 750 Td (${text.replace(/[()]/g, '')}) Tj ET`;
    const objects = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
      '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    for (const object of objects) { offsets.push(pdf.length); pdf += `${object}\n`; }
    const xref = pdf.length;
    pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Response(pdf, { headers: { 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="${invoice.id}.pdf"` } });
  }
}
