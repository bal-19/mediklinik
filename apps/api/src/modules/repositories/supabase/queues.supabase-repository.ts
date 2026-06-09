import type { CreateQueueInput, QueueItemSummary, UpdateQueueStatusInput } from '@mediklinik/types';
import type { QueuesRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';

export class SupabaseQueuesRepository implements QueuesRepositoryContract {
  listToday(): QueueItemSummary[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseQueuesRepository.listToday belum diimplementasikan penuh.');
  }

  create(_input: CreateQueueInput): QueueItemSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseQueuesRepository.create belum diimplementasikan penuh.');
  }

  callNext(): QueueItemSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseQueuesRepository.callNext belum diimplementasikan penuh.');
  }

  updateStatus(_queueId: string, _input: UpdateQueueStatusInput): QueueItemSummary {
    getSupabaseAdminClient();
    return notImplemented('SupabaseQueuesRepository.updateStatus belum diimplementasikan penuh.');
  }
}

function notImplemented(message: string): never {
  throw new Error(message);
}
