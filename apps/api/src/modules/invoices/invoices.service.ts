import type { InvoiceSummary, PayCashInput } from '@mediklinik/types';
import { getInvoicesRepository } from '../repositories';
import { MidtransService } from '../payments/midtrans.service';
import { CredentialEncryptionService } from '../clinics/credential-encryption.service';
import { getAuthContext } from '../shared/request-context';
import { canUseSupabaseRepositories, getSupabaseAdminClient } from '../shared/supabase-client';

export class InvoicesService {
  private readonly invoicesRepository = getInvoicesRepository();

  async list(): Promise<InvoiceSummary[]> {
    return this.invoicesRepository.list();
  }

  async getById(invoiceId = 'inv_1'): Promise<InvoiceSummary> {
    return this.invoicesRepository.findById(invoiceId);
  }

  async payOnline(invoiceId: string) {
    const invoice = await this.invoicesRepository.findById(invoiceId);
    let serverKey = process.env.MIDTRANS_CLINIC_SERVER_KEY;
    if (canUseSupabaseRepositories()) {
      const { data, error } = await getSupabaseAdminClient().from('clinics').select('midtrans_server_key_encrypted').eq('id', getAuthContext()?.clinicId).single();
      if (error || !data?.midtrans_server_key_encrypted) throw new Error('Credential Midtrans klinik belum dikonfigurasi.');
      serverKey = new CredentialEncryptionService().decrypt(data.midtrans_server_key_encrypted);
    }
    const result = await new MidtransService(serverKey, process.env.MIDTRANS_CLINIC_IS_PRODUCTION === 'true')
      .createSnap(invoice.midtransOrderId ?? `clinic-INV-${invoice.id}`, invoice.totalAmount, { email: 'patient@mediklinik.id', name: invoice.patientId });
    return { invoiceId, orderId: invoice.midtransOrderId, ...result };
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
