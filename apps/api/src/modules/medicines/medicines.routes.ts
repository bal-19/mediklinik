import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { requireParam } from '../shared/request-utils';
import { MedicinesService } from './medicines.service';

const medicinesService = new MedicinesService();

export function registerMedicineRoutes(router: ApiRouter) {
  router.get('/medicines', async () => ok(await medicinesService.list()), {
    summary: 'List medicines',
    tags: ['Medicines'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.get('/medicines/low-stock', async () => ok(await medicinesService.getLowStock()), {
    summary: 'List low stock alerts',
    tags: ['Medicines'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.get('/medicines/:id/mutations', async () => ok(await medicinesService.getMutations()), {
    summary: 'List stock mutations for medicine',
    tags: ['Medicines'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.post('/medicines/:id/stock-in', async ({ params, body }) => ok(await medicinesService.stockIn(requireParam(params.id, 'id'), parseStockInBody(body)), 'Stok obat berhasil ditambahkan'), {
    summary: 'Add medicine stock',
    tags: ['Medicines'],
    auth: 'bearer',
    subscriptionRequired: true,
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
