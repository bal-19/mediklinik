create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'role_type') then
    create type role_type as enum ('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_status_type') then
    create type subscription_status_type as enum ('TRIAL', 'ACTIVE', 'EXPIRED', 'SUSPENDED');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_plan_type') then
    create type subscription_plan_type as enum ('STARTER', 'CLINIC', 'PRO');
  end if;
  if not exists (select 1 from pg_type where typname = 'queue_status_type') then
    create type queue_status_type as enum ('WAITING', 'CALLED', 'IN_PROGRESS', 'DONE', 'SKIP');
  end if;
  if not exists (select 1 from pg_type where typname = 'stock_mutation_type') then
    create type stock_mutation_type as enum ('IN', 'OUT');
  end if;
  if not exists (select 1 from pg_type where typname = 'invoice_status_type') then
    create type invoice_status_type as enum ('DRAFT', 'UNPAID', 'PARTIAL', 'PAID', 'VOID');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status_type') then
    create type payment_status_type as enum ('PENDING', 'PAID', 'FAILED', 'EXPIRED');
  end if;
end $$;

create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_user_id uuid,
  midtrans_server_key_encrypted text,
  midtrans_client_key_encrypted text,
  merchant_id text,
  subscription_status subscription_status_type not null default 'TRIAL',
  subscription_plan subscription_plan_type not null default 'CLINIC',
  trial_expires_at timestamptz,
  subscription_expires_at timestamptz,
  midtrans_subscription_order_id text,
  public_description text default '',
  public_address text default '',
  public_phone text default '',
  public_open_hours jsonb not null default '{}'::jsonb,
  is_public_page_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete cascade,
  email text not null unique,
  password_hash text not null,
  role role_type not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.clinics
  add constraint clinics_owner_user_id_fkey
  foreign key (owner_user_id) references public.users(id) deferrable initially deferred;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null,
  phone text,
  date_of_birth date,
  address text,
  gender text
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  specialization text not null,
  license_number text,
  consultation_fee numeric(12,2) not null default 0
);

create table if not exists public.doctor_schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true
);

create table if not exists public.queues (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.users(id) on delete cascade,
  queue_number text not null,
  status queue_status_type not null default 'WAITING',
  date date not null,
  called_at timestamptz,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.medical_records (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.users(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  queue_id uuid references public.queues(id) on delete set null,
  chief_complaint text,
  diagnosis text,
  notes text,
  created_at timestamptz not null default now(),
  locked_at timestamptz
);

create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  medical_record_id uuid not null references public.medical_records(id) on delete cascade,
  notes text
);

create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  unit text not null,
  stock_quantity integer not null default 0,
  min_stock_alert integer not null default 0,
  purchase_price numeric(12,2) not null default 0,
  sell_price numeric(12,2) not null default 0,
  is_active boolean not null default true
);

create table if not exists public.prescription_items (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  dosage text,
  instructions text
);

create table if not exists public.stock_mutations (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  type stock_mutation_type not null,
  quantity integer not null check (quantity > 0),
  reference_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id uuid not null references public.users(id) on delete cascade,
  medical_record_id uuid references public.medical_records(id) on delete set null,
  total_amount numeric(12,2) not null default 0,
  status invoice_status_type not null default 'UNPAID',
  payment_method text,
  midtrans_order_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  plan subscription_plan_type not null,
  amount numeric(12,2) not null default 0,
  midtrans_order_id text not null,
  status payment_status_type not null default 'PENDING',
  period_start timestamptz not null,
  period_end timestamptz not null,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_clinic_id on public.users(clinic_id);
create index if not exists idx_doctors_clinic_id on public.doctors(clinic_id);
create index if not exists idx_queues_clinic_date on public.queues(clinic_id, date);
create index if not exists idx_medical_records_clinic_id on public.medical_records(clinic_id);
create index if not exists idx_medicines_clinic_id on public.medicines(clinic_id);
create index if not exists idx_invoices_clinic_id on public.invoices(clinic_id);

alter table public.clinics enable row level security;
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.queues enable row level security;
alter table public.medical_records enable row level security;
alter table public.prescriptions enable row level security;
alter table public.prescription_items enable row level security;
alter table public.medicines enable row level security;
alter table public.stock_mutations enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.subscription_payments enable row level security;

create or replace function public.current_clinic_id()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('app.current_clinic_id', true), '')::uuid
$$;

create policy "tenant clinics can view own clinic"
on public.clinics
for select
using (id = public.current_clinic_id());

create policy "tenant users policy"
on public.users
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant profiles policy"
on public.profiles
for all
using (
  exists (
    select 1
    from public.users
    where users.id = profiles.user_id
      and users.clinic_id = public.current_clinic_id()
  )
)
with check (
  exists (
    select 1
    from public.users
    where users.id = profiles.user_id
      and users.clinic_id = public.current_clinic_id()
  )
);

create policy "tenant doctors policy"
on public.doctors
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant doctor schedules policy"
on public.doctor_schedules
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant queues policy"
on public.queues
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant medical records policy"
on public.medical_records
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant prescriptions policy"
on public.prescriptions
for all
using (
  exists (
    select 1
    from public.medical_records
    where medical_records.id = prescriptions.medical_record_id
      and medical_records.clinic_id = public.current_clinic_id()
  )
)
with check (
  exists (
    select 1
    from public.medical_records
    where medical_records.id = prescriptions.medical_record_id
      and medical_records.clinic_id = public.current_clinic_id()
  )
);

create policy "tenant prescription items policy"
on public.prescription_items
for all
using (
  exists (
    select 1
    from public.prescriptions
    join public.medical_records on medical_records.id = prescriptions.medical_record_id
    where prescriptions.id = prescription_items.prescription_id
      and medical_records.clinic_id = public.current_clinic_id()
  )
)
with check (
  exists (
    select 1
    from public.prescriptions
    join public.medical_records on medical_records.id = prescriptions.medical_record_id
    where prescriptions.id = prescription_items.prescription_id
      and medical_records.clinic_id = public.current_clinic_id()
  )
);

create policy "tenant medicines policy"
on public.medicines
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant stock mutations policy"
on public.stock_mutations
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant invoices policy"
on public.invoices
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant invoice items policy"
on public.invoice_items
for all
using (
  exists (
    select 1
    from public.invoices
    where invoices.id = invoice_items.invoice_id
      and invoices.clinic_id = public.current_clinic_id()
  )
)
with check (
  exists (
    select 1
    from public.invoices
    where invoices.id = invoice_items.invoice_id
      and invoices.clinic_id = public.current_clinic_id()
  )
);

create policy "tenant push subscriptions policy"
on public.push_subscriptions
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create policy "tenant subscription payments policy"
on public.subscription_payments
for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());
