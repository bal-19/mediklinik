import type { CreateQueueInput, QueueItemSummary, UpdateQueueStatusInput } from '@mediklinik/types';
import { getQueuesRepository } from '../repositories';
import { PushService } from '../push/push.service';

export class QueuesService {
  private readonly queuesRepository = getQueuesRepository();
  private readonly pushService = new PushService();

  async getToday(): Promise<QueueItemSummary[]> {
    return this.queuesRepository.listToday();
  }

  async register(input: CreateQueueInput): Promise<QueueItemSummary> {
    return this.queuesRepository.create(input);
  }

  async callNext(): Promise<QueueItemSummary> {
    const called = await this.queuesRepository.callNext();
    const queues = await this.queuesRepository.listToday();
    const waiting = queues.filter((queue) => queue.status === 'WAITING');
    const nearTurn = waiting[1];
    if (nearTurn) void this.pushService.sendToUser(nearTurn.patientId, { title: 'Antrian Anda hampir tiba', body: `${nearTurn.queueNumber} tinggal dua nomor lagi.`, url: '/app/queues', tag: 'queue-near-turn' });
    return called;
  }

  async updateStatus(queueId: string, input: UpdateQueueStatusInput): Promise<QueueItemSummary> {
    return this.queuesRepository.updateStatus(queueId, input);
  }
}
