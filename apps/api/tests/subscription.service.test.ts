import { describe, expect, test } from 'bun:test';
import { SubscriptionsService } from '../src/modules/subscriptions/subscriptions.service';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('SubscriptionsService', () => {
  test('checkout returns platform midtrans payload', () => {
    const service = new SubscriptionsService();
    const result = service.checkout();

    expect(result.orderId.includes('-SUB-')).toBe(true);
    expect(result.snapToken.length).toBeGreaterThan(0);
  });
});
