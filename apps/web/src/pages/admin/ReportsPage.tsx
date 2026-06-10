import { useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { reportsService } from '../../services/api-services';

export function ReportsPage() {
  const visits = useQuery({ queryKey: ['reports', 'visits'], queryFn: reportsService.visits });
  const revenue = useQuery({ queryKey: ['reports', 'revenue'], queryFn: reportsService.revenue });

  return (
    <Page
      eyebrow="Laporan"
      title="Statistik dan Ringkasan Bulanan"
      description="Pantau tren kunjungan dan pendapatan tanpa harus merapikan spreadsheet di akhir bulan."
    >
      <QueryState isLoading={visits.isLoading || revenue.isLoading} error={(visits.error ?? revenue.error) as Error | null} />

      <div className="report-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Kunjungan</p>
              <h2>Volume pasien per bulan</h2>
            </div>
          </div>
          <div className="metric-list">
            {visits.data?.map((item) => (
              <article key={item.month}>
                <strong>{item.month}</strong>
                <span>{item.totalVisits} kunjungan</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Pendapatan</p>
              <h2>Ringkasan omzet per bulan</h2>
            </div>
          </div>
          <div className="metric-list">
            {revenue.data?.map((item) => (
              <article key={item.month}>
                <strong>{item.month}</strong>
                <span>Rp {item.totalRevenue.toLocaleString('id-ID')}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
