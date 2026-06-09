import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { MedicinesService } from './medicines.service';

const medicinesService = new MedicinesService();

export function registerMedicineRoutes(router: ApiRouter) {
  router.get('/medicines', () => ok(medicinesService.list()), {
    summary: 'List medicines',
    tags: ['Medicines'],
    auth: 'bearer',
  });
  router.get('/medicines/low-stock', () => ok(medicinesService.getLowStock()), {
    summary: 'List low stock alerts',
    tags: ['Medicines'],
    auth: 'bearer',
  });
  router.get('/medicines/:id/mutations', () => ok(medicinesService.getMutations()), {
    summary: 'List stock mutations for medicine',
    tags: ['Medicines'],
    auth: 'bearer',
  });
}
