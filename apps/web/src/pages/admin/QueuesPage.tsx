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
  const call = useMutation({ mutationFn: queueService.callNext, onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['queues'] }) });
  return <Page title="Antrian Hari Ini" description="Status bergerak realtime di seluruh meja layanan." action={<button onClick={() => call.mutate()}>Panggil berikutnya</button>}><QueryState isLoading={query.isLoading} error={query.error} /><div className="list">{query.data?.map((queue) => <article key={queue.id}><strong className="mono">{queue.queueNumber}</strong><span>{queue.patientId}</span><span className="badge">{queue.status}</span></article>)}{query.data?.length === 0 && <div className="panel">Belum ada antrian hari ini.</div>}</div></Page>;
}
