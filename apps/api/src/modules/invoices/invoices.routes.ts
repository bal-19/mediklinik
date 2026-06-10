import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { requireParam } from '../shared/request-utils';
import { InvoicesService } from './invoices.service';

const invoicesService = new InvoicesService();

export function registerInvoiceRoutes(router: ApiRouter) {
  router.get('/invoices', async () => ok(await invoicesService.list()), {
    summary: 'List invoices',
    tags: ['Invoices'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.get('/invoices/:id', async ({ params }) => ok(await invoicesService.getById(requireParam(params.id, 'id'))), {
    summary: 'Get invoice detail',
    tags: ['Invoices'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.post('/invoices', async ({ body }) => ok(await invoicesService.createFromMedicalRecord(parseCreateInvoiceBody(body).medicalRecordId), 'Invoice berhasil dibuat'), {
    summary: 'Create invoice from medical record',
    tags: ['Invoices'],
    auth: 'bearer',
    subscriptionRequired: true,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              medicalRecordId: { type: 'string', example: 'mr_1' },
            },
            required: ['medicalRecordId'],
          },
        },
      },
    },
  });
  router.post('/invoices/:id/pay-cash', async ({ params, body }) => ok(await invoicesService.payCash(requireParam(params.id, 'id'), parsePayCashBody(body)), 'Pembayaran tunai berhasil dicatat'), {
    summary: 'Mark invoice as manually paid',
    tags: ['Invoices'],
    auth: 'bearer',
    subscriptionRequired: true,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              amountPaid: { type: 'number', example: 156000, description: 'Jumlah yang dicatat manual oleh staf atau dokter.' },
            },
            required: ['amountPaid'],
          },
        },
      },
    },
  });
  router.post('/invoices/:id/pdf', async ({ params }) => invoicesService.createPdf(requireParam(params.id, 'id')), {
    summary: 'Generate invoice PDF', description: 'Menghasilkan dokumen PDF invoice untuk diunduh atau dicetak.', tags: ['Invoices'], auth: 'bearer', subscriptionRequired: true,
    responses: { '200': { description: 'PDF invoice', content: { 'application/pdf': { schema: { type: 'string', contentEncoding: 'binary' } } } } },
  });
}

function parseCreateInvoiceBody(body: unknown) {
  const payload = body as { medicalRecordId?: string } | undefined;
  if (!payload?.medicalRecordId) throw new Error('medicalRecordId wajib diisi.');
  return {
    medicalRecordId: payload.medicalRecordId,
  };
}

function parsePayCashBody(body: unknown) {
  const payload = body as { amountPaid?: number } | undefined;
  return {
    amountPaid: Number(payload?.amountPaid ?? 0),
  };
}
