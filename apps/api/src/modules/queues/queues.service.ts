import type { CreateQueueInput, QueueItemSummary, UpdateQueueStatusInput } from '@mediklinik/types';
import { getQueuesRepository } from '../repositories';

export class QueuesService {
  private readonly queuesRepository = getQueuesRepository();

  getToday(): QueueItemSummary[] {
    return this.queuesRepository.listToday();
  }

  register(input: CreateQueueInput): QueueItemSummary {
    return this.queuesRepository.create(input);
  }

  callNext(): QueueItemSummary {
    return this.queuesRepository.callNext();
  }

  updateStatus(queueId: string, input: UpdateQueueStatusInput): QueueItemSummary {
    return this.queuesRepository.updateStatus(queueId, input);
  }
}
