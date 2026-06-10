import { Page } from '../../components/shared/Page';
import { useAuthStore } from '../../stores/auth-store';

export function PatientProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <Page
      eyebrow="Profil Pasien"
      title="Identitas Akun Saya"
      description="Informasi ini dipakai saat mengambil antrian, menerima invoice, dan membuka histori kunjungan."
    >
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Akun aktif</p>
              <h2>{user?.fullName}</h2>
            </div>
          </div>
          <div className="metric-list">
            <article>
              <strong>Email</strong>
              <span>{user?.email}</span>
            </article>
            <article>
              <strong>Role</strong>
              <span>{user?.role}</span>
            </article>
            <article>
              <strong>Status akses</strong>
              <span>{user?.subscriptionStatus}</span>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Tentang akun ini</p>
              <h2>Dipakai untuk alur kunjungan</h2>
            </div>
          </div>
          <p>
            Gunakan akun yang sama saat login ke halaman publik klinik agar nomor antrian, invoice, dan histori kunjungan
            tetap berada pada identitas pasien yang konsisten.
          </p>
        </section>
      </div>
    </Page>
  );
}
