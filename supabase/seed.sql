insert into public.clinics (
  id,
  name,
  slug,
  subscription_status,
  subscription_plan,
  trial_expires_at,
  public_description,
  public_address,
  public_phone,
  public_open_hours
) values (
  '11111111-1111-1111-1111-111111111111',
  'Klinik Sehat Sentosa',
  'klinik-sehat',
  'TRIAL',
  'CLINIC',
  now() + interval '14 days',
  'Klinik keluarga dengan layanan umum dan vaksin.',
  'Jl. Sehat No. 10, Jakarta',
  '0215550101',
  '{"mon":"08:00-17:00","tue":"08:00-17:00","wed":"08:00-17:00","thu":"08:00-17:00","fri":"08:00-17:00","sat":"08:00-13:00","sun":"Tutup"}'::jsonb
)
on conflict (slug) do nothing;
