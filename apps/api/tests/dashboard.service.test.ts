import { describe, expect, test } from 'bun:test';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('DashboardService', () => {
  test('returns summary with low stock alerts and subscription data', () => {
    const service = new DashboardService();
    const result = service.getSummary();

    expect(result.todayQueueNumber.startsWith('A-')).toBe(true);
    expect(result.lowStockAlerts.length).toBeGreaterThan(0);
    expect(result.subscription.status).toBe('TRIAL');
  });
});
