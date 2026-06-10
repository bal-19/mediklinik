import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { requireParam } from '../shared/request-utils';
import { QueuesService } from './queues.service';

const queuesService = new QueuesService();

export function registerQueueRoutes(router: ApiRouter) {
  router.get('/queues/today', async () => ok(await queuesService.getToday()), {
    summary: 'List today queues',
    tags: ['Queues'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.post('/queues/register', async ({ body }) => ok(await queuesService.register(parseRegisterQueueBody(body)), 'Nomor antrian berhasil dibuat'), {
    summary: 'Register queue from app',
    tags: ['Queues'],
    auth: 'bearer',
    subscriptionRequired: true,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              patientId: { type: 'string', example: 'patient_4' },
            },
            required: ['patientId'],
          },
        },
      },
    },
  });
  router.patch('/queues/:id/call', async () => ok(await queuesService.callNext(), 'Nomor antrian berikutnya dipanggil'), {
    summary: 'Call next queue',
    tags: ['Queues'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
  router.patch('/queues/:id/status', async ({ params, body }) => ok(await queuesService.updateStatus(requireParam(params.id, 'id'), parseQueueStatusBody(body)), 'Status antrian diperbarui'), {
    summary: 'Update queue status',
    tags: ['Queues'],
    auth: 'bearer',
    subscriptionRequired: true,
  });
}

function parseRegisterQueueBody(body: unknown) {
  const payload = body as { patientId?: string } | undefined;
  if (!payload?.patientId) throw new Error('patientId wajib diisi.');
  return {
    patientId: payload.patientId,
  };
}

function parseQueueStatusBody(body: unknown) {
  const payload = body as { status?: 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'DONE' | 'SKIP' } | undefined;
  if (!payload?.status) throw new Error('status wajib diisi.');
  return {
    status: payload.status,
  };
}
