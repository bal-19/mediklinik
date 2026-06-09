import { describe, expect, test } from 'bun:test';
import { SubscriptionsService } from '../src/modules/subscriptions/subscriptions.service';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('SubscriptionsService', () => {
  test('checkout rejects clearly when platform Midtrans is not configured', async () => {
    const previous = process.env.MIDTRANS_PLATFORM_SERVER_KEY;
    delete process.env.MIDTRANS_PLATFORM_SERVER_KEY;
    const service = new SubscriptionsService();
    await expect(service.checkout({ clinicId: 'clinic_demo', clinicSlug: 'klinik-sehat', plan: 'CLINIC', email: 'admin@mediklinik.id' })).rejects.toThrow('Midtrans server key belum dikonfigurasi');
    if (previous) process.env.MIDTRANS_PLATFORM_SERVER_KEY = previous;
  });
});
