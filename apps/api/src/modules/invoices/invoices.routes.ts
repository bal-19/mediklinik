import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { InvoicesService } from './invoices.service';

const invoicesService = new InvoicesService();

export function registerInvoiceRoutes(router: ApiRouter) {
  router.get('/invoices', () => ok(invoicesService.list()));
  router.get('/invoices/:id', () => ok(invoicesService.getById()));
  router.post('/invoices/:id/pay-online', () =>
    ok(invoicesService.payOnline(), 'Transaksi pembayaran online berhasil dibuat'),
  );
}
