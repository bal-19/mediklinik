import type {
  DashboardSummary,
  InvoiceSummary,
  MedicineSummary,
  QueueItemSummary,
  SubscriptionSummary,
} from '@mediklinik/types';
import { getSession } from './auth-state';
import { dashboardNavigationByRole, faqItems, featureItems, pricingPlans, testimonials } from './site-content';

export interface AppData {
  dashboardSummary?: DashboardSummary | null;
  queues?: QueueItemSummary[] | null;
  medicines?: MedicineSummary[] | null;
  invoices?: InvoiceSummary[] | null;
  subscription?: SubscriptionSummary | null;
  error?: string | null;
}

export function renderApp(pathname: string, data: AppData = {}) {
  if (pathname.startsWith('/klinik/nonaktif')) return renderInactiveClinicPage();
  if (pathname.startsWith('/klinik/')) return renderClinicPublicPage();
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) return renderAuthPage(pathname, data.error);
  if (pathname.startsWith('/app')) return renderDashboardShell(pathname, data);
  return renderLandingPage();
}

function renderLandingPage() {
  return `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_38%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] text-slate-900">
      <header class="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div class="text-xl font-bold tracking-tight">MediKlinik</div>
          <nav class="hidden gap-6 text-sm text-slate-600 md:flex">
            <a href="#fitur">Fitur</a>
            <a href="#pricing">Harga</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a class="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm" href="/register">Mulai Gratis 14 Hari</a>
        </div>
      </header>
      <main>
        <section class="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span class="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">SaaS Manajemen Klinik</span>
            <h1 class="mt-6 max-w-3xl text-5xl font-bold leading-tight">Operasional klinik lebih rapi, cepat, dan realtime dalam satu dashboard.</h1>
            <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Kelola antrian, rekam medis, stok obat, invoice, dan langganan klinik dengan alur yang dirancang untuk tim lapangan yang sibuk.</p>
            <div class="mt-8 flex flex-wrap gap-4">
              <a class="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20" href="/register">Mulai Gratis 14 Hari</a>
              <a class="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700" href="#pricing">Lihat Harga</a>
            </div>
          </div>
          <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-sky-100/60">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl bg-slate-50 p-5"><div class="text-sm text-slate-500">Antrian aktif</div><div class="mt-3 font-mono text-4xl font-bold text-slate-900">A-023</div></div>
              <div class="rounded-2xl bg-sky-50 p-5"><div class="text-sm text-sky-700">Subscription</div><div class="mt-3 text-2xl font-bold text-slate-900">TRIAL 14 Hari</div></div>
              <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:col-span-2"><div class="text-sm font-medium text-amber-700">Alert stok</div><div class="mt-2 text-lg font-semibold text-slate-900">Amoxicillin tinggal 8 strip, segera restock.</div></div>
            </div>
          </div>
        </section>
        <section id="fitur" class="mx-auto max-w-6xl px-6 py-20"><div class="max-w-2xl"><h2 class="text-3xl font-bold">Fitur yang langsung relevan untuk operasional klinik.</h2><p class="mt-4 text-slate-600">Setiap modul disusun untuk membantu staf klinik bergerak cepat tanpa kehilangan akurasi.</p></div><div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">${featureItems.map((item) => `<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">${item.kicker}</div><h3 class="mt-3 text-xl font-semibold">${item.title}</h3><p class="mt-3 text-sm leading-7 text-slate-600">${item.description}</p></article>`).join('')}</div></section>
        <section id="pricing" class="mx-auto max-w-6xl px-6 py-20"><div class="text-center"><h2 class="text-3xl font-bold">Pricing yang sederhana untuk skala klinik yang berbeda.</h2><p class="mt-4 text-slate-600">Paket Clinic menjadi pilihan paling populer untuk klinik umum yang sedang tumbuh.</p></div><div class="mt-10 grid gap-6 lg:grid-cols-3">${pricingPlans.map((plan) => `<article class="rounded-3xl border ${plan.highlight ? 'border-sky-400 bg-sky-50 shadow-lg shadow-sky-100' : 'border-slate-200 bg-white'} p-7"><div class="flex items-center justify-between"><h3 class="text-2xl font-bold">${plan.name}</h3>${plan.highlight ? '<span class="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">Terpopuler</span>' : ''}</div><div class="mt-5 text-4xl font-bold">Rp ${plan.price.toLocaleString('id-ID')}<span class="text-base font-medium text-slate-500">/bln</span></div><p class="mt-4 text-sm leading-7 text-slate-600">${plan.description}</p><a class="mt-8 inline-flex w-full items-center justify-center rounded-full ${plan.highlight ? 'bg-sky-500 text-white' : 'border border-slate-300 bg-white text-slate-800'} px-5 py-3 text-sm font-semibold" href="/register">${plan.ctaLabel}</a></article>`).join('')}</div></section>
        <section class="mx-auto max-w-6xl px-6 py-20"><div class="grid gap-6 lg:grid-cols-3">${testimonials.map((item) => `<blockquote class="rounded-3xl border border-slate-200 bg-white p-6"><p class="text-sm leading-7 text-slate-700">"${item.quote}"</p><footer class="mt-6 text-sm font-semibold text-slate-900">${item.author}</footer></blockquote>`).join('')}</div></section>
        <section id="faq" class="mx-auto max-w-4xl px-6 py-20"><h2 class="text-center text-3xl font-bold">Pertanyaan yang paling sering muncul.</h2><div class="mt-10 space-y-4">${faqItems.map((item) => `<details class="rounded-2xl border border-slate-200 bg-white p-5"><summary class="cursor-pointer text-base font-semibold">${item.question}</summary><p class="mt-3 text-sm leading-7 text-slate-600">${item.answer}</p></details>`).join('')}</div></section>
      </main>
    </div>
  `;
}

function renderClinicPublicPage() {
  return `
    <div class="min-h-screen bg-slate-50 text-slate-900"><header class="border-b border-slate-200 bg-white"><div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"><div><div class="text-lg font-bold">Klinik Sehat Sentosa</div><div class="text-sm text-slate-500">Layanan kesehatan keluarga</div></div><a class="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white" href="/klinik/klinik-sehat/login">Daftar Antrian</a></div></header><main class="mx-auto max-w-5xl px-6 py-10"><section class="grid gap-8 rounded-[28px] border border-slate-200 bg-white p-8 lg:grid-cols-[1.2fr_0.8fr]"><div><span class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">TRIAL AKTIF</span><h1 class="mt-5 text-4xl font-bold">Akses layanan klinik dan ambil nomor antrian tanpa harus datang lebih dulu.</h1><p class="mt-4 text-base leading-8 text-slate-600">Jl. Sehat No. 10, Jakarta. Buka Senin sampai Jumat pukul 08:00-17:00, Sabtu 08:00-13:00.</p></div><div class="rounded-3xl bg-slate-950 p-6 text-white"><div class="text-sm uppercase tracking-[0.2em] text-sky-300">Kontak</div><div class="mt-3 text-2xl font-bold">(021) 555-0101</div><p class="mt-4 text-sm leading-7 text-slate-300">Gunakan halaman ini untuk melihat dokter aktif, jadwal praktik, dan memulai pendaftaran antrian pasien.</p></div></section></main></div>
  `;
}

function renderInactiveClinicPage() {
  return `<div class="flex min-h-screen items-center justify-center bg-slate-50 px-6"><div class="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60"><div class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Klinik Tidak Aktif</div><h1 class="mt-4 text-4xl font-bold">Klinik ini sedang tidak tersedia.</h1><p class="mt-4 text-base leading-8 text-slate-600">Subscription klinik sedang berstatus EXPIRED atau SUSPENDED, sehingga halaman publik dan dashboard dibatasi sementara.</p><a class="mt-8 inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white" href="/">Kembali ke MediKlinik</a></div></div>`;
}

function renderAuthPage(pathname: string, error?: string | null) {
  const isRegister = pathname.startsWith('/register');
  return `
    <div class="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div class="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">MediKlinik</div>
        <h1 class="mt-4 text-3xl font-bold">${isRegister ? 'Daftar Klinik Baru' : 'Masuk ke Dashboard'}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-600">${isRegister ? 'Mulai trial 14 hari dan aktifkan halaman publik klinik Anda.' : 'Gunakan akun demo backend untuk masuk dan melihat data dashboard nyata.'}</p>
        ${error ? `<div class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">${error}</div>` : ''}
        <div class="mt-8 grid gap-4">
          <div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">admin@mediklinik.id</div>
          <div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">password</div>
          <button data-action="login-demo" class="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white">${isRegister ? 'Masuk Demo Setelah Registrasi' : 'Masuk Demo'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardShell(pathname: string, data: AppData) {
  if (pathname.startsWith('/app/billing/blocked')) return renderBillingBlockedPage();

  const session = getSession();
  const subscription = data.subscription ?? data.dashboardSummary?.subscription ?? null;

  return `
    <div class="min-h-screen bg-slate-50 text-slate-900 md:grid md:grid-cols-[240px_1fr]">
      <aside class="border-r border-slate-200 bg-white p-5">
        <div class="mb-8">
          <div class="text-lg font-bold">MediKlinik</div>
          <div class="text-sm text-slate-500">${session?.user.fullName ?? 'Klinik Demo'}</div>
        </div>
        <div class="space-y-6">
          ${Object.entries(dashboardNavigationByRole.ADMIN).map(([group, items]) => `<section><div class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">${group}</div><div class="space-y-2">${items.map((item) => `<a class="block rounded-2xl px-4 py-3 text-sm ${pathname.startsWith(item.href) ? 'bg-sky-100 font-semibold text-sky-700' : 'text-slate-600'}" href="${item.href}">${item.label}</a>`).join('')}</div></section>`).join('')}
        </div>
      </aside>
      <div>
        <header class="sticky top-0 border-b border-slate-200 bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold">${getPageTitle(pathname)}</h1>
              <p class="text-sm text-slate-500">${getPageDescription(pathname)}</p>
            </div>
            <div class="rounded-full ${subscription?.status === 'TRIAL' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'} px-4 py-2 text-sm font-semibold">${subscription?.status ?? 'TRIAL'}${subscription?.daysRemaining ? ` • ${subscription.daysRemaining} hari tersisa` : ''}</div>
          </div>
        </header>
        <main class="mx-auto max-w-7xl px-6 py-8">
          ${data.error ? `<div class="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">${data.error}</div>` : ''}
          ${renderDashboardContent(pathname, data)}
        </main>
      </div>
    </div>
  `;
}

function renderDashboardContent(pathname: string, data: AppData) {
  if (pathname.startsWith('/app/queues')) {
    const queues = data.queues ?? [];
    return `<section class="grid gap-6 lg:grid-cols-3">${queues.map((item) => `<article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">${item.patientId}</div><div class="mt-3 font-mono text-4xl font-bold">${item.queueNumber}</div><div class="mt-4 rounded-full ${statusClass(item.status)} px-3 py-1 text-xs font-semibold inline-flex">${item.status}</div></article>`).join('') || emptyState('Belum ada antrian hari ini')}</section>`;
  }

  if (pathname.startsWith('/app/medicines')) {
    const medicines = data.medicines ?? [];
    return `<section class="grid gap-6">${medicines.map((item) => `<article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold">${item.name}</h2><span class="rounded-full ${item.stockQuantity <= item.minStockAlert ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} px-3 py-1 text-xs font-semibold">${item.unit}</span></div><p class="mt-4 text-sm text-slate-600">Stok ${item.stockQuantity} • Minimum alert ${item.minStockAlert}</p></article>`).join('') || emptyState('Belum ada data obat')}</section>`;
  }

  if (pathname.startsWith('/app/invoices')) {
    const invoices = data.invoices ?? [];
    return `<section class="grid gap-6">${invoices.map((item) => `<article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="flex items-center justify-between"><div><div class="text-sm text-slate-500">${item.id}</div><h2 class="mt-2 text-xl font-semibold">${item.patientId}</h2></div><span class="rounded-full ${statusClass(item.status)} px-3 py-1 text-xs font-semibold">${item.status}</span></div><div class="mt-4 text-2xl font-bold">Rp ${item.totalAmount.toLocaleString('id-ID')}</div><p class="mt-3 text-sm text-slate-500">${item.items.length} item layanan</p></article>`).join('') || emptyState('Belum ada invoice')}</section>`;
  }

  if (pathname.startsWith('/app/billing')) {
    const subscription = data.subscription ?? data.dashboardSummary?.subscription;
    return `<section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><article class="rounded-3xl border border-amber-200 bg-amber-50 p-6"><div class="text-sm font-semibold text-amber-700">Status Subscription</div><div class="mt-3 text-3xl font-bold">${subscription?.status ?? 'TRIAL'}${subscription?.daysRemaining ? ` • ${subscription.daysRemaining} hari tersisa` : ''}</div><p class="mt-4 text-sm leading-7 text-slate-700">Halaman billing mengikuti PRD: hanya klinik TRIAL dan ACTIVE yang tetap bisa mengakses area app, sementara EXPIRED dan SUSPENDED diarahkan ke halaman blocked billing.</p><div class="mt-6 flex gap-4"><a class="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white" href="/app/billing/checkout">Perpanjang Sekarang</a><a class="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700" href="/app/settings/midtrans">Setup Midtrans</a></div></article><article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Role aktif</div><div class="mt-3 text-lg font-semibold">${getSession()?.user.role ?? 'ADMIN'}</div><p class="mt-3 text-sm leading-7 text-slate-600">Credential Midtrans klinik tetap hanya disimpan dan diproses oleh backend.</p></article></section>`;
  }

  if (pathname.startsWith('/app/settings/midtrans')) {
    return `<section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Integrasi Midtrans Klinik</div><h2 class="mt-3 text-3xl font-bold">Setup credential pembayaran pasien</h2><p class="mt-4 text-sm leading-7 text-slate-600">Mengikuti AGENTS dan PRD, server key tidak pernah dikirim balik ke browser. Frontend hanya perlu mengirim form ke backend dan menerima status setup.</p><div class="mt-6 grid gap-4"><div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">Merchant ID</div><div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">Client Key</div><div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">Server Key</div></div></article><article class="rounded-3xl border border-amber-200 bg-amber-50 p-6"><div class="text-sm font-semibold text-amber-700">Aturan Keamanan</div><p class="mt-4 text-sm leading-7 text-slate-700">Endpoint backend hanya mengembalikan flag konfigurasi, bukan credential mentah.</p></article></section>`;
  }

  const summary = data.dashboardSummary;
  return `<section class="grid gap-6 lg:grid-cols-3"><article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Antrian hari ini</div><div class="mt-3 font-mono text-4xl font-bold">${summary?.todayQueueNumber ?? 'A-000'}</div></article><article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Pasien hari ini</div><div class="mt-3 text-4xl font-bold">${summary?.totalPatientsToday ?? 0}</div></article><article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Pendapatan hari ini</div><div class="mt-3 text-4xl font-bold">Rp ${(summary?.todayRevenue ?? 0).toLocaleString('id-ID')}</div></article></section><section class="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Alert stok menipis</div><div class="mt-5 space-y-4">${summary?.lowStockAlerts.map((item) => `<div class="rounded-2xl bg-amber-50 p-4"><div class="font-semibold">${item.medicineName}</div><div class="mt-2 text-sm text-slate-600">Sisa ${item.stockQuantity}, minimum ${item.minStockAlert}</div></div>`).join('') ?? ''}</div></article><article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Status user</div><div class="mt-4 text-lg font-semibold">${getSession()?.user.fullName ?? 'Admin Klinik'}</div><p class="mt-2 text-sm text-slate-600">${getSession()?.user.email ?? 'admin@mediklinik.id'}</p></article></section>`;
}

function renderBillingBlockedPage() {
  return `<div class="flex min-h-screen items-center justify-center bg-slate-50 px-6"><div class="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"><div class="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Subscription EXPIRED</div><h1 class="mt-6 text-4xl font-bold">Masa langganan Anda telah berakhir.</h1><p class="mt-4 text-base leading-8 text-slate-600">Akses ke area dashboard dibatasi sampai pembayaran subscription MediKlinik diperpanjang.</p><div class="mt-8 flex gap-4"><a class="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white" href="/app/billing">Buka Halaman Billing</a><a class="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700" href="/">Kembali ke Landing</a></div></div></div>`;
}

function emptyState(label: string) {
  return `<article class="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">${label}</article>`;
}

function statusClass(status: string) {
  if (status === 'PAID' || status === 'DONE' || status === 'ACTIVE') return 'bg-emerald-100 text-emerald-700';
  if (status === 'UNPAID' || status === 'EXPIRED') return 'bg-rose-100 text-rose-700';
  if (status === 'IN_PROGRESS' || status === 'TRIAL') return 'bg-sky-100 text-sky-700';
  return 'bg-amber-100 text-amber-700';
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith('/app/queues')) return 'Antrian';
  if (pathname.startsWith('/app/medicines')) return 'Stok Obat';
  if (pathname.startsWith('/app/invoices')) return 'Invoice';
  if (pathname.startsWith('/app/settings/midtrans')) return 'Setup Midtrans Klinik';
  if (pathname.startsWith('/app/billing')) return 'Billing';
  return 'Dashboard';
}

function getPageDescription(pathname: string) {
  if (pathname.startsWith('/app/queues')) return 'Pantau dan panggil antrian pasien hari ini.';
  if (pathname.startsWith('/app/medicines')) return 'Kelola stok, threshold minimum, dan persiapan restock.';
  if (pathname.startsWith('/app/invoices')) return 'Pantau status invoice dan pembayaran pasien.';
  if (pathname.startsWith('/app/settings/midtrans')) return 'Simpan credential Midtrans per-klinik dengan alur yang aman.';
  if (pathname.startsWith('/app/billing')) return 'Kelola status langganan, perpanjangan, dan setup Midtrans klinik.';
  return 'Ringkasan operasional harian klinik.';
}
