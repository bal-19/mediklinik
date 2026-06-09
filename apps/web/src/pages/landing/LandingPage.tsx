import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const features = ['Antrian realtime yang tenang', 'Rekam medis aman per tenant', 'Stok dan resep dalam satu transaksi', 'Invoice dan pembayaran Midtrans'];
const tiers = [['Starter', '149.000'], ['Clinic', '299.000'], ['Pro', '499.000']];

export function LandingPage() {
  return <div className="marketing"><Helmet><title>MediKlinik - Manajemen Klinik Digital</title><meta name="description" content="Kelola antrian, rekam medis, stok obat, dan keuangan klinik dalam satu platform." /></Helmet><nav className="marketing-nav"><a className="brand" href="/">Medi<span>Klinik</span></a><div><a href="#fitur">Fitur</a><a href="#harga">Harga</a><a href="#faq">FAQ</a></div><Link className="button" to="/register">Coba Gratis</Link></nav><main>
    <section className="hero"><div><p className="eyebrow">Klinik rapi, tim lebih lega</p><h1>Satu ruang kerja untuk seluruh perjalanan pasien.</h1><p className="lead">Antrian, konsultasi, resep, stok, dan pembayaran bergerak sebagai satu alur yang bisa dipercaya.</p><div className="actions"><Link className="button" to="/register">Mulai Gratis 14 Hari</Link><a className="ghost button" href="#fitur">Lihat cara kerja</a></div></div><div className="hero-card"><span className="live">Live hari ini</span><strong className="queue-no">A-023</strong><p>Sedang dilayani</p><div className="mini-grid"><span>18 pasien</span><span>2 stok rendah</span><span>Rp 4,8 jt</span></div></div></section>
    <section id="fitur" className="section"><p className="eyebrow">Yang bekerja bersama</p><h2>Lebih sedikit tab, lebih banyak perhatian ke pasien.</h2><div className="cards">{features.map((feature, index) => <article key={feature}><b>0{index + 1}</b><h3>{feature}</h3><p>Dirancang untuk alur klinik harian yang cepat, jelas, dan dapat diaudit.</p></article>)}</div></section>
    <section id="harga" className="section"><p className="eyebrow">Harga transparan</p><h2>Pilih kapasitas yang tumbuh bersama klinik.</h2><div className="cards pricing">{tiers.map(([name, price]) => <article className={name === 'Clinic' ? 'featured' : ''} key={name}><span>{name === 'Clinic' ? 'Terpopuler' : 'Paket'}</span><h3>{name}</h3><strong>Rp {price}<small>/bulan</small></strong><Link className="button" to="/register">Mulai Gratis</Link></article>)}</div></section>
    <section id="faq" className="section final"><h2>Siap membuat hari klinik terasa lebih ringan?</h2><Link className="button" to="/register">Bangun workspace klinik</Link></section>
  </main><footer>MediKlinik, platform operasional klinik Indonesia.</footer></div>;
}
