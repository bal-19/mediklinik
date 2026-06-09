import type { ClinicDoctorCard, ClinicPublicPage, QueueItemSummary } from '@mediklinik/types';
import { ClinicsService } from '../clinics/clinics.service';

export class PublicClinicsService {
  private readonly clinicsService = new ClinicsService();

  getClinicBySlug(): ClinicPublicPage {
    return this.clinicsService.getPublicPage();
  }

  getDoctorsByClinicSlug(): ClinicDoctorCard[] {
    return [
      {
        id: 'doctor_1',
        name: 'dr. Rani Kusuma',
        specialization: 'Dokter Umum',
        practiceSchedule: ['Senin 08:00-12:00', 'Rabu 13:00-17:00'],
      },
      {
        id: 'doctor_2',
        name: 'dr. Bayu Pratama',
        specialization: 'Dokter Anak',
        practiceSchedule: ['Selasa 09:00-14:00', 'Kamis 09:00-14:00'],
      },
    ];
  }

  registerQueue(): QueueItemSummary {
    return {
      id: 'queue_1',
      clinicId: 'clinic_demo',
      patientId: 'patient_1',
      queueNumber: 'A-001',
      status: 'WAITING',
      date: '2026-06-09',
      calledAt: null,
      doneAt: null,
    };
  }
}
