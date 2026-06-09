import { useQuery } from '@tanstack/react-query';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { clinicService } from '../../services/api-services';
import { useAuthStore } from '../../stores/auth-store';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const adminNav = [
  ['Dashboard', '/app/dashboard'],
  ['Antrian', '/app/queues'],
  ['Obat', '/app/medicines'],
  ['Invoice', '/app/invoices'],
  ['Billing', '/app/billing'],
] as const;

const roleNav = {
  SUPER_ADMIN: adminNav,
  ADMIN: adminNav,
  DOCTOR: [['Antrian', '/app/queues'], ['Rekam Medis', '/app/medical-records'], ['Profil', '/app/profile']] as const,
  PATIENT: [['Antrian Saya', '/app/queues'], ['Invoice', '/app/invoices'], ['Profil', '/app/profile']] as const,
};

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.accessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AppLayout() {
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const nav = roleNav[user?.role ?? 'ADMIN'];
  const subscription = useQuery({ queryKey: ['subscription'], queryFn: clinicService.me });
  const blocked = subscription.data && ['EXPIRED', 'SUSPENDED'].includes(subscription.data.subscriptionStatus);

  if (blocked && !location.pathname.startsWith('/app/billing')) return <Navigate to="/app/billing/blocked" replace />;

  return (
    <div className="app-grid">
      <aside className="sidebar">
        <a className="brand" href="/">Medi<span>Klinik</span></a>
        <p className="eyebrow">Workspace {user?.role ?? 'ADMIN'}</p>
        <nav>{nav.map(([label, href]) => <NavLink key={href} to={href}>{label}</NavLink>)}</nav>
        <button className="ghost" onClick={() => { clearSession(); window.location.assign('/login'); }}>Keluar</button>
      </aside>
      <section className="app-stage">
        {!isOnline && <div className="offline">Anda sedang offline, data mungkin belum terbaru.</div>}
        <header className="topbar"><strong>{subscription.data?.name ?? 'MediKlinik'}</strong><span className="badge">{subscription.data?.subscriptionStatus ?? 'Memuat'}</span></header>
        <main className="app-content"><Outlet /></main>
        <nav className="bottom-nav">{nav.slice(0, 4).map(([label, href]) => <NavLink key={href} to={href}>{label}</NavLink>)}</nav>
      </section>
    </div>
  );
}
