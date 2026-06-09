-- MediKlinik end-to-end test dataset.
-- Semua akun test menggunakan password: Password123!

begin;

insert into public.clinics (
  id, name, slug, subscription_status, subscription_plan, trial_expires_at,
  subscription_expires_at, public_description, public_address, public_phone,
  public_open_hours, is_public_page_visible
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Klinik Sehat Sentosa',
    'klinik-sehat',
    'ACTIVE',
    'CLINIC',
    null,
    now() + interval '30 days',
    'Klinik keluarga dengan layanan dokter umum, vaksin, dan pemeriksaan harian.',
    'Jl. Sehat No. 10, Jakarta',
    '0215550101',
    '{"mon":"08:00-17:00","tue":"08:00-17:00","wed":"08:00-17:00","thu":"08:00-17:00","fri":"08:00-17:00","sat":"08:00-13:00","sun":"Tutup"}'::jsonb,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Klinik Masa Berlalu',
    'klinik-expired',
    'EXPIRED',
    'STARTER',
    null,
    now() - interval '7 days',
    'Tenant pengujian untuk billing gate dan halaman klinik nonaktif.',
    'Jl. Uji Billing No. 2, Bandung',
    '0225550202',
    '{"mon":"09:00-16:00","tue":"09:00-16:00","wed":"09:00-16:00","thu":"09:00-16:00","fri":"09:00-16:00"}'::jsonb,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  subscription_status = excluded.subscription_status,
  subscription_plan = excluded.subscription_plan,
  trial_expires_at = excluded.trial_expires_at,
  subscription_expires_at = excluded.subscription_expires_at,
  public_description = excluded.public_description,
  public_address = excluded.public_address,
  public_phone = excluded.public_phone,
  public_open_hours = excluded.public_open_hours,
  is_public_page_visible = excluded.is_public_page_visible;

insert into public.users (id, clinic_id, email, password_hash, role, is_active) values
  ('aaaaaaaa-0000-0000-0000-000000000001', null, 'superadmin@mediklinik.id', crypt('Password123!', gen_salt('bf')), 'SUPER_ADMIN', true),
  ('aaaaaaaa-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'admin@klinik-sehat.test', crypt('Password123!', gen_salt('bf')), 'ADMIN', true),
  ('aaaaaaaa-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'doctor@klinik-sehat.test', crypt('Password123!', gen_salt('bf')), 'DOCTOR', true),
  ('aaaaaaaa-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'patient1@klinik-sehat.test', crypt('Password123!', gen_salt('bf')), 'PATIENT', true),
  ('aaaaaaaa-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111111', 'patient2@klinik-sehat.test', crypt('Password123!', gen_salt('bf')), 'PATIENT', true),
  ('aaaaaaaa-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111111', 'patient3@klinik-sehat.test', crypt('Password123!', gen_salt('bf')), 'PATIENT', true),
  ('aaaaaaaa-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222222', 'admin@klinik-expired.test', crypt('Password123!', gen_salt('bf')), 'ADMIN', true)
on conflict (id) do update set
  clinic_id = excluded.clinic_id,
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role,
  is_active = excluded.is_active;

update public.clinics set owner_user_id = 'aaaaaaaa-1111-1111-1111-111111111101'
where id = '11111111-1111-1111-1111-111111111111';
update public.clinics set owner_user_id = 'aaaaaaaa-2222-2222-2222-222222222201'
where id = '22222222-2222-2222-2222-222222222222';

insert into public.profiles (id, user_id, full_name, phone, date_of_birth, address, gender) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Super Admin MediKlinik', '081200000001', '1990-01-01', 'Jakarta', 'L'),
  ('bbbbbbbb-1111-1111-1111-111111111101', 'aaaaaaaa-1111-1111-1111-111111111101', 'Nadia Admin', '081211111101', '1992-04-12', 'Jakarta', 'P'),
  ('bbbbbbbb-1111-1111-1111-111111111102', 'aaaaaaaa-1111-1111-1111-111111111102', 'dr. Bima Pratama', '081211111102', '1988-08-20', 'Jakarta', 'L'),
  ('bbbbbbbb-1111-1111-1111-111111111103', 'aaaaaaaa-1111-1111-1111-111111111103', 'Siti Rahma', '081211111103', '1996-05-15', 'Jakarta', 'P'),
  ('bbbbbbbb-1111-1111-1111-111111111104', 'aaaaaaaa-1111-1111-1111-111111111104', 'Andi Wijaya', '081211111104', '1985-11-03', 'Jakarta', 'L'),
  ('bbbbbbbb-1111-1111-1111-111111111105', 'aaaaaaaa-1111-1111-1111-111111111105', 'Rina Lestari', '081211111105', '2000-02-28', 'Jakarta', 'P'),
  ('bbbbbbbb-2222-2222-2222-222222222201', 'aaaaaaaa-2222-2222-2222-222222222201', 'Admin Expired', '081222222201', '1991-07-07', 'Bandung', 'L')
on conflict (id) do update set
  full_name = excluded.full_name,
  phone = excluded.phone,
  date_of_birth = excluded.date_of_birth,
  address = excluded.address,
  gender = excluded.gender;

insert into public.doctors (id, user_id, clinic_id, specialization, license_number, consultation_fee) values
  ('cccccccc-1111-1111-1111-111111111101', 'aaaaaaaa-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'Dokter Umum', 'SIP-TEST-001', 100000)
on conflict (id) do update set
  specialization = excluded.specialization,
  license_number = excluded.license_number,
  consultation_fee = excluded.consultation_fee;

insert into public.doctor_schedules (id, doctor_id, clinic_id, day_of_week, start_time, end_time, is_active) values
  ('dddddddd-1111-1111-1111-111111111101', 'cccccccc-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 1, '08:00', '16:00', true),
  ('dddddddd-1111-1111-1111-111111111102', 'cccccccc-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 3, '08:00', '16:00', true),
  ('dddddddd-1111-1111-1111-111111111103', 'cccccccc-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 5, '08:00', '14:00', true)
on conflict (id) do update set
  day_of_week = excluded.day_of_week,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  is_active = excluded.is_active;

insert into public.queues (id, clinic_id, patient_id, queue_number, status, date, called_at, done_at, created_at) values
  ('eeeeeeee-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111103', 'A-001', 'DONE', current_date, now() - interval '90 minutes', now() - interval '45 minutes', now() - interval '2 hours'),
  ('eeeeeeee-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111104', 'A-002', 'IN_PROGRESS', current_date, now() - interval '10 minutes', null, now() - interval '60 minutes'),
  ('eeeeeeee-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111105', 'A-003', 'WAITING', current_date, null, null, now() - interval '30 minutes')
on conflict (id) do update set
  status = excluded.status,
  date = excluded.date,
  called_at = excluded.called_at,
  done_at = excluded.done_at,
  created_at = excluded.created_at;

insert into public.medicines (id, clinic_id, name, unit, stock_quantity, min_stock_alert, purchase_price, sell_price, is_active) values
  ('ffffffff-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'Amoxicillin 500mg', 'strip', 8, 10, 12000, 18000, true),
  ('ffffffff-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'Paracetamol 500mg', 'strip', 42, 15, 6000, 12000, true),
  ('ffffffff-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', 'Vitamin C 500mg', 'botol', 20, 5, 18000, 28000, true)
on conflict (id) do update set
  name = excluded.name,
  unit = excluded.unit,
  stock_quantity = excluded.stock_quantity,
  min_stock_alert = excluded.min_stock_alert,
  purchase_price = excluded.purchase_price,
  sell_price = excluded.sell_price,
  is_active = excluded.is_active;

insert into public.medical_records (id, clinic_id, patient_id, doctor_id, queue_id, chief_complaint, diagnosis, notes, created_at, locked_at) values
  ('12345678-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111103', 'cccccccc-1111-1111-1111-111111111101', 'eeeeeeee-1111-1111-1111-111111111101', 'Demam dan batuk selama tiga hari', 'Infeksi saluran napas atas', 'Istirahat cukup dan kontrol bila belum membaik.', now() - interval '2 hours', null),
  ('12345678-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111104', 'cccccccc-1111-1111-1111-111111111101', null, 'Nyeri kepala berulang', 'Tension headache', 'Rekam medis lama untuk pengujian lock.', now() - interval '48 hours', now() - interval '24 hours')
on conflict (id) do update set
  chief_complaint = excluded.chief_complaint,
  diagnosis = excluded.diagnosis,
  notes = excluded.notes,
  created_at = excluded.created_at,
  locked_at = excluded.locked_at;

insert into public.prescriptions (id, clinic_id, medical_record_id, notes) values
  ('23456789-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', '12345678-1111-1111-1111-111111111101', 'Diminum setelah makan.')
on conflict (id) do update set notes = excluded.notes;

insert into public.prescription_items (id, prescription_id, medicine_id, quantity, dosage, instructions) values
  ('34567890-1111-1111-1111-111111111101', '23456789-1111-1111-1111-111111111101', 'ffffffff-1111-1111-1111-111111111101', 2, '3x1', 'Habiskan'),
  ('34567890-1111-1111-1111-111111111102', '23456789-1111-1111-1111-111111111101', 'ffffffff-1111-1111-1111-111111111102', 1, '3x1', 'Jika demam')
on conflict (id) do update set
  quantity = excluded.quantity,
  dosage = excluded.dosage,
  instructions = excluded.instructions;

insert into public.stock_mutations (id, clinic_id, medicine_id, type, quantity, reference_id, notes, created_at) values
  ('45678901-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'ffffffff-1111-1111-1111-111111111101', 'OUT', 2, '23456789-1111-1111-1111-111111111101', 'Resep pasien seed', now() - interval '90 minutes'),
  ('45678901-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'ffffffff-1111-1111-1111-111111111102', 'IN', 20, null, 'Restock supplier seed', now() - interval '1 day')
on conflict (id) do update set
  quantity = excluded.quantity,
  notes = excluded.notes,
  created_at = excluded.created_at;

insert into public.invoices (id, clinic_id, patient_id, medical_record_id, total_amount, status, payment_method, midtrans_order_id, paid_at, created_at) values
  ('56789012-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111103', '12345678-1111-1111-1111-111111111101', 148000, 'UNPAID', null, 'klinik-sehat-INV-001', null, now() - interval '60 minutes'),
  ('56789012-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111104', '12345678-1111-1111-1111-111111111102', 100000, 'PAID', 'CASH', 'klinik-sehat-INV-002', now() - interval '1 day', now() - interval '2 days')
on conflict (id) do update set
  total_amount = excluded.total_amount,
  status = excluded.status,
  payment_method = excluded.payment_method,
  midtrans_order_id = excluded.midtrans_order_id,
  paid_at = excluded.paid_at,
  created_at = excluded.created_at;

insert into public.invoice_items (id, invoice_id, description, quantity, unit_price, subtotal) values
  ('67890123-1111-1111-1111-111111111101', '56789012-1111-1111-1111-111111111101', 'Konsultasi Dokter Umum', 1, 100000, 100000),
  ('67890123-1111-1111-1111-111111111102', '56789012-1111-1111-1111-111111111101', 'Amoxicillin 500mg', 2, 18000, 36000),
  ('67890123-1111-1111-1111-111111111103', '56789012-1111-1111-1111-111111111101', 'Paracetamol 500mg', 1, 12000, 12000),
  ('67890123-1111-1111-1111-111111111104', '56789012-1111-1111-1111-111111111102', 'Konsultasi Dokter Umum', 1, 100000, 100000)
on conflict (id) do update set
  description = excluded.description,
  quantity = excluded.quantity,
  unit_price = excluded.unit_price,
  subtotal = excluded.subtotal;

insert into public.subscription_payments (
  id, clinic_id, plan, amount, midtrans_order_id, status, period_start, period_end, paid_at, created_at
) values
  ('78901234-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'CLINIC', 299000, 'klinik-sehat-SUB-SEED', 'PAID', now() - interval '1 day', now() + interval '30 days', now() - interval '1 day', now() - interval '1 day'),
  ('78901234-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222222', 'STARTER', 149000, 'klinik-expired-SUB-SEED', 'EXPIRED', now() - interval '37 days', now() - interval '7 days', now() - interval '37 days', now() - interval '37 days')
on conflict (id) do update set
  status = excluded.status,
  period_start = excluded.period_start,
  period_end = excluded.period_end,
  paid_at = excluded.paid_at;

commit;
