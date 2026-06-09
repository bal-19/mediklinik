import type { PushSubscriptionInput } from '@mediklinik/types';
import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { PushService } from './push.service';
const service = new PushService();
export function registerPushRoutes(router: ApiRouter) {
  router.post('/push/subscribe', async ({ body }) => ok(await service.subscribe(body as PushSubscriptionInput), 'Push subscription tersimpan'), { summary: 'Subscribe web push', tags: ['Push'], auth: 'bearer', subscriptionRequired: true });
  router.delete('/push/unsubscribe', async ({ body }) => ok(await service.unsubscribe((body as { endpoint?: string } | undefined)?.endpoint ?? ''), 'Push subscription dihapus'), { summary: 'Unsubscribe web push', tags: ['Push'], auth: 'bearer', subscriptionRequired: true });
}
