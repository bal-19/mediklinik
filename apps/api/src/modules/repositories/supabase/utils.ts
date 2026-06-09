import { getRequestClinicId } from '../../shared/supabase-client';

export function requireClinicId() {
  const clinicIdFromRequest = getRequestClinicId();
  if (clinicIdFromRequest) {
    return clinicIdFromRequest;
  }

  const clinicId = process.env.DEFAULT_CLINIC_ID;
  if (!clinicId) {
    throw new Error('Clinic context tidak ditemukan. Kirim Authorization Bearer token yang memuat clinicId atau gunakan x-clinic-id untuk bridge lokal.');
  }

  return clinicId;
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function notImplemented(message: string): never {
  throw new Error(message);
}
