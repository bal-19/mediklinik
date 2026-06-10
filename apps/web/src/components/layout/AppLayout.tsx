import { useQuery } from '@tanstack/react-query';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { clinicService } from '../../services/api-services';
import { useAuthStore } from '../../stores/auth-store';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

type NavGroup = {
  label: string;
  items: Array<{ label: string; href: string }>;
};

const navByRole: Record<string, NavGroup[]> = {
  SUPER_ADMIN: [
    { label: 'Monitoring', items: [{ label: 'Dashboard', href: '/app/dashboard' }, { label: 'Laporan', href: '/app/reports' }] },
    { label: 'Klinik', items: [{ label: 'Billing', href: '/app/billing' }] },
  ],
  ADMIN: [
    { label: 'Operasional', items: [{ label: 'Dashboard', href: '/app/dashboard' }, { label: 'Antrian', href: '/app/queues' }] },
    { label: 'Apotek', items: [{ label: 'Stok Obat', href: '/app/medicines' }] },
    { label: 'Keuangan', items: [{ label: 'Invoice', href: '/app/invoices' }, { label: 'Laporan', href: '/app/reports' }] },
    { label: 'Klinik', items: [{ label: 'Billing', href: '/app/billing' }] },
  ],
  DOCTOR: [
    { label: 'Pelayanan', items: [{ label: 'Antrian', href: '/app/queues' }, { label: 'Rekam Medis', href: '/app/medical-records' }] },
    { label: 'Akun', items: [{ label: 'Profil', href: '/app/profile' }] },
  ],
  PATIENT: [
    { label: 'Kunjungan', items: [{ label: 'Antrian Saya', href: '/app/queues' }, { label: 'Invoice', href: '/app/invoices' }] },
    { label: 'Akun', items: [{ label: 'Profil', href: '/app/profile' }] },
  ],
};

const bottomNavByRole: Record<string, Array<{ label: string; href: string }>> = {
  SUPER_ADMIN: [{ label: 'Home', href: '/app/dashboard' }, { label: 'Laporan', href: '/app/reports' }, { label: 'Billing', href: '/app/billing' }],
  ADMIN: [{ label: 'Home', href: '/app/dashboard' }, { label: 'Antrian', href: '/app/queues' }, { label: 'Invoice', href: '/app/invoices' }, { label: 'Billing', href: '/app/billing' }],
  DOCTOR: [{ label: 'Antrian', href: '/app/queues' }, { label: 'Rekam', href: '/app/medical-records' }, { label: 'Profil', href: '/app/profile' }],
  PATIENT: [{ label: 'Antrian', href: '/app/queues' }, { label: 'Invoice', href: '/app/invoices' }, { label: 'Profil', href: '/app/profile' }],
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
  const role = user?.role ?? 'ADMIN';
  const roleKey = role as keyof typeof navByRole;
  const navGroups = navByRole[roleKey]!;
  const bottomNav = bottomNavByRole[roleKey]!;
  const subscription = useQuery({ queryKey: ['subscription'], queryFn: clinicService.me });
  const blocked = subscription.data && ['EXPIRED', 'SUSPENDED'].includes(subscription.data.subscriptionStatus);
  const crumb = findCurrentLabel(navGroups, location.pathname);

  if (blocked && !location.pathname.startsWith('/app/billing')) {
    return <Navigate to="/app/billing/blocked" replace />;
  }

  return (
    <div className="app-grid">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <a className="brand" href="/">
            Medi<span>Klinik</span>
          </a>
          <p className="sidebar-copy">Workspace klinik yang terstruktur untuk hari kerja yang sibuk.</p>
        </div>

        <div className="sidebar-clinic">
          <p className="eyebrow">Klinik aktif</p>
          <strong>{subscription.data?.name ?? 'Memuat workspace...'}</strong>
          <span className={`status-pill ${getSubscriptionTone(subscription.data?.subscriptionStatus)}`}>
            {subscription.data?.subscriptionStatus ?? 'Memuat'}
          </span>
        </div>

        <nav className="sidebar-groups">
          {navGroups.map((group) => (
            <section key={group.label}>
              <p className="nav-label">{group.label}</p>
              <div className="nav-list">
                {group.items.map((item) => (
                  <NavLink key={item.href} to={item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="sidebar-user">
          <div>
            <strong>{user?.fullName ?? 'Pengguna'}</strong>
            <p>{user?.email}</p>
          </div>
          <span className="badge">{role}</span>
          <button
            className="ghost"
            onClick={() => {
              clearSession();
              window.location.assign('/login');
            }}
          >
            Keluar
          </button>
        </div>
      </aside>

      <section className="app-stage">
        {!isOnline && <div className="offline">Anda sedang offline - data mungkin belum terbaru.</div>}
        <header className="topbar">
          <div>
            <p className="topbar-label">Navigasi</p>
            <strong>{crumb}</strong>
          </div>
          <div className="topbar-actions">
            <span className={`status-pill ${getSubscriptionTone(subscription.data?.subscriptionStatus)}`}>
              {subscription.data?.subscriptionStatus ?? 'Memuat'}
            </span>
            <div className="topbar-user">
              <strong>{user?.fullName ?? 'Pengguna'}</strong>
              <span>{role}</span>
            </div>
          </div>
        </header>
        <main className="app-content">
          <Outlet />
        </main>
        <nav className="bottom-nav">
          {bottomNav.map((item) => (
            <NavLink key={item.href} to={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </section>
    </div>
  );
}

function getSubscriptionTone(status?: string) {
  switch (status) {
    case 'ACTIVE':
      return 'tone-success';
    case 'TRIAL':
      return 'tone-info';
    case 'EXPIRED':
      return 'tone-danger';
    case 'SUSPENDED':
      return 'tone-muted';
    default:
      return 'tone-info';
  }
}

function findCurrentLabel(groups: NavGroup[], pathname: string) {
  for (const group of groups) {
    const current = group.items.find((item) => pathname.startsWith(item.href));
    if (current) return `${group.label} / ${current.label}`;
  }
  return 'Workspace Klinik';
}
