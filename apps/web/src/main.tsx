import './styles.css';
import { getDashboardSummary, getInvoices, getMedicines, getQueuesToday, getSubscription, loginDemo } from './api';
import { renderApp, type AppData } from './app-shell';
import { getSession } from './auth-state';

const root = document.getElementById('root');

async function bootstrap() {
  if (!root) return;

  await renderCurrentRoute();
  bindNavigation();
}

async function renderCurrentRoute(error?: string) {
  if (!root) return;

  const pathname = window.location.pathname;
  root.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Memuat MediKlinik...</div>';

  const data: AppData = {
    error: error ?? null,
  };

  try {
    if (pathname.startsWith('/app')) {
      if (!getSession()) {
        navigate('/login');
        return;
      }

      const [dashboardSummary, subscription] = await Promise.all([getDashboardSummary().catch(() => null), getSubscription().catch(() => null)]);
      data.dashboardSummary = dashboardSummary;
      data.subscription = subscription;

      if (subscription && (subscription.status === 'EXPIRED' || subscription.status === 'SUSPENDED') && !pathname.startsWith('/app/billing')) {
        navigate('/app/billing/blocked');
        return;
      }

      if (pathname.startsWith('/app/queues')) data.queues = await getQueuesToday();
      if (pathname.startsWith('/app/medicines')) data.medicines = await getMedicines();
      if (pathname.startsWith('/app/invoices')) data.invoices = await getInvoices();
    }
  } catch (routeError) {
    data.error = routeError instanceof Error ? routeError.message : 'Terjadi kesalahan saat memuat data.';
  }

  root.innerHTML = renderApp(pathname, data);
  bindNavigation();
  bindActions();
}

function bindNavigation() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((anchor) => {
    anchor.onclick = (event) => {
      event.preventDefault();
      navigate(anchor.getAttribute('href') ?? '/');
    };
  });
}

function bindActions() {
  const loginButton = document.querySelector<HTMLButtonElement>('[data-action="login-demo"]');
  if (loginButton) {
    loginButton.onclick = async () => {
      try {
        loginButton.disabled = true;
        loginButton.textContent = 'Memproses...';
        await loginDemo();
        navigate('/app/dashboard');
      } catch (error) {
        await renderCurrentRoute(error instanceof Error ? error.message : 'Login demo gagal.');
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Masuk Demo';
      }
    };
  }
}

function navigate(pathname: string) {
  window.history.pushState({}, '', pathname);
  void renderCurrentRoute();
}

window.addEventListener('popstate', () => {
  void renderCurrentRoute();
});

void bootstrap();
