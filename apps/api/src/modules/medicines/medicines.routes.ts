import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { requireParam } from '../shared/request-utils';
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
  router.post('/medicines/:id/stock-in', ({ params, body }) => ok(medicinesService.stockIn(requireParam(params.id, 'id'), parseStockInBody(body)), 'Stok obat berhasil ditambahkan'), {
    summary: 'Add medicine stock',
    tags: ['Medicines'],
    auth: 'bearer',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              quantity: { type: 'number', example: 20 },
              notes: { type: 'string', example: 'Restock supplier mingguan' },
            },
            required: ['quantity', 'notes'],
          },
        },
      },
    },
  });
}

function parseStockInBody(body: unknown) {
  const payload = body as { quantity?: number; notes?: string } | undefined;
  return {
    quantity: Number(payload?.quantity ?? 0),
    notes: payload?.notes ?? 'Restock manual',
  };
}
