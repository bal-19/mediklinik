import { describe, expect, test } from 'bun:test';
import { SubscriptionsService } from '../src/modules/subscriptions/subscriptions.service';
import { setupDatabaseTest } from '../src/modules/shared/test-utils';

setupDatabaseTest();

describe('SubscriptionsService', () => {
  test('checkout rejects clearly when platform Midtrans is not configured', async () => {
    const previous = process.env.MIDTRANS_PLATFORM_SERVER_KEY;
    delete process.env.MIDTRANS_PLATFORM_SERVER_KEY;
    const service = new SubscriptionsService();
    await expect(service.checkout({ clinicId: '11111111-1111-1111-1111-111111111111', clinicSlug: 'klinik-sehat', plan: 'CLINIC', email: 'admin@klinik-sehat.test' })).rejects.toThrow('Midtrans server key belum dikonfigurasi');
    if (previous) process.env.MIDTRANS_PLATFORM_SERVER_KEY = previous;
  });
});
