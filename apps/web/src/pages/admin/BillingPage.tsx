import { useMutation, useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { clinicService, subscriptionService } from '../../services/api-services';
import { usePushNotification } from '../../hooks/usePushNotification';
import { useAuthStore } from '../../stores/auth-store';

export function BillingPage({ blocked = false }: { blocked?: boolean }) {
  const user = useAuthStore((state) => state.user);
  const clinic = useQuery({ queryKey: ['clinic'], queryFn: clinicService.me });
  const status = useQuery({ queryKey: ['subscription'], queryFn: subscriptionService.status });
  const history = useQuery({ queryKey: ['subscription-history'], queryFn: subscriptionService.history });
  const checkout = useMutation({
    mutationFn: subscriptionService.checkout,
    onSuccess: ({ redirectUrl }) => {
      if (redirectUrl) window.location.assign(redirectUrl);
    },
  });
  const push = usePushNotification();

  return (
    <Page
      eyebrow="Billing"
      title={blocked ? 'Akses Workspace Dijeda' : 'Langganan dan Integrasi Klinik'}
      description={
        blocked
          ? 'Perpanjang langganan untuk membuka kembali dashboard, antrian, dan layanan publik klinik.'
          : 'Kelola status paket, histori pembayaran subscription, notifikasi browser, dan credential Midtrans tenant.'
      }
    >
      <QueryState isLoading={status.isLoading || clinic.isLoading || history.isLoading} error={(status.error ?? clinic.error ?? history.error) as Error | null} />

      {status.data && (
        <div className="stat-grid">
          <article>
            <span>Status subscription</span>
            <strong>{status.data.status}</strong>
          </article>
          <article>
            <span>Paket aktif</span>
            <strong>{status.data.plan}</strong>
          </article>
          <article>
            <span>Sisa hari</span>
            <strong>{status.data.daysRemaining}</strong>
          </article>
          <article>
            <span>Layanan publik</span>
            <strong>{clinic.data?.slug ? 'Aktif' : 'Memuat'}</strong>
          </article>
        </div>
      )}

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Aksi utama</p>
              <h2>Perpanjang atau aktifkan paket</h2>
            </div>
          </div>
          <p>
            Billing subscription MediKlinik memakai akun Midtrans platform. Pembayaran pasien di klinik dicatat manual
            oleh dokter atau staf sesuai operasional yang Anda pilih.
          </p>
          <div className="actions">
            <button
              onClick={() =>
                clinic.data &&
                user &&
                checkout.mutate({
                  clinicId: clinic.data.id,
                  clinicSlug: clinic.data.slug,
                  plan: clinic.data.subscriptionPlan,
                  email: user.email,
                })
              }
            >
              Langganan / Perpanjang via Midtrans
            </button>
            <button className="ghost" onClick={() => void push.subscribe()}>
              Aktifkan notifikasi browser
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Histori pembayaran</p>
              <h2>Transaksi langganan terakhir</h2>
            </div>
          </div>
          <div className="metric-list">
            {history.data?.length ? (
              history.data.map((item) => (
                <article key={item.id}>
                  <strong>
                    {item.plan} - Rp {item.amount.toLocaleString('id-ID')}
                  </strong>
                  <span>
                    {item.status} | {item.periodStart} sampai {item.periodEnd}
                  </span>
                </article>
              ))
            ) : (
              <article>
                <strong>Belum ada histori pembayaran</strong>
                <span>Transaksi subscription pertama akan muncul di area ini setelah checkout berhasil.</span>
              </article>
            )}
          </div>
        </section>
      </div>
    </Page>
  );
}
