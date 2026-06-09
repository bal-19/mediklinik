import { useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { dashboardService } from '../../services/api-services';

export function DashboardPage() {
  const query = useQuery({ queryKey: ['dashboard'], queryFn: dashboardService.summary });
  return <Page title="Dashboard" description="Ringkasan yang perlu ditindak hari ini."><QueryState isLoading={query.isLoading} error={query.error} />{query.data && <><div className="stat-grid"><article><span>Antrian aktif</span><strong>{query.data.activeQueueCount}</strong></article><article><span>Pasien hari ini</span><strong>{query.data.totalPatientsToday}</strong></article><article><span>Pendapatan</span><strong>Rp {query.data.todayRevenue.toLocaleString('id-ID')}</strong></article><article><span>Nomor berjalan</span><strong className="mono">{query.data.todayQueueNumber}</strong></article></div><div className="panel"><h2>Alert stok rendah</h2>{query.data.lowStockAlerts.map((item) => <p key={item.medicineId}>{item.medicineName}: <b>{item.stockQuantity}</b> tersisa</p>)}</div></>}</Page>;
}
