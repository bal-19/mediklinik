import type { MidtransWebhookPayload } from '@mediklinik/types';
import { inMemoryDb } from '../shared/in-memory-db';
import { MidtransService } from './midtrans.service';
import { CredentialEncryptionService } from '../clinics/credential-encryption.service';
import { canUseSupabaseRepositories, getSupabaseAdminClient } from '../shared/supabase-client';

export class PaymentsService {
  async webhook(payload: MidtransWebhookPayload) {
    let serverKey = process.env.MIDTRANS_CLINIC_SERVER_KEY;
    if (canUseSupabaseRepositories()) {
      const { data, error } = await getSupabaseAdminClient().from('invoices').select('id, clinics(midtrans_server_key_encrypted)').eq('midtrans_order_id', payload.order_id).single();
      const encrypted = (data?.clinics as unknown as { midtrans_server_key_encrypted?: string } | null)?.midtrans_server_key_encrypted;
      if (error || !encrypted) throw new Error('Credential Midtrans klinik untuk webhook tidak ditemukan.');
      serverKey = new CredentialEncryptionService().decrypt(encrypted);
    }
    new MidtransService(serverKey).verify(payload);
    const invoice = inMemoryDb.getState().invoices.find((item) => item.midtransOrderId === payload.order_id);
    if (!invoice) throw new Error('Invoice webhook tidak ditemukan.');
    const paid = ['settlement', 'capture'].includes(payload.transaction_status);
    invoice.status = paid ? 'PAID' : payload.transaction_status === 'pending' ? 'UNPAID' : 'VOID';
    invoice.paymentMethod = 'MIDTRANS';
    invoice.paidAt = paid ? new Date().toISOString() : null;
    return invoice;
  }
}
