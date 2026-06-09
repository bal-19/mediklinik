import type { DashboardSummary } from '@mediklinik/types';
import { DashboardRepository } from '../repositories/dashboard.repository';

export class DashboardService {
  private readonly dashboardRepository = new DashboardRepository();

  getSummary(): DashboardSummary {
    return this.dashboardRepository.getSummary();
  }
}
