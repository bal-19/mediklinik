import { createHash } from 'node:crypto';
import { describe, expect, test } from 'bun:test';
import { MidtransService } from '../src/modules/payments/midtrans.service';

describe('MidtransService', () => {
  test('verifies a valid webhook signature and rejects tampering', () => {
    const serverKey = 'sandbox-key';
    const payload = { order_id: 'clinic-INV-1', status_code: '200', gross_amount: '100000.00', transaction_status: 'settlement', signature_key: '' };
    payload.signature_key = createHash('sha512').update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`).digest('hex');
    const service = new MidtransService(serverKey);
    expect(() => service.verify(payload)).not.toThrow();
    expect(() => service.verify({ ...payload, gross_amount: '1.00' })).toThrow('Signature webhook Midtrans tidak valid');
  });
});
