import type { ClinicDoctorCard, ClinicPublicPage, QueueItemSummary } from '@mediklinik/types';
import { ClinicsService } from '../clinics/clinics.service';
import { getAuthContext } from '../shared/request-context';
import { getSupabaseAdminClient } from '../shared/supabase-client';

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export class PublicClinicsService {
  private readonly clinicsService = new ClinicsService();

  getClinicBySlug(slug: string): Promise<ClinicPublicPage> {
    return this.clinicsService.getPublicPage(slug);
  }

  async getDoctorsByClinicSlug(slug: string): Promise<ClinicDoctorCard[]> {
    const { data: clinic, error: clinicError } = await getSupabaseAdminClient().from('clinics').select('id').eq('slug', slug).maybeSingle();
    if (clinicError) throw new Error(`Gagal mengambil klinik: ${clinicError.message}`);
    if (!clinic) throw new Error('Klinik tidak ditemukan.');
    const { data, error } = await getSupabaseAdminClient()
      .from('doctors')
      .select('id, specialization, users(profiles(full_name)), doctor_schedules(day_of_week,start_time,end_time,is_active)')
      .eq('clinic_id', clinic.id);
    if (error) throw new Error(`Gagal mengambil dokter klinik: ${error.message}`);

    return (data ?? []).map((doctor) => {
      const users = Array.isArray(doctor.users) ? doctor.users[0] : doctor.users;
      const profiles = Array.isArray(users?.profiles) ? users?.profiles[0] : users?.profiles;
      return {
        id: doctor.id,
        name: profiles?.full_name ?? 'Dokter',
        specialization: doctor.specialization,
        practiceSchedule: (doctor.doctor_schedules ?? [])
          .filter((schedule) => schedule.is_active)
          .map((schedule) => `${DAY_NAMES[schedule.day_of_week] ?? schedule.day_of_week} ${schedule.start_time}-${schedule.end_time}`),
      };
    });
  }

  async registerQueue(slug: string): Promise<QueueItemSummary> {
    const auth = getAuthContext();
    if (!auth || auth.role !== 'PATIENT') throw new Error('Hanya pasien yang dapat mengambil antrian publik.');
    const { data: clinic, error: clinicError } = await getSupabaseAdminClient().from('clinics').select('id, subscription_status').eq('slug', slug).maybeSingle();
    if (clinicError) throw new Error(`Gagal mengambil klinik: ${clinicError.message}`);
    if (!clinic || !['TRIAL', 'ACTIVE'].includes(clinic.subscription_status)) throw new Error('Klinik tidak aktif.');
    if (auth.clinicId !== clinic.id) throw new Error('Akun pasien tidak terdaftar pada klinik ini.');

    const today = new Date().toISOString().slice(0, 10);
    const { count, error: countError } = await getSupabaseAdminClient().from('queues').select('*', { count: 'exact', head: true }).eq('clinic_id', clinic.id).eq('date', today);
    if (countError) throw new Error(`Gagal menghitung antrian: ${countError.message}`);
    const queueNumber = `A-${String((count ?? 0) + 1).padStart(3, '0')}`;
    const { data, error } = await getSupabaseAdminClient().from('queues').insert({
      clinic_id: clinic.id, patient_id: auth.userId, queue_number: queueNumber, status: 'WAITING', date: today,
    }).select('id, clinic_id, patient_id, queue_number, status, date, called_at, done_at').single();
    if (error || !data) throw new Error(`Gagal membuat antrian: ${error?.message ?? 'insert gagal.'}`);
    return {
      id: data.id, clinicId: data.clinic_id, patientId: data.patient_id, queueNumber: data.queue_number,
      status: data.status, date: data.date, calledAt: data.called_at, doneAt: data.done_at,
    };
  }
}
