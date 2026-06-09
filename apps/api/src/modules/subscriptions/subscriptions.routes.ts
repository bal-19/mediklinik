import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { SubscriptionsService } from './subscriptions.service';

const subscriptionsService = new SubscriptionsService();

export function registerSubscriptionRoutes(router: ApiRouter) {
  router.post('/subscriptions/checkout', () =>
    ok(subscriptionsService.checkout(), 'Checkout subscription berhasil dibuat'),
  );
  router.post('/subscriptions/webhook', () =>
    ok(subscriptionsService.webhook(), 'Webhook subscription berhasil diproses'),
  );
}
