# MediKlinik Test Seed

Jalankan:

```bash
bunx supabase db push --include-seed
```

Semua akun memakai password:

```text
Password123!
```

## Akun

| Role | Email | Tenant | Skenario |
|---|---|---|---|
| Super Admin | `superadmin@mediklinik.id` | Global | Administrasi platform |
| Admin | `admin@klinik-sehat.test` | `klinik-sehat` | Klinik aktif |
| Doctor | `doctor@klinik-sehat.test` | `klinik-sehat` | Rekam medis dan resep |
| Patient | `patient1@klinik-sehat.test` | `klinik-sehat` | Invoice belum dibayar |
| Patient | `patient2@klinik-sehat.test` | `klinik-sehat` | Invoice telah dibayar |
| Patient | `patient3@klinik-sehat.test` | `klinik-sehat` | Antrian menunggu |
| Admin | `admin@klinik-expired.test` | `klinik-expired` | Billing gate expired |

## Dataset

- Klinik aktif dengan dokter, jadwal praktik, tiga pasien, dan antrian hari ini.
- Rekam medis baru yang masih dapat diedit dan rekam medis lama yang terkunci.
- Resep beserta prescription items dan mutasi stok.
- Obat normal dan obat di bawah batas minimum.
- Invoice `UNPAID` dan `PAID`.
- Riwayat pembayaran subscription aktif dan expired.

> Auth API membaca akun dan password hash bcrypt-compatible langsung dari tabel `users`.
