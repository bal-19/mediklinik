alter table public.clinics
  drop column if exists midtrans_server_key_encrypted,
  drop column if exists midtrans_client_key_encrypted,
  drop column if exists merchant_id;
