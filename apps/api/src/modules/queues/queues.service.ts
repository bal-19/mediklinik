import type { QueueItemSummary } from '@mediklinik/types';
import { queues } from '../shared/mock-data';

export class QueuesService {
  getToday(): QueueItemSummary[] {
    return queues;
  }

  callNext(): QueueItemSummary {
    const nextQueue = queues.find((item) => item.status === 'WAITING');

    if (!nextQueue) {
      throw new Error('Tidak ada antrian yang menunggu.');
    }

    return nextQueue;
  }
}
