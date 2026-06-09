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
  router.get('/invoices/:id', async ({ params }) => ok(await invoicesService.getById(params.id ?? 'inv_1')), {
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
    summary: 'Pay invoice by cash',
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
              amountPaid: { type: 'number', example: 156000 },
            },
            required: ['amountPaid'],
          },
        },
      },
    },
  });
  router.post(
    '/invoices/:id/pay-online',
    () => ok(invoicesService.payOnline(), 'Transaksi pembayaran online berhasil dibuat'),
    {
      summary: 'Create online payment transaction',
      description: 'Buat transaksi Midtrans Snap untuk invoice pasien menggunakan credential Midtrans milik klinik aktif.',
      tags: ['Invoices'],
      auth: 'bearer',
      subscriptionRequired: true,
    },
  );
}

function parseCreateInvoiceBody(body: unknown) {
  const payload = body as { medicalRecordId?: string } | undefined;
  return {
    medicalRecordId: payload?.medicalRecordId ?? 'mr_1',
  };
}

function parsePayCashBody(body: unknown) {
  const payload = body as { amountPaid?: number } | undefined;
  return {
    amountPaid: Number(payload?.amountPaid ?? 0),
  };
}
