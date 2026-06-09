import { Page } from '../../components/shared/Page';
import { useAuthStore } from '../../stores/auth-store';

export function PatientProfilePage() {
  const user = useAuthStore((state) => state.user);
  return <Page title="Profil Saya" description="Identitas yang digunakan pada kunjungan dan invoice."><div className="panel"><p className="eyebrow">Akun aktif</p><h2>{user?.fullName}</h2><p>{user?.email}</p><span className="badge">{user?.role}</span></div></Page>;
}
