import { describe, expect, test } from 'bun:test';
import { InvoicesService } from '../src/modules/invoices/invoices.service';

describe('InvoicesService', () => {
  test('create invoice from medical record returns unpaid invoice', () => {
    const service = new InvoicesService();
    const result = service.createFromMedicalRecord('mr_1');

    expect(result.medicalRecordId).toBe('mr_1');
    expect(result.status).toBe('UNPAID');
    expect(result.items.length).toBeGreaterThan(0);
  });

  test('pay cash updates invoice status', () => {
    const service = new InvoicesService();
    const result = service.payCash('inv_1', { amountPaid: 156000 });

    expect(result.status).toBe('PAID');
    expect(result.paymentMethod).toBe('CASH');
  });
});
