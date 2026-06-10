import { useMutation, useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { queryClient } from '../../lib/query-client';
import { queueService } from '../../services/api-services';
import { useAuthStore } from '../../stores/auth-store';
import { useQueueRealtime } from '../../hooks/useQueueRealtime';

export function QueuesPage() {
  const user = useAuthStore((state) => state.user);
  useQueueRealtime(user?.clinicId);

  const query = useQuery({ queryKey: ['queues', 'today'], queryFn: queueService.today });
  const call = useMutation({
    mutationFn: queueService.callNext,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['queues'] }),
  });

  const waitingCount = query.data?.filter((queue) => queue.status === 'WAITING').length ?? 0;
  const current = query.data?.find((queue) => queue.status === 'CALLED' || queue.status === 'IN_PROGRESS');

  return (
    <Page
      eyebrow="Antrian"
      title="Antrian Hari Ini"
      description="Pantau laju layanan dari meja pendaftaran sampai ruang pemeriksaan secara realtime."
      action={<button onClick={() => call.mutate()}>Panggil berikutnya</button>}
    >
      <QueryState isLoading={query.isLoading} error={query.error} />

      <div className="stat-grid compact">
        <article>
          <span>Sedang berjalan</span>
          <strong className="mono">{current?.queueNumber ?? '-'}</strong>
        </article>
        <article>
          <span>Menunggu</span>
          <strong>{waitingCount}</strong>
        </article>
        <article>
          <span>Total hari ini</span>
          <strong>{query.data?.length ?? 0}</strong>
        </article>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Daftar realtime</p>
            <h2>Urutan pasien yang terdaftar hari ini</h2>
          </div>
        </div>

        <div className="entity-list">
          {query.data?.map((queue) => (
            <article key={queue.id}>
              <div>
                <strong className="mono">{queue.queueNumber}</strong>
                <p>Pasien ID: {queue.patientId}</p>
              </div>
              <div className="entity-meta">
                <span className={`status-pill ${getQueueTone(queue.status)}`}>{queue.status}</span>
                <small>{queue.date}</small>
              </div>
            </article>
          ))}
          {query.data?.length === 0 && <div className="panel subtle">Belum ada antrian hari ini.</div>}
        </div>
      </section>
    </Page>
  );
}

function getQueueTone(status: string) {
  switch (status) {
    case 'DONE':
      return 'tone-success';
    case 'CALLED':
    case 'IN_PROGRESS':
      return 'tone-info';
    case 'SKIP':
      return 'tone-muted';
    default:
      return 'tone-warning';
  }
}
