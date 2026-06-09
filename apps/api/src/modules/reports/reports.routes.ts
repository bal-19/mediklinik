import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { ReportsService } from './reports.service';

const reportsService = new ReportsService();

export function registerReportRoutes(router: ApiRouter) {
  router.get('/reports/visits', () => ok(reportsService.getVisits()));
  router.get('/reports/revenue', () => ok(reportsService.getRevenue()));
}
