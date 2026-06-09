export function requireClinicId() {
  const clinicId = process.env.DEFAULT_CLINIC_ID;
  if (!clinicId) {
    throw new Error('DEFAULT_CLINIC_ID wajib diisi untuk repository Supabase.');
  }

  return clinicId;
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function notImplemented(message: string): never {
  throw new Error(message);
}
