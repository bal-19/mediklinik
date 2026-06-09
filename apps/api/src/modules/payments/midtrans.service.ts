import { createHash } from 'node:crypto';
import type { MidtransWebhookPayload } from '@mediklinik/types';

export class MidtransService {
  constructor(private readonly serverKey: string | undefined, private readonly production = false) {}

  verify(payload: MidtransWebhookPayload) {
    if (!this.serverKey) throw new Error('Midtrans server key belum dikonfigurasi.');
    const expected = createHash('sha512').update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${this.serverKey}`).digest('hex');
    if (expected !== payload.signature_key) throw new Error('Signature webhook Midtrans tidak valid.');
  }

  async createSnap(orderId: string, amount: number, customer: { email: string; name: string }) {
    if (!this.serverKey) throw new Error('Midtrans server key belum dikonfigurasi.');
    const base = this.production ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';
    const response = await fetch(`${base}/snap/v1/transactions`, {
      method: 'POST',
      headers: { authorization: `Basic ${Buffer.from(`${this.serverKey}:`).toString('base64')}`, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ transaction_details: { order_id: orderId, gross_amount: amount }, customer_details: { email: customer.email, first_name: customer.name } }),
    });
    const data = await response.json() as { token?: string; redirect_url?: string; error_messages?: string[] };
    if (!response.ok || !data.token) throw new Error(data.error_messages?.join(', ') ?? 'Midtrans gagal membuat transaksi.');
    return { snapToken: data.token, redirectUrl: data.redirect_url };
  }
}
