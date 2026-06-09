import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export function registerDashboardRoutes(router: ApiRouter) {
  router.get('/dashboard/summary', () => ok(dashboardService.getSummary()), {
    summary: 'Get dashboard summary',
    tags: ['Dashboard'],
    auth: 'bearer',
  });
}
