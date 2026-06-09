import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { QueuesService } from './queues.service';

const queuesService = new QueuesService();

export function registerQueueRoutes(router: ApiRouter) {
  router.get('/queues/today', () => ok(queuesService.getToday()));
  router.patch('/queues/:id/call', () => ok(queuesService.callNext(), 'Nomor antrian berikutnya dipanggil'));
}
