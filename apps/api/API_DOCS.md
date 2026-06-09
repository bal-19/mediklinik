# MediKlinik API Docs

## Endpoint dokumentasi
- `GET /docs`:
  membuka dokumentasi interaktif Scalar.
- `GET /openapi.json`:
  mengembalikan dokumen OpenAPI 3.1 untuk tooling, import Postman, atau code generation.

## Auth flow
1. `POST /auth/login`
   gunakan email dan password untuk mendapatkan `accessToken` dan `refreshToken`.
2. Gunakan `accessToken` pada header:
   `Authorization: Bearer <accessToken>`
3. Jika access token kedaluwarsa, panggil:
   `POST /auth/refresh`
4. Pada implementasi frontend penuh, refresh token dipakai untuk rotasi access token tanpa memaksa login ulang.

## Route publik vs protected
- Route publik:
  `health`, `auth`, `subscriptions/checkout`, `subscriptions/webhook`, `public/clinics/*`, `docs`, `openapi.json`
- Route protected:
  `clinics/me*`, `dashboard/*`, `queues/*`, `medical-records/*`, `medicines/*`, `invoices/*`, `reports/*`, `users/me*`

## Catatan penting
- Flow subscription MediKlinik memakai Midtrans platform.
- Flow pembayaran pasien memakai credential Midtrans milik klinik aktif.
- Credential sensitif tidak dikirim ke frontend.
