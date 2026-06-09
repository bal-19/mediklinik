alter table public.prescriptions add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;
update public.prescriptions p set clinic_id = mr.clinic_id from public.medical_records mr where mr.id = p.medical_record_id and p.clinic_id is null;
create index if not exists idx_prescriptions_clinic_id on public.prescriptions(clinic_id);
create unique index if not exists idx_push_subscriptions_endpoint on public.push_subscriptions(endpoint);

drop policy if exists "tenant prescriptions policy" on public.prescriptions;
create policy "tenant prescriptions policy" on public.prescriptions for all
using (clinic_id = public.current_clinic_id())
with check (clinic_id = public.current_clinic_id());

create or replace function public.create_prescription_with_stock(
  p_clinic_id uuid,
  p_medical_record_id uuid,
  p_notes text,
  p_items jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prescription_id uuid := gen_random_uuid();
  v_item jsonb;
  v_medicine medicines%rowtype;
begin
  if not exists (select 1 from medical_records where id = p_medical_record_id and clinic_id = p_clinic_id) then
    raise exception 'Medical record tidak ditemukan dalam tenant aktif';
  end if;

  insert into prescriptions(id, clinic_id, medical_record_id, notes)
  values (v_prescription_id, p_clinic_id, p_medical_record_id, coalesce(p_notes, ''));

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_medicine from medicines
    where id = (v_item->>'medicineId')::uuid and clinic_id = p_clinic_id
    for update;

    if not found or v_medicine.stock_quantity < (v_item->>'quantity')::int then
      raise exception 'Stok obat tidak cukup';
    end if;

    insert into prescription_items(prescription_id, medicine_id, quantity, dosage, instructions)
    values (v_prescription_id, v_medicine.id, (v_item->>'quantity')::int, v_item->>'dosage', v_item->>'instructions');

    update medicines set stock_quantity = stock_quantity - (v_item->>'quantity')::int where id = v_medicine.id;
    insert into stock_mutations(clinic_id, medicine_id, type, quantity, reference_id, notes)
    values (p_clinic_id, v_medicine.id, 'OUT', (v_item->>'quantity')::int, v_prescription_id, 'Resep pasien');
  end loop;

  return jsonb_build_object(
    'id', v_prescription_id,
    'clinicId', p_clinic_id,
    'medicalRecordId', p_medical_record_id,
    'notes', coalesce(p_notes, ''),
    'items', p_items,
    'createdAt', now()
  );
end;
$$;

create or replace function public.lock_old_medical_records()
returns integer language plpgsql security definer set search_path = public as $$
declare v_count integer;
begin
  update medical_records set locked_at = now()
  where locked_at is null and created_at <= now() - interval '24 hours';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
