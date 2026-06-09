import type { CreateQueueInput, QueueItemSummary, UpdateQueueStatusInput } from '@mediklinik/types';
import { callNextQueue, createQueue, queues, updateQueueStatus } from '../shared/mock-data';

export class QueuesService {
  getToday(): QueueItemSummary[] {
    return queues;
  }

  register(input: CreateQueueInput): QueueItemSummary {
    return createQueue(input);
  }

  callNext(): QueueItemSummary {
    return callNextQueue();
  }

  updateStatus(queueId: string, input: UpdateQueueStatusInput): QueueItemSummary {
    return updateQueueStatus(queueId, input);
  }
}
