import type { DashboardSummary } from '@mediklinik/types';
import { getDashboardRepository } from '../repositories';

export class DashboardService {
  private readonly dashboardRepository = getDashboardRepository();

  async getSummary(): Promise<DashboardSummary> {
    return this.dashboardRepository.getSummary();
  }
}
