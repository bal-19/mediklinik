import { useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { dashboardService } from '../../services/api-services';

export function DashboardPage() {
  const query = useQuery({ queryKey: ['dashboard'], queryFn: dashboardService.summary });

  return (
    <Page
      eyebrow="Dashboard"
      title="Ringkasan Operasional Hari Ini"
      description="Lihat antrian berjalan, omzet hari ini, dan alert stok tanpa berpindah antar halaman."
      action={<button>Lihat laporan bulanan</button>}
    >
      <QueryState isLoading={query.isLoading} error={query.error} />

      {query.data && (
        <>
          <div className="stat-grid">
            <article>
              <span>Antrian aktif</span>
              <strong>{query.data.activeQueueCount}</strong>
            </article>
            <article>
              <span>Pasien hari ini</span>
              <strong>{query.data.totalPatientsToday}</strong>
            </article>
            <article>
              <span>Pendapatan hari ini</span>
              <strong>Rp {query.data.todayRevenue.toLocaleString('id-ID')}</strong>
            </article>
            <article>
              <span>Nomor berjalan</span>
              <strong className="mono">{query.data.todayQueueNumber}</strong>
            </article>
          </div>

          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Fokus cepat</p>
                  <h2>Aksi yang paling mungkin dibutuhkan sekarang</h2>
                </div>
              </div>
              <div className="metric-list">
                <article>
                  <strong>Panggil pasien berikutnya</strong>
                  <span>Gunakan halaman antrian untuk memindahkan status dari WAITING ke CALLED.</span>
                </article>
                <article>
                  <strong>Periksa tagihan yang belum lunas</strong>
                  <span>Invoice online dan pembayaran manual tetap tercatat dari satu area keuangan.</span>
                </article>
                <article>
                  <strong>Amankan stok kritis</strong>
                  <span>Restock obat yang sudah menyentuh ambang minimum sebelum jam sibuk berikutnya.</span>
                </article>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Alert stok</p>
                  <h2>Obat yang perlu perhatian</h2>
                </div>
              </div>
              <div className="metric-list">
                {query.data.lowStockAlerts.length ? (
                  query.data.lowStockAlerts.map((item) => (
                    <article key={item.medicineId}>
                      <strong>{item.medicineName}</strong>
                      <span>
                        Tersisa {item.stockQuantity} unit, batas minimum {item.minStockAlert} unit.
                      </span>
                    </article>
                  ))
                ) : (
                  <article>
                    <strong>Tidak ada stok kritis</strong>
                    <span>Semua obat masih berada di atas batas minimum yang ditetapkan.</span>
                  </article>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </Page>
  );
}
