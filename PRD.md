# PRD — MediKlinik SaaS
**Version:** 1.3.0  
**Last Updated:** June 2026  
**Stack:** NestJS · React + Vite · Supabase · Tailwind CSS · Shadcn/UI · Midtrans · PWA  

---

## 1. Overview

### 1.1 Product Summary
MediKlinik adalah aplikasi manajemen klinik berbasis web (SaaS) yang membantu klinik pratama, dokter umum, dan praktek dokter mandiri mengelola operasional harian secara digital — mulai dari antrian pasien, rekam medis, stok obat, hingga pembayaran dan laporan.

### 1.2 Problem Statement
Mayoritas klinik kecil di Indonesia masih mengandalkan catatan manual atau spreadsheet untuk mengelola pasien, obat, dan keuangan. Akibatnya:
- Antrian tidak teratur dan tidak transparan
- Rekam medis mudah hilang atau sulit ditelusuri
- Stok obat sering tidak terpantau hingga habis
- Laporan keuangan membutuhkan waktu lama untuk disusun

### 1.3 Target Users
| Role | Deskripsi |
|---|---|
| **Super Admin (Platform)** | Tim MediKlinik yang mengelola seluruh klinik terdaftar di platform |
| **Admin Klinik** | Staf front office yang mengelola registrasi, antrian, dan pembayaran |
| **Dokter** | Dokter yang mengakses rekam medis, menulis diagnosa dan resep |
| **Pasien** | Pasien yang mendaftar dan memantau antrian secara mandiri |

### 1.4 Goals
- Kurangi waktu administrasi klinik hingga 60%
- Pasien dapat memantau nomor antrian secara realtime
- Semua rekam medis tersimpan digital dan mudah diakses
- Laporan keuangan & kunjungan otomatis tersedia setiap bulan

---

## 2. Scope (MVP)

### In Scope
- Sistem autentikasi multi-role (Admin, Dokter, Pasien)
- Registrasi pasien & manajemen antrian realtime
- Modul rekam medis (diagnosa, resep, riwayat kunjungan)
- Manajemen stok obat + alert menipis
- Invoice & pembayaran via Midtrans + generate PDF
- Dashboard laporan (grafik kunjungan & pendapatan — Shadcn Charts)
- Export laporan bulanan (Excel & PDF)
- **Multi-tenant Midtrans** — setiap klinik menggunakan akun Midtrans sendiri
- **Subscription & Billing** — pembayaran langganan MediKlinik via Midtrans platform (.env); akses dashboard dikunci jika belum/tidak aktif berlangganan
- **Landing page per klinik** (`/klinik/[slug]`) — halaman publik klinik: info klinik, daftar dokter & jadwal, tombol daftar antrian; hanya aktif jika subscription `ACTIVE` atau `TRIAL`
- **Landing page marketing** (fitur, pricing dengan tombol bayar langsung, CTA daftar)
- **Progressive Web App (PWA)** — installable, offline-ready, push notification

### Out of Scope (v1)
- Aplikasi mobile native (digantikan oleh PWA)
- Telemedicine / konsultasi online
- Integrasi BPJS Kesehatan
- Multi-cabang klinik
- Apotek publik (hanya stok internal)
- Blog / CMS untuk landing page

---

## 3. User Stories

### 3.1 Auth & Role Management

| ID | User Story | Priority |
|---|---|---|
| AUTH-01 | Sebagai Admin, saya bisa login dengan email & password | High |
| AUTH-02 | Sebagai Super Admin, saya bisa membuat akun Dokter dan Admin | High |
| AUTH-03 | Sebagai Pasien, saya bisa mendaftar akun sendiri | High |
| AUTH-04 | Sebagai pengguna, saya bisa reset password via email | Medium |
| AUTH-05 | Setiap role hanya dapat mengakses menu yang sesuai hak aksesnya | High |

### 3.2 Registrasi & Antrian Pasien

| ID | User Story | Priority |
|---|---|---|
| QUEUE-01 | Sebagai Pasien, saya bisa mendaftar kunjungan dan mendapat nomor antrian | High |
| QUEUE-02 | Sebagai Pasien, saya bisa memantau posisi antrian secara realtime | High |
| QUEUE-03 | Sebagai Admin, saya bisa memanggil nomor antrian berikutnya | High |
| QUEUE-04 | Sebagai Admin, saya bisa melihat daftar semua pasien yang menunggu hari ini | High |
| QUEUE-05 | Sistem mengirim notifikasi ke pasien saat gilirannya hampir tiba | Medium |

### 3.3 Rekam Medis

| ID | User Story | Priority |
|---|---|---|
| MED-01 | Sebagai Dokter, saya bisa melihat data lengkap pasien yang sedang diperiksa | High |
| MED-02 | Sebagai Dokter, saya bisa mengisi diagnosa, catatan, dan resep obat | High |
| MED-03 | Sebagai Dokter, saya bisa melihat riwayat kunjungan pasien sebelumnya | High |
| MED-04 | Sebagai Admin, saya bisa mencari rekam medis pasien berdasarkan nama/ID | Medium |
| MED-05 | Rekam medis tidak bisa diedit setelah lebih dari 24 jam dikunci | Medium |

### 3.4 Manajemen Obat & Stok

| ID | User Story | Priority |
|---|---|---|
| STOCK-01 | Sebagai Admin, saya bisa menambah, mengedit, dan menonaktifkan data obat | High |
| STOCK-02 | Sebagai Admin, saya bisa mencatat stok masuk (pembelian obat baru) | High |
| STOCK-03 | Sistem otomatis mengurangi stok saat obat diresepkan | High |
| STOCK-04 | Sistem menampilkan alert saat stok obat di bawah batas minimum | High |
| STOCK-05 | Sebagai Admin, saya bisa melihat riwayat keluar-masuk stok obat | Medium |

### 3.5 Invoice & Pembayaran

| ID | User Story | Priority |
|---|---|---|
| PAY-01 | Sistem otomatis membuat invoice setelah dokter selesai memeriksa | High |
| PAY-02 | Sebagai Admin, saya bisa memproses pembayaran via Midtrans (transfer/QRIS) | High |
| PAY-03 | Sebagai Admin, saya bisa mencatat pembayaran tunai manual | High |
| PAY-04 | Pasien dapat mengunduh invoice dalam format PDF | High |
| PAY-05 | Sebagai Admin, saya bisa melihat status pembayaran (lunas/belum/sebagian) | High |

### 3.6 Laporan & Export

| ID | User Story | Priority |
|---|---|---|
| RPT-01 | Sebagai Admin, saya bisa melihat grafik jumlah kunjungan per bulan | High |
| RPT-02 | Sebagai Admin, saya bisa melihat grafik pendapatan per bulan | High |
| RPT-03 | Sebagai Admin, saya bisa mengexport laporan kunjungan ke Excel | High |
| RPT-04 | Sebagai Admin, saya bisa mengexport laporan keuangan ke PDF | High |
| RPT-05 | Sebagai Dokter, saya bisa melihat statistik pasien yang ditangani | Medium |

### 3.7 Landing Page Marketing

| ID | User Story | Priority |
|---|---|---|
| LP-01 | Sebagai pengunjung, saya bisa melihat daftar fitur utama MediKlinik | High |
| LP-02 | Sebagai pengunjung, saya bisa melihat paket harga (pricing) yang tersedia | High |
| LP-03 | Sebagai pengunjung, saya bisa klik CTA "Mulai Gratis" dan diarahkan ke halaman registrasi | High |
| LP-04 | Sebagai pengunjung, saya bisa melihat testimoni dari pengguna klinik | Medium |
| LP-05 | Sebagai pengunjung, saya bisa melihat FAQ seputar produk | Medium |
| LP-06 | Landing page tampil optimal di mobile dan desktop | High |
| LP-07 | Landing page memiliki Lighthouse score ≥ 90 (Performance, SEO, Accessibility) | Medium |

### 3.8 Progressive Web App (PWA)

| ID | User Story | Priority |
|---|---|---|
| PWA-01 | Sebagai pengguna mobile, saya bisa menginstall MediKlinik ke homescreen | High |
| PWA-02 | Sebagai Pasien, saya bisa memantau antrian meski koneksi internet lemah (offline cache) | High |
| PWA-03 | Sebagai pengguna, saya menerima push notification saat nomor antrian hampir dipanggil | High |
| PWA-04 | Sebagai Admin, saya menerima push notification saat ada stok obat menipis | Medium |
| PWA-05 | App menampilkan splash screen dan ikon yang sesuai saat dibuka dari homescreen | Medium |
| PWA-06 | Halaman yang sudah dikunjungi tetap dapat dibuka saat offline (stale-while-revalidate) | Medium |

### 3.9 Subscription & Billing

| ID | User Story | Priority |
|---|---|---|
| SUB-01 | Sebagai pengunjung, saya bisa memilih paket pricing dan langsung bayar via Midtrans dari landing page | High |
| SUB-02 | Setelah pembayaran berhasil, akun klinik saya otomatis diaktifkan dan bisa akses dashboard | High |
| SUB-03 | Sebagai Admin Klinik, saya mendapat masa trial 14 hari gratis setelah registrasi | High |
| SUB-04 | Selama trial, saya bisa setup credential Midtrans klinik saya sendiri | High |
| SUB-05 | Setelah trial/langganan habis, saya tidak bisa mengakses dashboard dan diarahkan ke halaman billing | High |
| SUB-06 | Sebagai Admin Klinik, saya mendapat notifikasi H-7 sebelum langganan habis | Medium |
| SUB-07 | Sebagai Admin Klinik, saya bisa memperpanjang atau upgrade paket dari halaman billing | High |
| SUB-08 | Sebagai Super Admin Platform, saya bisa melihat semua klinik aktif dan status langganannya | Medium |

### 3.10 Halaman Publik Klinik (`/klinik/[slug]`)

| ID | User Story | Priority |
|---|---|---|
| CLINIC-01 | Sebagai pasien, saya bisa mengakses halaman publik klinik via URL `/klinik/[slug]` | High |
| CLINIC-02 | Sebagai pasien, saya bisa melihat info klinik: nama, alamat, jam buka, nomor telepon | High |
| CLINIC-03 | Sebagai pasien, saya bisa melihat daftar dokter dan jadwal praktik masing-masing | High |
| CLINIC-04 | Sebagai pasien, saya bisa klik "Daftar Antrian" dan diarahkan ke halaman login/register pasien | High |
| CLINIC-05 | Setelah login/register, pasien langsung diarahkan kembali ke halaman klinik untuk ambil nomor antrian | High |
| CLINIC-06 | Halaman publik klinik tidak dapat diakses jika klinik `EXPIRED` atau `SUSPENDED` (tampil halaman nonaktif) | High |
| CLINIC-07 | Sebagai Admin Klinik, saya bisa mengatur konten halaman publik (deskripsi, jam buka, info kontak) dari dashboard | Medium |
| CLINIC-08 | Halaman publik klinik tampil optimal di mobile (pasien mayoritas akses via HP) | High |

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization
- JWT-based authentication (access token + refresh token)
- Access token expiry: 15 menit; refresh token expiry: 7 hari
- Role-based access control (RBAC): `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT`
- Password hashing dengan bcrypt (min 12 rounds)
- Rate limiting pada endpoint login (max 5 attempts/menit)

### 4.2 Antrian Realtime
- Antrian di-reset setiap hari pukul 00:00 WIB (cron job)
- Format nomor antrian: `A-001`, `A-002`, dst.
- Realtime update menggunakan Supabase Realtime (WebSocket)
- Status antrian: `WAITING` → `CALLED` → `IN_PROGRESS` → `DONE` → `SKIP`

### 4.3 Rekam Medis
- Data rekam medis terenkripsi di database (kolom sensitif)
- Setiap record terhubung ke: pasien, dokter, kunjungan, dan resep
- Resep otomatis memotong stok obat setelah dokter menyimpan

### 4.4 Stok Obat
- Threshold alert stok minimum dapat dikonfigurasi per obat
- Notifikasi in-app saat stok menyentuh batas minimum
- Semua mutasi stok tercatat di tabel `stock_mutations` (audit trail)

### 4.5 Invoice & Midtrans (Per-Klinik)
- Invoice terdiri dari: biaya konsultasi + biaya obat
- Setiap klinik menggunakan akun Midtrans **milik mereka sendiri** (bukan akun platform)
- Saat membuat transaksi, backend mengambil `midtrans_server_key` dari tabel `clinics` berdasarkan `clinic_id` aktif pada request
- Credential Midtrans klinik dienkripsi di database (AES-256 atau Supabase Vault) — **tidak pernah dikirim ke frontend**
- Webhook Midtrans (pembayaran pasien) dibedakan via prefix `order_id`: format `{CLINIC_SLUG}-INV-{id}` (contoh: `klinik-sehat-INV-001`)
- Integrasi Midtrans Snap (pembayaran online)
- Generate PDF invoice menggunakan Puppeteer / PDFKit di sisi NestJS

**Dua lapisan Midtrans yang berbeda:**
| Lapisan | Akun | Digunakan Untuk |
|---|---|---|
| **Platform Midtrans** | Dari `.env` MediKlinik | Pembayaran subscription/langganan klinik ke MediKlinik |
| **Klinik Midtrans** | Dari DB per klinik (terenkripsi) | Pembayaran pasien ke klinik |

### 4.6 Laporan
- Data laporan di-aggregate dari tabel transaksi (tidak disimpan terpisah)
- Export Excel menggunakan library `exceljs`
- Export PDF laporan menggunakan Puppeteer template HTML

### 4.7 Landing Page
- Single-page marketing, dibangun dalam `apps/web/src/pages/landing/`
- Sections: Hero, Fitur, Cara Kerja, Pricing, Testimoni, FAQ, Footer
- CTA utama: "Mulai Gratis 14 Hari" → `/register`
- CTA sekunder: "Lihat Demo" → scroll ke section demo / video
- Pricing tiers:
  - **Starter** — Rp 149.000/bln — 1 dokter, 200 pasien/bln
  - **Clinic** — Rp 299.000/bln — 3 dokter, unlimited pasien
  - **Pro** — Rp 499.000/bln — unlimited dokter, multi-admin, priority support
- **Tombol "Mulai Gratis" di setiap pricing card** → registrasi klinik baru (trial 14 hari, tidak perlu bayar)
- **Tombol "Langganan Sekarang"** (opsional, untuk yang skip trial) → trigger Midtrans Snap menggunakan credential dari `.env` platform
- Webhook konfirmasi pembayaran subscription → aktifkan `subscription_status = ACTIVE` pada klinik terkait
- SEO: meta title, description, Open Graph tags, sitemap.xml
- Animasi scroll ringan (Framer Motion atau CSS transition)
- Tidak ada backend khusus untuk konten static — hanya subscription checkout yang hit API

### 4.8 Progressive Web App (PWA)
- Implementasi menggunakan `vite-plugin-pwa` (Workbox)
- `manifest.json` wajib berisi: name, short_name, icons (192x192 & 512x512), theme_color, background_color, display: `standalone`
- Service Worker strategy:
  - **App shell** (HTML, CSS, JS): `CacheFirst`
  - **API calls**: `NetworkFirst` dengan fallback cache
  - **Static assets** (gambar, font): `StaleWhileRevalidate`
- Push Notification menggunakan Web Push API + VAPID keys (di NestJS)
- Trigger notifikasi:
  - Pasien: antrian tinggal 2 nomor lagi (`queue_position <= 2`)
  - Admin: stok obat menyentuh batas minimum
- Offline fallback page: `/offline.html` ditampilkan jika network unavailable & halaman tidak ter-cache
- Lighthouse PWA score target: ≥ 90

### 4.10 Halaman Publik Klinik (`/klinik/[slug]`)
- Route publik, tidak memerlukan autentikasi untuk diakses
- Data yang ditampilkan (semua read-only, publik):
  - Info klinik: nama, deskripsi singkat, alamat, jam buka, nomor telepon
  - Daftar dokter aktif: nama, spesialisasi, foto (opsional), jadwal praktik per hari
- Tombol **"Daftar Antrian"**:
  - Jika pasien belum login → redirect ke `/klinik/[slug]/login` (login/register dengan konteks klinik)
  - Setelah autentikasi berhasil → redirect kembali ke `/klinik/[slug]?action=queue` untuk langsung ambil nomor antrian
- Halaman login/register pasien di konteks klinik (`/klinik/[slug]/login`) menggunakan alur AUTH-03 yang sudah ada, dengan parameter `redirect_back` ke halaman klinik
- Jika klinik `EXPIRED` atau `SUSPENDED` → tampil halaman nonaktif (bukan 404): *"Klinik ini sedang tidak tersedia."*
- Konten halaman publik dapat diedit Admin Klinik dari menu **Pengaturan Klinik → Halaman Publik** di dashboard
- Halaman ini di-render server-side friendly (SEO-ready) untuk memudahkan pasien menemukan klinik via search engine
- **Tidak menampilkan** data medis, stok obat, atau informasi operasional internal klinik

**Status Lifecycle:**
```
TRIAL (14 hari) → ACTIVE → EXPIRED → SUSPENDED
                     ↑______________|  (perpanjang)
```

- Setelah registrasi klinik baru: `subscription_status = TRIAL`, `trial_expires_at = now() + 14 days`
- Selama TRIAL: semua fitur aktif, termasuk setup credential Midtrans klinik
- Ketika trial/langganan habis: `subscription_status = EXPIRED`
- **Guard middleware** di semua route dashboard: cek `subscription_status IN ('TRIAL', 'ACTIVE')` dan tanggal belum lewat
- Jika EXPIRED/SUSPENDED → redirect ke `/billing` dengan pesan: *"Masa langganan Anda telah berakhir. Perpanjang untuk melanjutkan."*
- Landing page klinik (`/klinik/[slug]`) hanya bisa diakses jika status `ACTIVE` atau `TRIAL`
- **Notifikasi H-7**: cron job harian kirim email + push notification ke Admin Klinik jika langganan habis dalam 7 hari
- Pembayaran subscription menggunakan **Platform Midtrans** (credential dari `.env`) — bukan Midtrans klinik

**Environment Variables (Platform Midtrans):**
```env
MIDTRANS_PLATFORM_SERVER_KEY=...
MIDTRANS_PLATFORM_CLIENT_KEY=...
MIDTRANS_PLATFORM_IS_PRODUCTION=false
```

| Kategori | Requirement |
|---|---|
| **Performance** | Halaman utama load < 2 detik; API response < 500ms untuk operasi umum |
| **Availability** | Uptime target 99.5% (Railway/VPS deployment) |
| **Security** | HTTPS wajib; semua input divalidasi (class-validator NestJS); SQL injection dicegah via Supabase ORM |
| **Scalability** | Arsitektur stateless (JWT); database indexing pada kolom yang sering di-query |
| **Compatibility** | Support browser: Chrome, Firefox, Edge (versi 2 tahun terakhir) |
| **Responsiveness** | Tampilan optimal di desktop (1280px+); usable di tablet (768px+); mobile-first untuk pasien view |
| **PWA** | Lighthouse PWA score ≥ 90; installable di Android & iOS (Add to Homescreen) |
| **SEO** | Landing page Lighthouse SEO score ≥ 90; meta tags lengkap; sitemap.xml tersedia |

---

## 6. Database Schema (High-Level ERD)

```
clinics
  id, name, slug, owner_user_id (FK),
  midtrans_server_key (encrypted), midtrans_client_key (encrypted), merchant_id,
  subscription_status (TRIAL|ACTIVE|EXPIRED|SUSPENDED),
  subscription_plan (STARTER|CLINIC|PRO),
  trial_expires_at, subscription_expires_at,
  midtrans_subscription_order_id,
  -- Konten halaman publik (dapat diedit Admin Klinik)
  public_description, public_address, public_phone,
  public_open_hours (JSONB),  -- { mon: "08:00-17:00", tue: "08:00-17:00", ... }
  is_public_page_visible,
  created_at

doctor_schedules  (jadwal praktik dokter per hari — untuk halaman publik)
  id, doctor_id (FK), clinic_id (FK),
  day_of_week (0-6), start_time, end_time, is_active

users
  id, clinic_id (FK), email, password_hash, role, is_active, created_at

profiles
  id, user_id (FK), full_name, phone, date_of_birth, address, gender

doctors
  id, user_id (FK), clinic_id (FK), specialization, license_number, consultation_fee

queues
  id, clinic_id (FK), patient_id (FK), queue_number, status, date, called_at, done_at

medical_records
  id, clinic_id (FK), patient_id (FK), doctor_id (FK), queue_id (FK),
  chief_complaint, diagnosis, notes, created_at, locked_at

prescriptions
  id, medical_record_id (FK), notes

prescription_items
  id, prescription_id (FK), medicine_id (FK), quantity, dosage, instructions

medicines
  id, clinic_id (FK), name, unit, stock_quantity, min_stock_alert,
  purchase_price, sell_price, is_active

stock_mutations
  id, clinic_id (FK), medicine_id (FK), type (IN/OUT), quantity,
  reference_id, notes, created_at

invoices
  id, clinic_id (FK), patient_id (FK), medical_record_id (FK), total_amount,
  status, payment_method, midtrans_order_id, paid_at, created_at

invoice_items
  id, invoice_id (FK), description, quantity, unit_price, subtotal

push_subscriptions
  id, user_id (FK), clinic_id (FK), endpoint, p256dh, auth, created_at

subscription_payments  (pembayaran langganan MediKlinik, bukan pembayaran pasien)
  id, clinic_id (FK), plan, amount, midtrans_order_id, status,
  period_start, period_end, paid_at, created_at
```

> **Catatan Multi-Tenant:** Semua tabel operasional memiliki `clinic_id` sebagai foreign key. Supabase RLS (Row Level Security) dikonfigurasi agar setiap klinik hanya dapat mengakses data miliknya sendiri.

---

## 7. API Endpoints (Overview)

### Clinic Public Page
```
GET    /public/clinics/:slug               (info klinik — publik, tanpa auth)
GET    /public/clinics/:slug/doctors       (daftar dokter & jadwal — publik, tanpa auth)
POST   /public/clinics/:slug/queue         (daftar antrian — butuh auth PATIENT)
PUT    /clinics/me/public-page             (edit konten halaman publik — ADMIN only)
```

### Clinics & Subscription
```
POST   /clinics/register                  (registrasi klinik baru — dari landing page)
GET    /clinics/me                        (info klinik aktif + status subscription)
PUT    /clinics/me/settings               (update info klinik)
PUT    /clinics/me/midtrans               (update credential Midtrans klinik — ADMIN only)
GET    /clinics/me/subscription           (cek status & tanggal kadaluarsa)
POST   /subscriptions/checkout            (buat Midtrans Snap dari .env platform)
POST   /subscriptions/webhook             (webhook konfirmasi pembayaran langganan)
GET    /subscriptions/history             (riwayat pembayaran langganan)
```

### Auth
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
```

### Users & Profiles
```
GET    /users/me
PUT    /users/me/profile
GET    /users              (ADMIN only)
POST   /users              (SUPER_ADMIN only)
PATCH  /users/:id/status   (SUPER_ADMIN only)
```

### Queue
```
GET    /queues/today
POST   /queues/register
PATCH  /queues/:id/call
PATCH  /queues/:id/status
GET    /queues/realtime     (SSE / Supabase channel)
```

### Medical Records
```
GET    /medical-records/:patientId
POST   /medical-records
GET    /medical-records/:id
PATCH  /medical-records/:id  (locked after 24h)
```

### Medicines & Stock
```
GET    /medicines
POST   /medicines
PUT    /medicines/:id
DELETE /medicines/:id
POST   /medicines/:id/stock-in
GET    /medicines/low-stock
GET    /medicines/:id/mutations
```

### Invoices & Payment
```
POST   /invoices
GET    /invoices/:id
GET    /invoices?status=UNPAID
POST   /invoices/:id/pay-cash
POST   /invoices/:id/pay-online   (Midtrans Snap)
POST   /invoices/:id/pdf
POST   /payments/webhook          (Midtrans webhook — pembayaran pasien, per klinik)
```

### Reports
```
GET    /reports/visits?month=&year=
GET    /reports/revenue?month=&year=
GET    /reports/export/visits     (Excel)
GET    /reports/export/revenue    (PDF)
```

### Push Notifications (PWA)
```
POST   /push/subscribe            (simpan subscription)
DELETE /push/unsubscribe          (hapus subscription)
POST   /push/send                 (internal — dipanggil oleh sistem, bukan user)
```

---

## 8. Milestones

### Bulan 1 — Foundation
- [ ] Setup monorepo (NestJS + React Vite)
- [ ] Konfigurasi Supabase (schema multi-tenant, RLS policies per `clinic_id`)
- [ ] Tabel `clinics` + `doctor_schedules` + enkripsi credential Midtrans (AES-256 / Supabase Vault)
- [ ] Auth module: register, login, JWT, RBAC (termasuk scope per klinik)
- [ ] Modul Users & Profiles
- [ ] Modul Queue: registrasi antrian + realtime Supabase
- [ ] **Halaman publik klinik** (`/klinik/[slug]`): info klinik, daftar dokter, tombol daftar antrian
- [ ] Alur login/register pasien dengan `redirect_back` ke halaman klinik
- [ ] **Subscription guard middleware**: cek `subscription_status` di semua route dashboard
- [ ] **Landing page**: struktur & semua sections (static content) + tombol checkout subscription

### Bulan 2 — Core Features
- [ ] Modul Medical Records & Prescriptions
- [ ] Modul Medicines & Stock Management
- [ ] Alert stok menipis (in-app notification)
- [ ] Modul Invoice: generate, status, PDF
- [ ] **Integrasi Midtrans per-klinik**: load credential dari DB, buat transaksi dengan key klinik
- [ ] **Integrasi Midtrans platform** (dari `.env`): checkout subscription dari landing page
- [ ] Webhook handler: pisah antara webhook pembayaran pasien vs webhook subscription
- [ ] Halaman `/billing` di dashboard + halaman klinik non-aktif (redirect saat EXPIRED)
- [ ] **PWA**: setup `vite-plugin-pwa`, manifest, service worker, offline fallback

### Bulan 3 — Polish & Deploy
- [ ] Dashboard laporan + grafik (Shadcn Charts)
- [ ] Export Excel & PDF laporan bulanan
- [ ] **PWA Push Notification**: Web Push API + VAPID, trigger antrian & stok
- [ ] **Landing page**: polish animasi, SEO meta tags, sitemap.xml, Lighthouse audit
- [ ] UI/UX polish semua halaman
- [ ] Unit test modul kritikal (auth, invoice, stock)
- [ ] Deploy ke Railway + custom domain
- [ ] README lengkap + dokumentasi API (Swagger)

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Webhook Midtrans tidak terkirim | Medium | High | Simpan order_id, cek status manual via polling |
| Supabase Realtime putus | Low | Medium | Fallback polling setiap 5 detik |
| Data rekam medis bocor | Low | Critical | RLS Supabase ketat + enkripsi kolom sensitif |
| **Credential Midtrans klinik bocor** | Low | Critical | Enkripsi AES-256 + Supabase Vault; tidak pernah expose ke frontend |
| **Klinik tetap akses saat subscription EXPIRED** | Low | High | Guard middleware di semua route; validasi di server-side, bukan hanya frontend |
| **Webhook subscription tidak terkirim** | Medium | High | Polling status order Midtrans sebagai fallback; admin bisa konfirmasi manual |
| Scope creep melebihi 3 bulan | High | Medium | Strict MVP scope, fitur bonus masuk backlog |
| Push notification diblokir browser/OS | Medium | Low | Graceful fallback ke in-app notification |
| iOS PWA tidak support Web Push (Safari lama) | Medium | Low | Informasikan user untuk update iOS 16.4+ |
| Landing page Lighthouse score rendah | Low | Medium | Audit awal di bulan 1, perbaiki sebelum deploy |
