import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { ReportsService } from './reports.service';

const reportsService = new ReportsService();

export function registerReportRoutes(router: ApiRouter) {
  router.get('/reports/visits', async () => ok(await reportsService.getVisits()), {
    summary: 'Get visits report',
    tags: ['Reports'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.get('/reports/revenue', async () => ok(await reportsService.getRevenue()), {
    summary: 'Get revenue report',
    tags: ['Reports'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
}
