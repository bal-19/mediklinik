import { useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { medicalRecordService } from '../../services/api-services';
import { useAuthStore } from '../../stores/auth-store';

export function MedicalRecordsPage() {
  const user = useAuthStore((state) => state.user);
  const query = useQuery({
    queryKey: ['medical-records', user?.id],
    queryFn: () => medicalRecordService.list(user!.id),
    enabled: Boolean(user?.id),
  });

  return (
    <Page
      eyebrow="Ruang Dokter"
      title="Rekam Medis Pasien"
      description="Riwayat kunjungan, diagnosis, dan status penguncian rekam medis ditampilkan ringkas agar dokter tetap fokus."
      action={<button>Buat catatan baru</button>}
    >
      <QueryState isLoading={query.isLoading} error={query.error} />

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Daftar kunjungan</p>
            <h2>Catatan medis yang Anda tangani</h2>
          </div>
        </div>

        <div className="entity-list">
          {query.data?.map((record) => (
            <article key={record.id}>
              <div>
                <strong>{record.diagnosis}</strong>
                <p>{record.chiefComplaint}</p>
                <small>Pasien ID: {record.patientId}</small>
              </div>
              <div className="entity-meta">
                <span className={`status-pill ${record.lockedAt ? 'tone-muted' : 'tone-info'}`}>
                  {record.lockedAt ? 'TERKUNCI' : 'DAPAT_DIEDIT'}
                </span>
                <small>{record.createdAt}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
