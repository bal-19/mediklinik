import type { CreateQueueInput, QueueItemSummary, UpdateQueueStatusInput } from '@mediklinik/types';
import { getQueuesRepository } from '../repositories';

export class QueuesService {
  private readonly queuesRepository = getQueuesRepository();

  async getToday(): Promise<QueueItemSummary[]> {
    return this.queuesRepository.listToday();
  }

  async register(input: CreateQueueInput): Promise<QueueItemSummary> {
    return this.queuesRepository.create(input);
  }

  async callNext(): Promise<QueueItemSummary> {
    return this.queuesRepository.callNext();
  }

  async updateStatus(queueId: string, input: UpdateQueueStatusInput): Promise<QueueItemSummary> {
    return this.queuesRepository.updateStatus(queueId, input);
  }
}
