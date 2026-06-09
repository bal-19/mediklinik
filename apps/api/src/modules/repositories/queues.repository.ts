import type { CreateQueueInput, QueueItemSummary, UpdateQueueStatusInput } from '@mediklinik/types';
import type { QueuesRepositoryContract } from './contracts';
import { inMemoryDb } from '../shared/in-memory-db';

export class QueuesRepository implements QueuesRepositoryContract {
  listToday(): QueueItemSummary[] {
    return inMemoryDb.getState().queues;
  }

  create(input: CreateQueueInput): QueueItemSummary {
    const state = inMemoryDb.getState();
    const highestQueueNumber = state.queues.reduce((highest, item) => {
      const number = Number(item.queueNumber.split('-')[1] ?? '0');
      return Math.max(highest, number);
    }, 0);

    const nextNumber = highestQueueNumber + 1;
    const queue: QueueItemSummary = {
      id: `queue_${nextNumber}`,
      clinicId: 'clinic_demo',
      patientId: input.patientId,
      queueNumber: `A-${String(nextNumber).padStart(3, '0')}`,
      status: 'WAITING',
      date: '2026-06-09',
      calledAt: null,
      doneAt: null,
    };

    state.queues.push(queue);
    return queue;
  }

  callNext(): QueueItemSummary {
    const state = inMemoryDb.getState();
    const currentInProgress = state.queues.find((item) => item.status === 'IN_PROGRESS');
    if (currentInProgress) {
      currentInProgress.status = 'DONE';
      currentInProgress.doneAt = new Date().toISOString();
    }

    const waitingQueue = state.queues.find((item) => item.status === 'WAITING');
    if (!waitingQueue) {
      throw new Error('Tidak ada antrian yang menunggu.');
    }

    waitingQueue.status = 'CALLED';
    waitingQueue.calledAt = new Date().toISOString();
    return waitingQueue;
  }

  updateStatus(queueId: string, input: UpdateQueueStatusInput): QueueItemSummary {
    const queue = inMemoryDb.getState().queues.find((item) => item.id === queueId);
    if (!queue) {
      throw new Error('Antrian tidak ditemukan.');
    }

    queue.status = input.status;
    if (input.status === 'CALLED' && !queue.calledAt) {
      queue.calledAt = new Date().toISOString();
    }
    if (input.status === 'DONE') {
      queue.doneAt = new Date().toISOString();
    }

    return queue;
  }
}
