import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Antrian realtime yang terbaca semua pihak',
    body: 'Admin memanggil pasien lebih rapi, pasien melihat giliran tanpa menumpuk di meja depan.',
  },
  {
    title: 'Rekam medis yang tetap cepat saat klinik ramai',
    body: 'Dokter membuka riwayat, menulis diagnosa, dan menyimpan resep dalam satu alur kerja.',
  },
  {
    title: 'Stok obat bergerak bersama resep',
    body: 'Setiap item resep langsung mengurangi stok dan memunculkan alert saat batas minimum tercapai.',
  },
  {
    title: 'Invoice, billing, dan Midtrans yang terpisah per tenant',
    body: 'Pembayaran pasien memakai akun klinik, sementara langganan SaaS memakai akun platform.',
  },
];

const steps = [
  'Front office mendaftarkan pasien atau pasien mengambil antrian sendiri dari halaman klinik.',
  'Dokter memeriksa, menulis catatan medis, dan menyimpan resep dengan stok yang terjaga.',
  'Invoice langsung terbentuk, pembayaran tercatat, dan laporan bulanan siap diexport.',
];

const testimonials = [
  {
    quote: 'Sebelumnya kami bolak-balik spreadsheet. Sekarang antrian dan invoice jauh lebih tertib.',
    author: 'Klinik Pratama Sehat Ibu Anak',
  },
  {
    quote: 'Dokter tidak perlu berpindah aplikasi. Riwayat pasien dan resep sudah terasa satu alur.',
    author: 'Praktek Dokter Keluarga Bintaro',
  },
  {
    quote: 'Halaman publik klinik membantu pasien mendaftar sendiri, terutama jam sibuk pagi.',
    author: 'Klinik Umum Harapan Sentosa',
  },
];

const faqs = [
  {
    question: 'Apakah saya bisa mencoba tanpa langsung bayar?',
    answer: 'Bisa. Klinik baru langsung mendapatkan trial 14 hari untuk menguji alur operasional harian.',
  },
  {
    question: 'Apakah pembayaran pasien memakai akun Midtrans MediKlinik?',
    answer: 'Tidak. Pembayaran invoice pasien memakai credential Midtrans milik klinik aktif, terpisah dari billing platform.',
  },
  {
    question: 'Apakah pasien bisa melihat antrian dari HP?',
    answer: 'Bisa. Halaman publik klinik dan PWA dirancang agar tetap nyaman dipakai dari perangkat mobile.',
  },
];

const tiers = [
  {
    name: 'Starter',
    price: '149.000',
    note: '1 dokter, 200 pasien per bulan',
  },
  {
    name: 'Clinic',
    price: '299.000',
    note: '3 dokter, pasien tanpa batas, paket terpopuler',
    featured: true,
  },
  {
    name: 'Pro',
    price: '499.000',
    note: 'Unlimited dokter, multi-admin, prioritas support',
  },
];

const stats = [
  'Realtime queue untuk pasien dan front office',
  'Billing subscription + payment per klinik',
  'PWA siap install untuk workflow mobile',
];

export function LandingPage() {
  return (
    <div className="marketing">
      <Helmet>
        <title>MediKlinik - Manajemen Klinik Digital</title>
        <meta
          name="description"
          content="Kelola antrian, rekam medis, stok obat, billing, dan halaman publik klinik dalam satu platform digital."
        />
        <meta property="og:title" content="MediKlinik - Manajemen Klinik Digital" />
        <meta property="og:description" content="Kelola klinik lebih cepat, lebih rapi, dan lebih digital." />
        <link rel="canonical" href="https://mediklinik.id" />
      </Helmet>

      <nav className="marketing-nav">
        <a className="brand" href="/">
          Medi<span>Klinik</span>
        </a>
        <div>
          <a href="#fitur">Fitur</a>
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#harga">Harga</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="marketing-actions">
          <Link className="ghost button" to="/login">
            Login
          </Link>
          <Link className="button" to="/register">
            Mulai Gratis
          </Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Clarity. Efficiency. Trust.</p>
            <h1>Satu sistem kerja untuk alur klinik yang tidak boleh berantakan.</h1>
            <p className="lead">
              MediKlinik menyatukan antrian, rekam medis, resep, stok obat, invoice, pembayaran, dan billing tenant ke
              dalam satu workspace yang terasa tenang saat operasional sedang sibuk.
            </p>
            <div className="actions">
              <Link className="button" to="/register">
                Mulai Gratis 14 Hari
              </Link>
              <a className="ghost button" href="#cara-kerja">
                Lihat cara kerja
              </a>
            </div>
            <div className="hero-bullets">
              {stats.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="hero-card">
            <span className="live">Live operasional hari ini</span>
            <strong className="queue-no">A-023</strong>
            <p>Sedang dilayani oleh dr. Siti Rahayu</p>
            <div className="mini-grid">
              <span>18 pasien terdaftar</span>
              <span>2 stok rendah</span>
              <span>Rp 4,8 jt masuk hari ini</span>
            </div>
          </div>
        </section>

        <section className="section proof">
          <p className="eyebrow">Cocok untuk klinik yang ingin bergerak rapi</p>
          <div className="proof-grid">
            <article>
              <strong>Admin Klinik</strong>
              <p>Melihat antrian aktif, invoice belum lunas, dan alert stok dari satu dashboard.</p>
            </article>
            <article>
              <strong>Dokter</strong>
              <p>Membuka riwayat pasien dan menulis rekam medis tanpa layout yang mengganggu fokus pemeriksaan.</p>
            </article>
            <article>
              <strong>Pasien</strong>
              <p>Mendaftar dari halaman publik klinik dan memantau giliran dari perangkat mobile.</p>
            </article>
          </div>
        </section>

        <section id="fitur" className="section">
          <p className="eyebrow">Fitur utama</p>
          <h2>Lebih sedikit tab, lebih sedikit miskom, lebih banyak pekerjaan yang selesai.</h2>
          <div className="cards feature-grid">
            {features.map((feature, index) => (
              <article key={feature.title}>
                <b>0{index + 1}</b>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cara-kerja" className="section workflow">
          <p className="eyebrow">Cara kerja</p>
          <h2>Dirancang mengikuti alur klinik, bukan memaksa tim menyesuaikan diri ke software.</h2>
          <div className="workflow-list">
            {steps.map((step, index) => (
              <article key={step}>
                <span>0{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="harga" className="section pricing-section">
          <p className="eyebrow">Harga transparan</p>
          <h2>Pilih paket yang pas untuk kapasitas klinik saat ini, lalu tumbuh tanpa migrasi sistem.</h2>
          <div className="cards pricing">
            {tiers.map((tier) => (
              <article className={tier.featured ? 'featured' : ''} key={tier.name}>
                <span>{tier.featured ? 'Terpopuler' : 'Paket'}</span>
                <h3>{tier.name}</h3>
                <strong>
                  Rp {tier.price}
                  <small>/bulan</small>
                </strong>
                <p>{tier.note}</p>
                <div className="card-actions">
                  <Link className="button" to="/register">
                    Mulai Gratis 14 Hari
                  </Link>
                  <Link className="ghost button" to="/login?redirect=/app/billing">
                    Langganan Sekarang
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section testimonials">
          <p className="eyebrow">Testimoni</p>
          <h2>Klinik kecil butuh sistem yang terasa membantu, bukan menambah kerja tambahan.</h2>
          <div className="cards">
            {testimonials.map((item) => (
              <article key={item.author}>
                <p>"{item.quote}"</p>
                <strong>{item.author}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="section faq">
          <p className="eyebrow">FAQ</p>
          <h2>Pertanyaan yang paling sering muncul sebelum klinik mulai mencoba.</h2>
          <div className="faq-list">
            {faqs.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section final">
          <p className="eyebrow">Mulai sekarang</p>
          <h2>Bangun workspace klinik yang siap dipakai tim, dokter, dan pasien sejak hari pertama.</h2>
          <div className="actions center">
            <Link className="button" to="/register">
              Buka Trial 14 Hari
            </Link>
            <a className="ghost button" href="#harga">
              Bandingkan paket
            </a>
          </div>
        </section>
      </main>

      <footer className="marketing-footer">
        <div>
          <a className="brand" href="/">
            Medi<span>Klinik</span>
          </a>
          <p>Platform operasional klinik Indonesia untuk antrian, rekam medis, stok obat, dan billing tenant.</p>
        </div>
        <div>
          <a href="#fitur">Fitur</a>
          <a href="#harga">Harga</a>
          <a href="#faq">FAQ</a>
        </div>
      </footer>
    </div>
  );
}
