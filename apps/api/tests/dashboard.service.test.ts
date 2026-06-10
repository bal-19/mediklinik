import { describe, expect, test } from 'bun:test';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';
import { setupDatabaseTest } from '../src/modules/shared/test-utils';

setupDatabaseTest();

describe('DashboardService', () => {
  test('returns summary with low stock alerts and subscription data', async () => {
    const service = new DashboardService();
    const result = await service.getSummary();

    expect(result.todayQueueNumber.startsWith('A-')).toBe(true);
    expect(result.lowStockAlerts.length).toBeGreaterThan(0);
    expect(result.subscription.status).toBe('TRIAL');
  });
});
