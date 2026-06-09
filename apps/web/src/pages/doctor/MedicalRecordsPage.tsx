import { useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { medicalRecordService } from '../../services/api-services';

export function MedicalRecordsPage() {
  const query = useQuery({ queryKey: ['medical-records'], queryFn: () => medicalRecordService.list() });
  return <Page title="Rekam Medis" description="Ruang kerja dokter yang fokus dan bebas distraksi."><QueryState isLoading={query.isLoading} error={query.error} /><div className="list">{query.data?.map((record) => <article key={record.id}><div><strong>{record.diagnosis}</strong><p>{record.chiefComplaint}</p></div><span>{record.patientId}</span><span className="badge">{record.lockedAt ? 'Terkunci' : 'Dapat diedit'}</span></article>)}</div></Page>;
}
