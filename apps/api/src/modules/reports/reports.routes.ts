import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { ReportsService } from './reports.service';

const reportsService = new ReportsService();

export function registerReportRoutes(router: ApiRouter) {
  router.get('/reports/visits', () => ok(reportsService.getVisits()), {
    summary: 'Get visits report',
    tags: ['Reports'],
    auth: 'bearer',
  });
  router.get('/reports/revenue', () => ok(reportsService.getRevenue()), {
    summary: 'Get revenue report',
    tags: ['Reports'],
    auth: 'bearer',
  });
}
