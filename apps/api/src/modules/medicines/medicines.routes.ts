import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { MedicinesService } from './medicines.service';

const medicinesService = new MedicinesService();

export function registerMedicineRoutes(router: ApiRouter) {
  router.get('/medicines', () => ok(medicinesService.list()));
  router.get('/medicines/low-stock', () => ok(medicinesService.getLowStock()));
  router.get('/medicines/:id/mutations', () => ok(medicinesService.getMutations()));
}
