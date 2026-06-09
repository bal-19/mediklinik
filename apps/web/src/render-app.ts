import {
  dashboardNavigationByRole,
  faqItems,
  featureItems,
  pricingPlans,
  testimonials,
} from './site-content';

export function renderApp(pathname: string) {
  if (pathname.startsWith('/klinik/')) {
    return renderClinicPublicPage();
  }

  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return renderAuthPage(pathname);
  }

  if (pathname.startsWith('/app')) {
    return renderDashboardShell();
  }

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
              <div class="rounded-2xl bg-slate-50 p-5">
                <div class="text-sm text-slate-500">Antrian aktif</div>
                <div class="mt-3 font-mono text-4xl font-bold text-slate-900">A-023</div>
              </div>
              <div class="rounded-2xl bg-sky-50 p-5">
                <div class="text-sm text-sky-700">Subscription</div>
                <div class="mt-3 text-2xl font-bold text-slate-900">TRIAL 14 Hari</div>
              </div>
              <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:col-span-2">
                <div class="text-sm font-medium text-amber-700">Alert stok</div>
                <div class="mt-2 text-lg font-semibold text-slate-900">Amoxicillin tinggal 8 strip, segera restock.</div>
              </div>
            </div>
          </div>
        </section>
        <section class="mx-auto max-w-6xl px-6 pb-8">
          <div class="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 md:grid-cols-3">
            <div><div class="text-sm text-slate-500">Klinik aktif</div><div class="mt-2 text-3xl font-bold">120+</div></div>
            <div><div class="text-sm text-slate-500">Kunjungan diproses</div><div class="mt-2 text-3xl font-bold">48.000+</div></div>
            <div><div class="text-sm text-slate-500">Rata-rata hemat waktu admin</div><div class="mt-2 text-3xl font-bold">60%</div></div>
          </div>
        </section>
        <section id="fitur" class="mx-auto max-w-6xl px-6 py-20">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-bold">Fitur yang langsung relevan untuk operasional klinik.</h2>
            <p class="mt-4 text-slate-600">Setiap modul disusun untuk membantu staf klinik bergerak cepat tanpa kehilangan akurasi.</p>
          </div>
          <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            ${featureItems
              .map(
                (item) => `
                <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">${item.kicker}</div>
                  <h3 class="mt-3 text-xl font-semibold">${item.title}</h3>
                  <p class="mt-3 text-sm leading-7 text-slate-600">${item.description}</p>
                </article>`,
              )
              .join('')}
          </div>
        </section>
        <section class="mx-auto max-w-6xl px-6 py-20">
          <div class="grid gap-8 lg:grid-cols-3">
            <div class="rounded-3xl bg-slate-950 p-8 text-white">
              <div class="text-sm uppercase tracking-[0.2em] text-sky-300">Cara kerja</div>
              <h2 class="mt-4 text-3xl font-bold">Alur yang terasa natural untuk tim klinik.</h2>
            </div>
            <div class="rounded-3xl border border-slate-200 bg-white p-8">
              <div class="text-sm font-semibold text-sky-600">1. Registrasi & setup</div>
              <p class="mt-3 text-slate-600">Klinik daftar, dapat trial 14 hari, lalu set up identitas publik dan akun staf inti.</p>
            </div>
            <div class="rounded-3xl border border-slate-200 bg-white p-8">
              <div class="text-sm font-semibold text-sky-600">2. Operasional harian</div>
              <p class="mt-3 text-slate-600">Admin mengelola antrian, dokter menulis rekam medis, sistem menyiapkan invoice dan stok otomatis.</p>
            </div>
          </div>
        </section>
        <section id="pricing" class="mx-auto max-w-6xl px-6 py-20">
          <div class="text-center">
            <h2 class="text-3xl font-bold">Pricing yang sederhana untuk skala klinik yang berbeda.</h2>
            <p class="mt-4 text-slate-600">Paket Clinic menjadi pilihan paling populer untuk klinik umum yang sedang tumbuh.</p>
          </div>
          <div class="mt-10 grid gap-6 lg:grid-cols-3">
            ${pricingPlans
              .map(
                (plan) => `
                <article class="rounded-3xl border ${
                  plan.highlight
                    ? 'border-sky-400 bg-sky-50 shadow-lg shadow-sky-100'
                    : 'border-slate-200 bg-white'
                } p-7">
                  <div class="flex items-center justify-between">
                    <h3 class="text-2xl font-bold">${plan.name}</h3>
                    ${plan.highlight ? '<span class="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">Terpopuler</span>' : ''}
                  </div>
                  <div class="mt-5 text-4xl font-bold">Rp ${plan.price.toLocaleString('id-ID')}<span class="text-base font-medium text-slate-500">/bln</span></div>
                  <p class="mt-4 text-sm leading-7 text-slate-600">${plan.description}</p>
                  <a class="mt-8 inline-flex w-full items-center justify-center rounded-full ${
                    plan.highlight ? 'bg-sky-500 text-white' : 'border border-slate-300 bg-white text-slate-800'
                  } px-5 py-3 text-sm font-semibold" href="/register">${plan.ctaLabel}</a>
                </article>`,
              )
              .join('')}
          </div>
        </section>
        <section class="mx-auto max-w-6xl px-6 py-20">
          <div class="grid gap-6 lg:grid-cols-3">
            ${testimonials
              .map(
                (item) => `
                <blockquote class="rounded-3xl border border-slate-200 bg-white p-6">
                  <p class="text-sm leading-7 text-slate-700">"${item.quote}"</p>
                  <footer class="mt-6 text-sm font-semibold text-slate-900">${item.author}</footer>
                </blockquote>`,
              )
              .join('')}
          </div>
        </section>
        <section id="faq" class="mx-auto max-w-4xl px-6 py-20">
          <h2 class="text-center text-3xl font-bold">Pertanyaan yang paling sering muncul.</h2>
          <div class="mt-10 space-y-4">
            ${faqItems
              .map(
                (item) => `
                <details class="rounded-2xl border border-slate-200 bg-white p-5">
                  <summary class="cursor-pointer text-base font-semibold">${item.question}</summary>
                  <p class="mt-3 text-sm leading-7 text-slate-600">${item.answer}</p>
                </details>`,
              )
              .join('')}
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderClinicPublicPage() {
  return `
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <header class="border-b border-slate-200 bg-white">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <div class="text-lg font-bold">Klinik Sehat Sentosa</div>
            <div class="text-sm text-slate-500">Layanan kesehatan keluarga</div>
          </div>
          <a class="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white" href="/klinik/klinik-sehat/login">Daftar Antrian</a>
        </div>
      </header>
      <main class="mx-auto max-w-5xl px-6 py-10">
        <section class="grid gap-8 rounded-[28px] border border-slate-200 bg-white p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">TRIAL AKTIF</span>
            <h1 class="mt-5 text-4xl font-bold">Akses layanan klinik dan ambil nomor antrian tanpa harus datang lebih dulu.</h1>
            <p class="mt-4 text-base leading-8 text-slate-600">Jl. Sehat No. 10, Jakarta. Buka Senin sampai Jumat pukul 08:00-17:00, Sabtu 08:00-13:00.</p>
          </div>
          <div class="rounded-3xl bg-slate-950 p-6 text-white">
            <div class="text-sm uppercase tracking-[0.2em] text-sky-300">Kontak</div>
            <div class="mt-3 text-2xl font-bold">(021) 555-0101</div>
            <p class="mt-4 text-sm leading-7 text-slate-300">Gunakan halaman ini untuk melihat dokter aktif, jadwal praktik, dan memulai pendaftaran antrian pasien.</p>
          </div>
        </section>
        <section class="mt-10">
          <h2 class="text-2xl font-bold">Dokter aktif</h2>
          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <article class="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 class="text-xl font-semibold">dr. Rani Kusuma</h3>
              <p class="mt-2 text-sm text-slate-500">Dokter Umum</p>
              <p class="mt-4 text-sm leading-7 text-slate-600">Senin 08:00-12:00, Rabu 13:00-17:00</p>
            </article>
            <article class="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 class="text-xl font-semibold">dr. Bayu Pratama</h3>
              <p class="mt-2 text-sm text-slate-500">Dokter Anak</p>
              <p class="mt-4 text-sm leading-7 text-slate-600">Selasa 09:00-14:00, Kamis 09:00-14:00</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderAuthPage(pathname: string) {
  const isRegister = pathname.startsWith('/register');
  return `
    <div class="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div class="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">MediKlinik</div>
        <h1 class="mt-4 text-3xl font-bold">${isRegister ? 'Daftar Klinik Baru' : 'Masuk ke Dashboard'}</h1>
        <p class="mt-3 text-sm leading-7 text-slate-600">${isRegister ? 'Mulai trial 14 hari dan aktifkan halaman publik klinik Anda.' : 'Gunakan email dan password untuk mengakses area operasional klinik.'}</p>
        <div class="mt-8 grid gap-4">
          <div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">Email</div>
          <div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">Password</div>
          <a class="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white" href="/app/dashboard">${isRegister ? 'Buat Akun & Mulai Trial' : 'Masuk Sekarang'}</a>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardShell() {
  return `
    <div class="min-h-screen bg-slate-50 text-slate-900 md:grid md:grid-cols-[240px_1fr]">
      <aside class="border-r border-slate-200 bg-white p-5">
        <div class="mb-8">
          <div class="text-lg font-bold">MediKlinik</div>
          <div class="text-sm text-slate-500">Klinik Sehat Sentosa</div>
        </div>
        <div class="space-y-6">
          ${Object.entries(dashboardNavigationByRole.ADMIN)
            .map(
              ([group, items]) => `
              <section>
                <div class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">${group}</div>
                <div class="space-y-2">
                  ${items
                    .map(
                      (item) => `
                      <a class="block rounded-2xl px-4 py-3 text-sm ${
                        item.active ? 'bg-sky-100 font-semibold text-sky-700' : 'text-slate-600'
                      }" href="${item.href}">${item.label}</a>`,
                    )
                    .join('')}
                </div>
              </section>`,
            )
            .join('')}
        </div>
      </aside>
      <div>
        <header class="sticky top-0 border-b border-slate-200 bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold">Dashboard</h1>
              <p class="text-sm text-slate-500">Ringkasan operasional harian klinik.</p>
            </div>
            <div class="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Trial aktif • 14 hari tersisa</div>
          </div>
        </header>
        <main class="mx-auto max-w-7xl px-6 py-8">
          <section class="grid gap-6 lg:grid-cols-3">
            <article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Antrian hari ini</div><div class="mt-3 font-mono text-4xl font-bold">A-023</div></article>
            <article class="rounded-3xl border border-slate-200 bg-white p-6"><div class="text-sm text-slate-500">Pendapatan hari ini</div><div class="mt-3 text-4xl font-bold">Rp 4.250.000</div></article>
            <article class="rounded-3xl border border-amber-200 bg-amber-50 p-6"><div class="text-sm text-amber-700">Billing</div><div class="mt-3 text-2xl font-bold">Perpanjang sebelum trial berakhir</div></article>
          </section>
        </main>
      </div>
    </div>
  `;
}
