import type { CreateQueueInput, QueueItemSummary, UpdateQueueStatusInput } from '@mediklinik/types';
import type { QueuesRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';
import { getTodayDate, requireClinicId } from './utils';

interface QueueRow {
  id: string;
  clinic_id: string;
  patient_id: string;
  queue_number: string;
  status: 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'DONE' | 'SKIP';
  date: string;
  called_at: string | null;
  done_at: string | null;
}

export class SupabaseQueuesRepository implements QueuesRepositoryContract {
  async listToday(): Promise<QueueItemSummary[]> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();
    const today = getTodayDate();

    const { data, error } = await client
      .from('queues')
      .select('id, clinic_id, patient_id, queue_number, status, date, called_at, done_at')
      .eq('clinic_id', clinicId)
      .eq('date', today)
      .order('queue_number', { ascending: true });

    if (error) {
      throw new Error(`Gagal mengambil data antrian: ${error.message}`);
    }

    return (data ?? []).map(mapQueueRow);
  }

  async create(input: CreateQueueInput): Promise<QueueItemSummary> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();
    const today = getTodayDate();
    const todayQueues = await this.listToday();

    const highestNumber = todayQueues.reduce((highest, item) => {
      const numericPart = Number(item.queueNumber.split('-')[1] ?? '0');
      return Math.max(highest, numericPart);
    }, 0);

    const nextQueueNumber = `A-${String(highestNumber + 1).padStart(3, '0')}`;

    const { data, error } = await client
      .from('queues')
      .insert({
        clinic_id: clinicId,
        patient_id: input.patientId,
        queue_number: nextQueueNumber,
        status: 'WAITING',
        date: today,
      })
      .select('id, clinic_id, patient_id, queue_number, status, date, called_at, done_at')
      .single();

    if (error || !data) {
      throw new Error(`Gagal membuat antrian: ${error?.message ?? 'insert tidak mengembalikan data.'}`);
    }

    return mapQueueRow(data);
  }

  async callNext(): Promise<QueueItemSummary> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();
    const today = getTodayDate();
    const queues = await this.listToday();

    const currentInProgress = queues.find((item) => item.status === 'IN_PROGRESS');
    if (currentInProgress) {
      const doneAt = new Date().toISOString();
      const { error: doneError } = await client
        .from('queues')
        .update({
          status: 'DONE',
          done_at: doneAt,
        })
        .eq('id', currentInProgress.id)
        .eq('clinic_id', clinicId)
        .eq('date', today);

      if (doneError) {
        throw new Error(`Gagal menutup antrian aktif: ${doneError.message}`);
      }
    }

    const waitingQueue = queues.find((item) => item.status === 'WAITING');
    if (!waitingQueue) {
      throw new Error('Tidak ada antrian yang menunggu.');
    }

    const calledAt = new Date().toISOString();
    const { data, error } = await client
      .from('queues')
      .update({
        status: 'CALLED',
        called_at: calledAt,
      })
      .eq('id', waitingQueue.id)
      .eq('clinic_id', clinicId)
      .eq('date', today)
      .select('id, clinic_id, patient_id, queue_number, status, date, called_at, done_at')
      .single();

    if (error || !data) {
      throw new Error(`Gagal memanggil antrian berikutnya: ${error?.message ?? 'update tidak mengembalikan data.'}`);
    }

    return mapQueueRow(data);
  }

  async updateStatus(queueId: string, input: UpdateQueueStatusInput): Promise<QueueItemSummary> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();
    const today = getTodayDate();

    const payload: Partial<QueueRow> = {
      status: input.status,
    };

    if (input.status === 'CALLED') {
      payload.called_at = new Date().toISOString();
    }

    if (input.status === 'DONE') {
      payload.done_at = new Date().toISOString();
    }

    const { data, error } = await client
      .from('queues')
      .update(payload)
      .eq('id', queueId)
      .eq('clinic_id', clinicId)
      .eq('date', today)
      .select('id, clinic_id, patient_id, queue_number, status, date, called_at, done_at')
      .single();

    if (error || !data) {
      throw new Error(`Gagal memperbarui status antrian: ${error?.message ?? 'update tidak mengembalikan data.'}`);
    }

    return mapQueueRow(data);
  }
}

function mapQueueRow(row: QueueRow): QueueItemSummary {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    patientId: row.patient_id,
    queueNumber: row.queue_number,
    status: row.status,
    date: row.date,
    calledAt: row.called_at,
    doneAt: row.done_at,
  };
}
