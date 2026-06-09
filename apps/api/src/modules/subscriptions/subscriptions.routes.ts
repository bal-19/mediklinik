import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { SubscriptionsService } from './subscriptions.service';

const subscriptionsService = new SubscriptionsService();

export function registerSubscriptionRoutes(router: ApiRouter) {
  router.post(
    '/subscriptions/checkout',
    async ({ body }) => ok(await subscriptionsService.checkout(body as import('@mediklinik/types').SubscriptionCheckoutInput), 'Checkout subscription berhasil dibuat'),
    {
      summary: 'Create subscription checkout',
      description: 'Membuat transaksi Midtrans platform untuk pembayaran langganan MediKlinik.',
      tags: ['Subscriptions'],
      auth: 'public',
    },
  );
  router.post(
    '/subscriptions/webhook',
    ({ body }) => ok(subscriptionsService.webhook(body as import('@mediklinik/types').MidtransWebhookPayload), 'Webhook subscription berhasil diproses'),
    {
      summary: 'Handle subscription webhook',
      description: 'Endpoint webhook Midtrans platform untuk mengaktifkan atau memperpanjang subscription klinik.',
      tags: ['Subscriptions'],
      auth: 'public',
    },
  );
  router.get('/subscriptions/payments', () => ok(subscriptionsService.history()), {
    summary: 'List subscription payment history', tags: ['Subscriptions'], auth: 'bearer',
  });
}
