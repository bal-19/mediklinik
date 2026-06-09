import type { MidtransWebhookPayload } from '@mediklinik/types';
import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { PaymentsService } from './payments.service';
const service = new PaymentsService();
export function registerPaymentRoutes(router: ApiRouter) {
  router.post('/payments/webhook', async ({ body }) => ok(await service.webhook(body as MidtransWebhookPayload), 'Webhook pembayaran pasien diproses'), {
    summary: 'Patient payment webhook', description: 'Memverifikasi signature Midtrans klinik dan memperbarui invoice. Order ID wajib memakai prefix klinik-INV.', tags: ['Payments'], auth: 'public',
  });
}
