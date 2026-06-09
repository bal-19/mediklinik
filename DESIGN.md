# DESIGN.md — MediKlinik SaaS

> Design system, UI guidelines, dan visual language untuk MediKlinik.  
> Semua keputusan desain mengacu ke dokumen ini.

---

## 1. Design Philosophy

MediKlinik dirancang untuk staf klinik yang bekerja cepat di lingkungan yang sibuk. Antarmuka harus **fungsional pertama** — setiap elemen ada karena membantu pengguna menyelesaikan tugas, bukan karena terlihat menarik. Visual yang bersih, hierarki yang jelas, dan respons yang cepat adalah prioritas utama.

**Tiga prinsip desain:**
1. **Clarity** — Informasi medis tidak boleh ambigu. Label jelas, status eksplisit.
2. **Efficiency** — Staf klinik butuh akses cepat. Minimal klik, navigasi intuitif.
3. **Trust** — Tampilan profesional membangun kepercayaan dokter dan pasien.

---

## 2. Color Palette

### Primary Palette
```css
--color-primary:        #0EA5E9;  /* Sky Blue — aksi utama, link, highlight */
--color-primary-dark:   #0284C7;  /* Hover state untuk primary */
--color-primary-light:  #E0F2FE;  /* Background badge, subtle highlight */
```

### Neutral Palette
```css
--color-bg:             #F8FAFC;  /* Background halaman */
--color-surface:        #FFFFFF;  /* Card, modal, sidebar */
--color-border:         #E2E8F0;  /* Garis pemisah, border input */
--color-text-primary:   #0F172A;  /* Judul, teks penting */
--color-text-secondary: #64748B;  /* Label, caption, placeholder */
--color-text-muted:     #94A3B8;  /* Teks tidak aktif, disabled */
```

### Semantic Colors
```css
--color-success:        #10B981;  /* Status lunas, stok aman */
--color-success-light:  #D1FAE5;
--color-warning:        #F59E0B;  /* Stok menipis, antrian hampir dipanggil */
--color-warning-light:  #FEF3C7;
--color-danger:         #EF4444;  /* Stok habis, pembayaran gagal, error */
--color-danger-light:   #FEE2E2;
--color-info:           #6366F1;  /* Informasi netral, badge pasien baru */
--color-info-light:     #EEF2FF;
```

### Shadcn CSS Variables Mapping
```css
:root {
  --background: 248 250 252;       /* #F8FAFC */
  --foreground: 15 23 42;          /* #0F172A */
  --primary: 14 165 233;           /* #0EA5E9 */
  --primary-foreground: 255 255 255;
  --muted: 241 245 249;
  --muted-foreground: 100 116 139;
  --border: 226 232 240;
  --ring: 14 165 233;
  --radius: 0.5rem;
}
```

---

## 3. Typography

### Font Stack
```css
/* Display / Heading */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Body / UI */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (kode, ID, nomor antrian) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

> Load Inter dari Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`

### Type Scale
| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-xs` | 12px | 400 | 1.5 | Caption, helper text |
| `text-sm` | 14px | 400/500 | 1.5 | Body teks, label form |
| `text-base` | 16px | 400 | 1.6 | Konten utama |
| `text-lg` | 18px | 500/600 | 1.4 | Sub-heading, card title |
| `text-xl` | 20px | 600 | 1.3 | Page section title |
| `text-2xl` | 24px | 700 | 1.2 | Page title |
| `text-3xl` | 30px | 700 | 1.1 | Nomor antrian, stat besar |

---

## 4. Spacing & Layout

### Spacing Scale (Tailwind default)
Gunakan kelipatan 4px (Tailwind spacing scale):
- `4px` (p-1) — internal padding elemen kecil (badge, chip)
- `8px` (p-2) — padding elemen compact
- `12px` (p-3) — padding standar input/button
- `16px` (p-4) — padding card internal
- `24px` (p-6) — jarak antar section dalam card
- `32px` (p-8) — padding page container
- `48px` (p-12) — jarak antar section besar

### Page Layout
```
┌─────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area     │
│  ─────────────────────  │  ────────────────────  │
│  Logo                   │  Topbar (64px)         │
│  ─────────────────────  │  ────────────────────  │
│  Navigation Menu        │  Page Header           │
│  (grouped by role)      │  (title + actions)     │
│                         │  ────────────────────  │
│                         │  Content               │
│                         │  (max-width: 1280px,   │
│                         │   padding: 24px)       │
│                         │                        │
└─────────────────────────────────────────────────┘
```

### Grid System
- Gunakan CSS Grid / Tailwind grid utilities
- Kolom content: `grid-cols-1` (mobile) → `grid-cols-2` (md) → `grid-cols-3/4` (lg)
- Card grid default: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

---

## 5. Component Guidelines

### 5.1 Sidebar Navigation

```
Logo + Nama Klinik
─────────────────
[Icon] Dashboard
[Icon] Antrian

PASIEN
[Icon] Daftar Pasien
[Icon] Rekam Medis

APOTEK
[Icon] Stok Obat
[Icon] Mutasi Stok

KEUANGAN
[Icon] Invoice
[Icon] Pembayaran

LAPORAN
[Icon] Statistik
[Icon] Export

KLINIK
[Icon] Pengaturan Klinik
[Icon] Integrasi Midtrans
[Icon] Langganan & Billing

─────────────────
[Avatar] Nama User
         Role Badge
```

- Sidebar background: `--color-surface` (#FFFFFF) dengan border-right
- Active item: background `--color-primary-light`, teks `--color-primary`, bold
- Group label: `text-xs uppercase tracking-wider text-muted-foreground`
- Icon: Lucide React, size 16px

### 5.2 Topbar
- Height: 64px, sticky
- Background: white, border-bottom
- Kiri: Breadcrumb navigasi halaman saat ini
- Kanan: Bell notifikasi (badge count) + Avatar dropdown

### 5.3 Page Header Pattern
```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold text-foreground">Stok Obat</h1>
    <p className="text-sm text-muted-foreground">
      Kelola persediaan obat klinik
    </p>
  </div>
  <Button>
    <Plus className="mr-2 h-4 w-4" />
    Tambah Obat
  </Button>
</div>
```

### 5.4 Status Badges
Gunakan Shadcn `Badge` dengan variant custom:

| Status | Style | Contoh Penggunaan |
|---|---|---|
| `WAITING` | `bg-warning-light text-warning` | Antrian menunggu |
| `IN_PROGRESS` | `bg-info-light text-info` | Sedang diperiksa |
| `DONE` | `bg-success-light text-success` | Selesai |
| `SKIP` | `bg-muted text-muted-foreground` | Dilewati |
| `PAID` | `bg-success-light text-success` | Lunas |
| `UNPAID` | `bg-danger-light text-danger` | Belum bayar |
| `LOW_STOCK` | `bg-warning-light text-warning` | Stok menipis |
| `OUT_OF_STOCK` | `bg-danger-light text-danger` | Stok habis |
| `TRIAL` | `bg-info-light text-info` | Masa trial aktif |
| `ACTIVE` | `bg-success-light text-success` | Berlangganan aktif |
| `EXPIRED` | `bg-danger-light text-danger` | Langganan habis |
| `SUSPENDED` | `bg-muted text-muted-foreground` | Akun ditangguhkan |

### 5.5 Data Tables
Gunakan Shadcn `Table` dengan fitur:
- Header kolom sticky (untuk tabel panjang)
- Empty state dengan ilustrasi + call-to-action
- Loading state dengan skeleton rows (3-5 rows)
- Pagination bottom: "Menampilkan X-Y dari Z data"
- Action kolom terakhir: icon buttons (Edit, Delete, View)

```tsx
// Empty state pattern
<TableRow>
  <TableCell colSpan={columns.length} className="h-48 text-center">
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <Icon className="h-8 w-8" />
      <p className="text-sm">Belum ada data obat</p>
      <Button variant="outline" size="sm">Tambah Obat Pertama</Button>
    </div>
  </TableCell>
</TableRow>
```

### 5.6 Forms
- Gunakan Shadcn `Form` + React Hook Form
- Label selalu di atas input (bukan floating)
- Helper text di bawah input dengan `text-xs text-muted-foreground`
- Error message: `text-xs text-destructive` tepat di bawah input
- Required field ditandai dengan `*` merah setelah label
- Submit button: full-width di mobile, auto-width di desktop

### 5.7 Nomor Antrian Display
Ini adalah elemen signature — tampilkan besar dan prominent:

```tsx
// Di halaman antrian publik / display klinik
<div className="flex flex-col items-center justify-center gap-4 p-12 
                rounded-2xl bg-primary text-white">
  <p className="text-sm font-medium uppercase tracking-widest opacity-80">
    Sedang Dilayani
  </p>
  <span className="font-mono text-8xl font-bold tracking-tight">
    A-007
  </span>
  <p className="text-sm opacity-70">Dr. Siti Rahayu</p>
</div>
```

### 5.8 Alert Stok Menipis
```tsx
// Di halaman stok / notifikasi sidebar
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Stok Menipis</AlertTitle>
  <AlertDescription>
    Amoxicillin 500mg tersisa 8 unit (batas minimum: 10).
    <Button variant="link" className="p-0 h-auto ml-1">
      Lihat detail →
    </Button>
  </AlertDescription>
</Alert>
```

---

## 6. Charts (Shadcn Charts / Recharts)

### Warna Chart
```typescript
const CHART_COLORS = {
  primary:   '#0EA5E9',  // Kunjungan
  secondary: '#10B981',  // Pendapatan
  tertiary:  '#6366F1',  // Pasien baru
  muted:     '#E2E8F0',  // Grid lines
};
```

### Grafik Kunjungan Bulanan
- Tipe: `BarChart` dari Shadcn Charts
- X-axis: nama bulan (Jan, Feb, ... Des)
- Y-axis: jumlah kunjungan
- Tooltip: "Januari: 124 kunjungan"
- Bar color: `--color-primary`

### Grafik Pendapatan Bulanan
- Tipe: `LineChart` dari Shadcn Charts
- X-axis: nama bulan
- Y-axis: nominal dalam Rupiah (format: "Rp 2,5 jt")
- Line color: `--color-success`
- Area fill: `--color-success-light` (opacity 30%)

### Stat Cards (Dashboard)
```
┌──────────────────────┐  ┌──────────────────────┐
│ 📅 Kunjungan Hari Ini│  │ 💰 Pendapatan Bulan  │
│                      │  │                      │
│  47                  │  │  Rp 12.450.000       │
│  ↑ 12% dari kemarin  │  │  ↑ 8% dari bulan lalu│
└──────────────────────┘  └──────────────────────┘
```
- Card background: white
- Angka utama: `text-3xl font-bold`
- Trend positif: teks hijau + icon ↑
- Trend negatif: teks merah + icon ↓

---

## 7. Role-Based UI

### Admin View
- Akses penuh ke semua menu kecuali menulis rekam medis
- Dashboard menampilkan: stat harian, antrian aktif, alert stok
- Fokus: operasional harian yang cepat

### Doctor View  
- Sidebar lebih ringkas: hanya Antrian Saya, Rekam Medis, Profil
- Halaman utama: daftar pasien yang sudah dipanggil hari ini
- Form rekam medis: full-screen, distraction-free
- Tidak ada akses ke laporan keuangan

### Patient View
- Layout berbeda: lebih sederhana, tidak ada sidebar kompleks
- Halaman utama: status antrian saya (realtime) + riwayat kunjungan
- Warna lebih hangat, bahasa lebih ramah
- Mobile-first (pasien kemungkinan akses via HP)

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Target Device |
|---|---|---|
| `sm` | 640px+ | Tablet potrait |
| `md` | 768px+ | Tablet landscape |
| `lg` | 1024px+ | Laptop |
| `xl` | 1280px+ | Desktop |

### Mobile Adaptations
- Sidebar berubah menjadi bottom navigation (4 item utama) di `< md`
- Table berubah menjadi card list di `< md`
- Modal menjadi bottom sheet di `< sm`
- Nomor antrian display tetap besar (font-size: clamp(3rem, 10vw, 6rem))

---

## 9. Icons

Gunakan **Lucide React** secara konsisten:
```tsx
import { 
  Users, UserPlus, Stethoscope,    // Pasien & dokter
  ClipboardList, FileText,          // Rekam medis & invoice
  Package, AlertTriangle,           // Stok obat
  BarChart2, TrendingUp,            // Laporan
  Bell, Settings, LogOut,           // Sistem
  ChevronRight, Search, Filter,     // Navigasi & aksi
  CreditCard, Lock, XCircle,        // Subscription & billing
  ShieldCheck, KeyRound             // Midtrans & keamanan
} from 'lucide-react';
```

- Size standar dalam navigasi: 16px (`h-4 w-4`)
- Size standar dalam button: 16px, dengan `mr-2`
- Size di empty state: 32px (`h-8 w-8`)
- Size di stat card: 24px (`h-6 w-6`)

---

## 10. Animation & Transitions

Gunakan dengan hemat:

```css
/* Transisi standar — untuk hover, fokus */
transition: all 150ms ease-in-out;

/* Transisi sidebar collapse */
transition: width 200ms ease-in-out;

/* Fade in konten setelah load */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 200ms ease-out; }
```

Gunakan animasi hanya untuk:
- Page/section masuk ke viewport
- Modal/dialog open/close (Shadcn sudah handle ini)
- Nomor antrian berubah (subtle pulse)
- Toast notifications

Jangan animasi: tabel scroll, form input, aksi yang butuh respons cepat.

---

## 11. Copy & Microcopy Guidelines

- Gunakan bahasa Indonesia formal tapi tidak kaku
- Tombol aksi: kata kerja aktif — "Simpan Data", "Tambah Obat", "Cetak Invoice"
- Konfirmasi hapus: "Hapus obat ini? Tindakan ini tidak dapat dibatalkan."
- Empty state: ajak aksi — "Belum ada pasien hari ini. Daftarkan pasien baru."
- Error: spesifik — "Stok tidak cukup. Tersedia: 3 unit, diminta: 5 unit."
- Loading: "Memuat data antrian..." (bukan "Loading...")
- Success toast: "Data obat berhasil disimpan."
- Status pasien selalu dalam title case: "Sedang Diperiksa", bukan "sedang diperiksa"

---

## 12. Accessibility

- Semua interactive element dapat diakses via keyboard
- Focus ring: gunakan Tailwind `focus-visible:ring-2 focus-visible:ring-primary`
- Kontras warna minimum WCAG AA (4.5:1 untuk body text)
- Semua ikon yang bermakna dilengkapi `aria-label`
- Form error dihubungkan ke input dengan `aria-describedby`
- Tabel data memiliki `<caption>` atau `aria-label` yang deskriptif
- Modal memiliki focus trap saat terbuka

---

## 13. Landing Page Design

### Visual Direction
Landing page menggunakan tone yang berbeda dari app — lebih ekspresif, lebih persuasif. Tetap menggunakan design token yang sama, tapi dengan komposisi yang lebih bebas.

### Layout Sections

```
┌─────────────────────────────────────────┐
│  NAVBAR  Logo | Fitur Harga FAQ | [CTA] │  sticky, backdrop-blur
├─────────────────────────────────────────┤
│                                         │
│  HERO    Headline besar (2 baris max)   │  bg: gradient primary-light → white
│          Subheadline 1 kalimat          │
│          [Mulai Gratis] [Lihat Demo]    │
│          Mockup screenshot app          │
│                                         │
├─────────────────────────────────────────┤
│  SOCIAL PROOF  Logo / nama klinik mitra │  strip tipis, grayscale logos
├─────────────────────────────────────────┤
│  FITUR   3-col grid icon + judul + desc │  bg: white
│          (Antrian, Rekam Medis, Stok,   │
│           Invoice, Laporan, PWA)        │
├─────────────────────────────────────────┤
│  CARA KERJA  3 langkah bernomor         │  bg: #F8FAFC
│  1. Daftar  2. Setup  3. Kelola         │
├─────────────────────────────────────────┤
│  PRICING  3 card tier                   │  bg: white
│           Starter | Clinic* | Pro       │  *Clinic = highlighted/popular
├─────────────────────────────────────────┤
│  TESTIMONI  2-3 quote card              │  bg: primary-light
├─────────────────────────────────────────┤
│  FAQ  Accordion list                    │  bg: white
├─────────────────────────────────────────┤
│  CTA FINAL  Headline + tombol besar     │  bg: primary (biru solid)
├─────────────────────────────────────────┤
│  FOOTER  Links + copyright              │  bg: slate-900, teks white
└─────────────────────────────────────────┘
```

### Hero Section
- Headline: `text-5xl font-bold`, max 2 baris, contoh: *"Klinik Lebih Rapi, Pasien Lebih Puas"*
- Subheadline: `text-xl text-muted-foreground`, 1 kalimat benefit utama
- CTA primer: `<Button size="lg">` — solid primary blue
- CTA sekunder: `<Button size="lg" variant="outline">` — border abu
- Hero image: screenshot dashboard app (mockup browser frame), shadow besar, sedikit miring (-2deg rotate)
- Background: subtle gradient `from-primary-light/40 to-white`, tidak solid

### Pricing Cards
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Starter         │  │  ✦ Clinic        │  │  Pro             │
│  Rp 149K/bln     │  │  Rp 299K/bln     │  │  Rp 499K/bln     │
│                  │  │  (Most Popular)  │  │                  │
│  ✓ 1 Dokter      │  │  ✓ 3 Dokter      │  │  ✓ Unlimited     │
│  ✓ 200 pasien    │  │  ✓ Unlimited     │  │  ✓ Multi-admin   │
│  ✓ Semua fitur   │  │  ✓ Semua fitur   │  │  ✓ Priority      │
│                  │  │  ✓ Export        │  │  ✓ Onboarding    │
│  [Coba Gratis]   │  │  [Coba Gratis]   │  │  [Hubungi Kami]  │
│  [Beli Sekarang] │  │  [Beli Sekarang] │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```
- "Coba Gratis" → `/register?plan=starter` (trial 14 hari, tidak perlu bayar)
- "Beli Sekarang" → trigger Midtrans Snap (Platform `.env`); aktifkan tanpa trial
- Card "Clinic" diberi `ring-2 ring-primary` + badge "Terpopuler"
- Semua card sama tinggi (align-items: stretch)

### Navbar Landing
- Background: `transparent` saat di atas → `bg-white/80 backdrop-blur-md border-b` saat scroll
- Deteksi scroll dengan `useEffect` + `window.scrollY > 20`
- Mobile: hamburger menu → slide-down drawer

---

## 14. Subscription & Billing UI

### Subscription Status Banner (Dashboard)
Tampilkan di bagian atas dashboard jika status bukan `ACTIVE`:

```tsx
{/* Trial — info */}
{status === 'TRIAL' && daysLeft <= 7 && (
  <div className="bg-warning-light border border-warning text-warning 
                  rounded-lg px-4 py-3 flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm font-medium">
        Masa trial Anda berakhir dalam {daysLeft} hari.
      </span>
    </div>
    <Button size="sm" variant="outline">Langganan Sekarang</Button>
  </div>
)}

{/* Expired — blocking */}
{status === 'EXPIRED' && (
  <div className="bg-danger-light border border-danger text-danger 
                  rounded-lg px-4 py-3 flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <XCircle className="h-4 w-4" />
      <span className="text-sm font-medium">
        Langganan Anda telah berakhir. Perpanjang untuk melanjutkan.
      </span>
    </div>
    <Button size="sm" className="bg-danger text-white hover:bg-danger/90">
      Perpanjang Sekarang
    </Button>
  </div>
)}
```

### Halaman Billing (`/dashboard/billing`)
```
┌─────────────────────────────────────────────────┐
│  Status Langganan                               │
│  ─────────────────────────────────────────────  │
│  Paket: Clinic  |  Status: TRIAL                │
│  Berakhir: 23 Juni 2026  (7 hari lagi)          │
│                                                 │
│  [Perpanjang — Rp 299.000]  [Upgrade ke Pro]    │
├─────────────────────────────────────────────────┤
│  Riwayat Pembayaran                             │
│  ─────────────────────────────────────────────  │
│  Tgl          Paket     Nominal    Status        │
│  01 Mei 2026  Clinic    299.000    ✓ Lunas       │
└─────────────────────────────────────────────────┘
```

### Halaman Setup Midtrans Klinik (`/dashboard/settings/midtrans`)
```
┌─────────────────────────────────────────────────┐
│  Integrasi Midtrans                             │
│  ─────────────────────────────────────────────  │
│  Server Key   [••••••••••••••] [Ubah]           │
│  Client Key   [••••••••••••••] [Ubah]           │
│  Merchant ID  [M12345]         [Ubah]           │
│  Environment  ○ Sandbox  ● Production           │
│                                                 │
│  ⚠ Credential disimpan terenkripsi.             │
│    Pastikan akun Midtrans Anda sudah aktif.     │
│                                                 │
│  [Simpan Perubahan]    [Test Koneksi]           │
└─────────────────────────────────────────────────┘
```
- Field credential selalu ditampilkan masked (`••••••••`)
- Tombol "Test Koneksi" → hit endpoint backend untuk validasi key
- Tersedia hanya untuk role `ADMIN` dan `SUPER_ADMIN` klinik

### Blocked Access Page (Subscription Expired)
Halaman yang ditampilkan saat klinik mencoba akses dashboard dengan status `EXPIRED`:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│           🔒                                    │
│   Akses Terbatas                                │
│                                                 │
│   Masa langganan klinik Anda telah berakhir.    │
│   Perpanjang langganan untuk kembali            │
│   menggunakan MediKlinik.                       │
│                                                 │
│         [Perpanjang Langganan]                  │
│         [Hubungi Support]                       │
│                                                 │
└─────────────────────────────────────────────────┘
```
- Background: `--color-bg` (#F8FAFC), bukan blank putih
- Icon kunci: Lucide `Lock`, size 48px, warna `--color-text-muted`
- Tombol utama: solid primary blue
- Tidak menampilkan sidebar (agar tidak ada temptation klik menu lain)

---

## 15. PWA UI Guidelines

### Install Prompt Banner
Tampilkan setelah user login pertama kali dan belum install:
```
┌────────────────────────────────────────────────┐
│ 📱 Pasang MediKlinik di homescreen Anda        │
│    Akses lebih cepat, bisa dipakai offline     │
│                    [Pasang Sekarang]  [Nanti]  │
└────────────────────────────────────────────────┘
```
- Posisi: bottom sheet di mobile, top banner di desktop
- Simpan penolakan di `localStorage` — jangan tampilkan lagi 7 hari
- Gunakan `BeforeInstallPromptEvent` untuk trigger native install dialog

### Offline Banner
```tsx
{!isOnline && (
  <div className="fixed top-0 inset-x-0 z-50 bg-warning text-white 
                  text-sm text-center py-2 px-4">
    <WifiOff className="inline h-4 w-4 mr-1" />
    Anda sedang offline. Data yang ditampilkan mungkin belum terbaru.
  </div>
)}
```

### Push Notification Permission
- Jangan minta permission saat halaman pertama load
- Tampilkan tombol "Aktifkan Notifikasi" di halaman Settings / Profile
- Jika user tolak: sembunyikan tombol, jangan tanya lagi
- Copy tombol: "Aktifkan Notifikasi Antrian"

### Splash Screen
- Otomatis dari `manifest.json` + meta tags
- Tambahkan di `index.html`:
```html
<meta name="theme-color" content="#0EA5E9" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="MediKlinik" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```


---

## 16. Halaman Publik Klinik (`/klinik/[slug]`)

### Tujuan & Tone
Halaman ini adalah wajah publik klinik — diakses pasien, bukan staf. Tone lebih hangat dari dashboard, tapi tetap bersih dan profesional. Mobile-first karena mayoritas pasien akses via HP.

### Layout Sections

```
┌─────────────────────────────────────────┐
│  NAVBAR  Logo MediKlinik          [Login]│  sticky, ringan
├─────────────────────────────────────────┤
│                                         │
│  HERO KLINIK                            │
│  Nama Klinik (text-3xl bold)            │
│  Deskripsi singkat (text-base muted)    │
│  📍 Alamat  |  📞 Telepon              │
│  Jam Buka: Sen-Jum 08.00–17.00          │
│                                         │
│  [Daftar Antrian Sekarang]  ← CTA utama │
│                                         │
├─────────────────────────────────────────┤
│  DOKTER & JADWAL                        │
│  Card grid dokter (nama, spesialisasi,  │
│  jadwal praktik per hari)               │
├─────────────────────────────────────────┤
│  FOOTER  Powered by MediKlinik          │
└─────────────────────────────────────────┘
```

### Navbar Publik Klinik
- Kiri: Logo MediKlinik kecil (link ke `mediklinik.id`)
- Kanan: tombol `[Masuk]` → `/klinik/[slug]/login`
- Jika sudah login sebagai pasien: ganti tombol dengan avatar + nama + `[Antrian Saya]`
- Background: `bg-white border-b` — tidak transparan seperti landing page platform

### Hero Section Klinik
```tsx
<section className="bg-gradient-to-b from-primary-light/30 to-white py-12 px-4">
  <h1 className="text-3xl font-bold text-foreground">{clinic.name}</h1>
  <p className="text-base text-muted-foreground mt-2">{clinic.description}</p>
  <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
    <span><MapPin className="inline h-4 w-4 mr-1" />{clinic.address}</span>
    <span><Phone className="inline h-4 w-4 mr-1" />{clinic.phone}</span>
    <span><Clock className="inline h-4 w-4 mr-1" />{formatOpenHours(clinic.open_hours)}</span>
  </div>
  <Button size="lg" className="mt-6 w-full sm:w-auto">
    Daftar Antrian Sekarang
  </Button>
</section>
```

### Doctor Cards
```
┌────────────────────────┐  ┌────────────────────────┐
│  👤                    │  │  👤                    │
│  dr. Andi Pratama      │  │  dr. Siti Rahayu       │
│  Dokter Umum           │  │  Dokter Anak           │
│  ─────────────────     │  │  ─────────────────     │
│  Sen  08.00–12.00      │  │  Sel  13.00–17.00      │
│  Rab  08.00–12.00      │  │  Kam  13.00–17.00      │
│  Jum  08.00–12.00      │  │  Sab  08.00–12.00      │
└────────────────────────┘  └────────────────────────┘
```
- Grid: `grid-cols-1 sm:grid-cols-2 gap-4`
- Card background: `--color-surface` dengan `border rounded-xl p-5`
- Nama dokter: `text-lg font-semibold`
- Spesialisasi: `text-sm text-muted-foreground`
- Jadwal: tabel kecil 2 kolom (hari | jam), `text-sm`
- Hari tanpa jadwal: tidak ditampilkan (bukan "Libur")

### Alur Daftar Antrian (CTA Flow)
```
Pasien klik "Daftar Antrian Sekarang"
        │
        ▼
  Sudah login?
  ┌─── Ya ───────────────────────────────────────┐
  │   Modal konfirmasi: "Daftar antrian hari ini  │
  │   di [Nama Klinik]?"  [Ya, Daftar] [Batal]   │
  │   → Ambil nomor antrian → tampil nomor        │
  └───────────────────────────────────────────────┘
        │
        Belum login
        ▼
  /klinik/[slug]/login
  Tab: [Masuk] [Daftar Baru]
  Setelah berhasil → redirect ke /klinik/[slug]?action=queue
  → otomatis buka modal konfirmasi antrian
```

### Halaman Login/Register Pasien dalam Konteks Klinik
`/klinik/[slug]/login` — layout berbeda dari login dashboard:
- Tidak ada sidebar
- Header: logo + nama klinik (bukan hanya logo MediKlinik)
- Dua tab: **Masuk** | **Daftar Baru**
- Form ringkas (email + password untuk masuk; nama + email + password + telepon untuk daftar)
- Setelah submit → redirect kembali ke halaman klinik dengan `?action=queue`

### Halaman Klinik Nonaktif (EXPIRED/SUSPENDED)
```
┌─────────────────────────────────────────┐
│                                         │
│   🏥                                    │
│   Klinik Ini Sedang Tidak Tersedia      │
│                                         │
│   Halaman klinik ini tidak dapat        │
│   diakses saat ini.                     │
│                                         │
│   [← Kembali ke MediKlinik]             │
│                                         │
└─────────────────────────────────────────┘
```
- Tidak mengekspos alasan spesifik (expired/suspended) ke publik
- Ikon: Lucide `Hospital`, size 48px, warna `--color-text-muted`
- Tombol kembali ke `mediklinik.id`

### Tambahan Icons untuk Halaman Publik Klinik
```tsx
import {
  MapPin, Phone, Clock,   // Info klinik
  Hospital,               // Halaman nonaktif
  CalendarDays,           // Jadwal dokter
  UserCheck               // Konfirmasi daftar antrian
} from 'lucide-react';
```

### Responsiveness
- Hero CTA button: `w-full` di mobile, `w-auto` di `sm+`
- Doctor cards: 1 kolom di mobile, 2 kolom di `sm+`
- Jam buka: tampil vertikal di mobile, horizontal di `md+`
- Modal konfirmasi antrian: bottom sheet di mobile (`< sm`), dialog center di `sm+`
Halaman simpel — tidak butuh React, pure HTML:
```html
<!-- Pesan jelas, tombol retry, ikon wifi-off -->
<h1>Tidak Ada Koneksi</h1>
<p>Periksa koneksi internet Anda, lalu coba lagi.</p>
<button onclick="window.location.reload()">Coba Lagi</button>
```
Gunakan inline CSS dengan warna brand (`#0EA5E9`), tidak perlu Tailwind.
