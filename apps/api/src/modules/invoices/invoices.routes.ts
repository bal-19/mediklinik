import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { InvoicesService } from './invoices.service';

const invoicesService = new InvoicesService();

export function registerInvoiceRoutes(router: ApiRouter) {
  router.get('/invoices', () => ok(invoicesService.list()), {
    summary: 'List invoices',
    tags: ['Invoices'],
    auth: 'bearer',
  });
  router.get('/invoices/:id', () => ok(invoicesService.getById()), {
    summary: 'Get invoice detail',
    tags: ['Invoices'],
    auth: 'bearer',
  });
  router.post(
    '/invoices/:id/pay-online',
    () => ok(invoicesService.payOnline(), 'Transaksi pembayaran online berhasil dibuat'),
    {
      summary: 'Create online payment transaction',
      description: 'Buat transaksi Midtrans Snap untuk invoice pasien menggunakan credential Midtrans milik klinik aktif.',
      tags: ['Invoices'],
      auth: 'bearer',
    },
  );
}
