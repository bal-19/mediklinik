import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { SubscriptionsService } from './subscriptions.service';

const subscriptionsService = new SubscriptionsService();

export function registerSubscriptionRoutes(router: ApiRouter) {
  router.post(
    '/subscriptions/checkout',
    () => ok(subscriptionsService.checkout(), 'Checkout subscription berhasil dibuat'),
    {
      summary: 'Create subscription checkout',
      description: 'Membuat transaksi Midtrans platform untuk pembayaran langganan MediKlinik.',
      tags: ['Subscriptions'],
      auth: 'public',
    },
  );
  router.post(
    '/subscriptions/webhook',
    () => ok(subscriptionsService.webhook(), 'Webhook subscription berhasil diproses'),
    {
      summary: 'Handle subscription webhook',
      description: 'Endpoint webhook Midtrans platform untuk mengaktifkan atau memperpanjang subscription klinik.',
      tags: ['Subscriptions'],
      auth: 'public',
    },
  );
}
