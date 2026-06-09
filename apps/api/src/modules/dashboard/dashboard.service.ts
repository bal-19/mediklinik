import type { DashboardSummary } from '@mediklinik/types';
import { getDashboardSummary } from '../shared/mock-data';

export class DashboardService {
  getSummary(): DashboardSummary {
    return getDashboardSummary();
  }
}
