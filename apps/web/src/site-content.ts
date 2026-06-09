export const featureItems = [
  {
    kicker: 'Realtime Queue',
    title: 'Antrian pasien transparan dari front desk sampai ruang periksa.',
    description:
      'Pasien bisa memantau posisi antrian, sementara admin memanggil antrean berikutnya tanpa duplikasi proses.',
  },
  {
    kicker: 'Medical Records',
    title: 'Rekam medis digital yang mudah ditelusuri dokter.',
    description:
      'Catatan kunjungan, diagnosa, dan resep tersusun per pasien sehingga riwayat klinis lebih cepat dibaca.',
  },
  {
    kicker: 'Stock Control',
    title: 'Stok obat otomatis terpotong ketika resep disimpan.',
    description:
      'Setiap mutasi tercatat sehingga admin tahu kapan stok menipis dan bisa restock sebelum pelayanan terganggu.',
  },
  {
    kicker: 'Billing',
    title: 'Invoice klinik dan pembayaran subscription dipisah dengan rapi.',
    description:
      'Platform Midtrans dipakai untuk langganan MediKlinik, sementara pembayaran pasien tetap memakai akun Midtrans milik klinik.',
  },
  {
    kicker: 'Public Page',
    title: 'Halaman publik klinik yang ramah SEO dan mobile-first.',
    description:
      'Pasien menemukan info klinik, jadwal dokter, dan langsung masuk ke alur daftar antrian dari satu halaman publik.',
  },
  {
    kicker: 'PWA Ready',
    title: 'Fondasi siap untuk instalasi homescreen dan notifikasi.',
    description:
      'Struktur app disiapkan agar mudah ditingkatkan ke mode offline, push notification, dan pengalaman mobile yang lebih kuat.',
  },
];

export const pricingPlans = [
  {
    name: 'Starter',
    price: 149000,
    description: 'Cocok untuk praktik mandiri dengan satu dokter dan volume pasien ringan.',
    ctaLabel: 'Mulai Gratis',
    highlight: false,
  },
  {
    name: 'Clinic',
    price: 299000,
    description: 'Pilihan terbaik untuk klinik umum yang ingin mengelola antrian, resep, dan billing secara terpusat.',
    ctaLabel: 'Mulai Gratis 14 Hari',
    highlight: true,
  },
  {
    name: 'Pro',
    price: 499000,
    description: 'Untuk operasional yang lebih kompleks dengan multi-admin, banyak dokter, dan support prioritas.',
    ctaLabel: 'Langganan Sekarang',
    highlight: false,
  },
];

export const testimonials = [
  {
    quote: 'Tim admin kami sekarang jauh lebih tenang saat jam sibuk karena nomor antrian dan invoice tidak lagi dikelola manual.',
    author: 'Nadia, Admin Klinik',
  },
  {
    quote: 'Dokter bisa melihat riwayat pasien dengan cepat, jadi waktu konsultasi terasa lebih fokus.',
    author: 'dr. Fikri, Dokter Umum',
  },
  {
    quote: 'Halaman publik klinik membantu pasien baru memahami jadwal dokter tanpa harus chat satu per satu.',
    author: 'Maya, Pemilik Klinik',
  },
];

export const faqItems = [
  {
    question: 'Apakah klinik baru langsung aktif setelah daftar?',
    answer: 'Ya. Klinik baru masuk status TRIAL selama 14 hari dan langsung bisa mengakses dashboard serta mengatur halaman publik.',
  },
  {
    question: 'Apakah pembayaran pasien dan subscription memakai akun Midtrans yang sama?',
    answer: 'Tidak. Subscription MediKlinik memakai akun platform, sedangkan pembayaran pasien menggunakan credential Midtrans milik klinik.',
  },
  {
    question: 'Apakah halaman publik klinik tetap bisa dibuka saat subscription habis?',
    answer: 'Tidak. Jika status klinik EXPIRED atau SUSPENDED, halaman publik menampilkan state nonaktif yang informatif.',
  },
];

export const dashboardNavigationByRole = {
  ADMIN: {
    Operasional: [
      { label: 'Dashboard', href: '/app/dashboard', active: true },
      { label: 'Antrian', href: '/app/queues', active: false },
      { label: 'Pasien', href: '/app/patients', active: false },
    ],
    Apotek: [
      { label: 'Stok Obat', href: '/app/medicines', active: false },
      { label: 'Mutasi Stok', href: '/app/stock-mutations', active: false },
    ],
    Keuangan: [
      { label: 'Invoice', href: '/app/invoices', active: false },
      { label: 'Billing', href: '/app/billing', active: false },
    ],
  },
} as const;
