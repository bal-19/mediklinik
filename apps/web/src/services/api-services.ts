import type {
  ApiSuccess,
  AuthSession,
  ClinicRegisterInput,
  ClinicDoctorCard,
  ClinicPublicPage,
  ClinicSummary,
  DashboardSummary,
  InvoiceSummary,
  LoginInput,
  MedicalRecordSummary,
  MedicineSummary,
  PatientRegisterInput,
  PushSubscriptionInput,
  RevenueReportPoint,
  QueueItemSummary,
  SubscriptionCheckoutInput,
  SubscriptionPaymentSummary,
  SubscriptionSummary,
  VisitReportPoint,
} from '@mediklinik/types';
import { api, unwrap } from '../lib/axios';

export const authService = {
  login: (input: LoginInput) => unwrap<AuthSession>(api.post('/auth/login', input)),
  registerPatient: (input: PatientRegisterInput) => unwrap<AuthSession>(api.post('/auth/register', { ...input, role: 'PATIENT' })),
};
export const clinicRegistrationService = {
  register: (input: ClinicRegisterInput) => unwrap<{ clinicId: string; ownerUserId: string; subscriptionStatus: 'TRIAL' }>(api.post('/clinics/register', input)),
};
export const dashboardService = { summary: () => unwrap<DashboardSummary>(api.get('/dashboard/summary')) };
export const reportsService = {
  visits: () => unwrap<VisitReportPoint[]>(api.get('/reports/visits')),
  revenue: () => unwrap<RevenueReportPoint[]>(api.get('/reports/revenue')),
};
export const queueService = {
  today: () => unwrap<QueueItemSummary[]>(api.get('/queues/today')),
  callNext: () => unwrap<QueueItemSummary>(api.patch('/queues/next/call')),
  registerPublic: (slug: string) => unwrap<QueueItemSummary>(api.post(`/public/clinics/${slug}/queue`)),
};
export const medicineService = { list: () => unwrap<MedicineSummary[]>(api.get('/medicines')) };
export const medicalRecordService = { list: (patientId: string) => unwrap<MedicalRecordSummary[]>(api.get(`/medical-records/${patientId}`)) };
export const invoiceService = {
  list: () => unwrap<InvoiceSummary[]>(api.get('/invoices')),
  markManualPaid: (id: string, amountPaid: number) => unwrap<InvoiceSummary>(api.post(`/invoices/${id}/pay-cash`, { amountPaid })),
};
export const clinicService = {
  me: () => unwrap<ClinicSummary>(api.get('/clinics/me')),
  public: (slug: string) => unwrap<ClinicPublicPage>(api.get(`/public/clinics/${slug}`)),
  doctors: (slug: string) => unwrap<ClinicDoctorCard[]>(api.get(`/public/clinics/${slug}/doctors`)),
};
export const subscriptionService = {
  status: () => unwrap<SubscriptionSummary>(api.get('/clinics/me/subscription')),
  history: () => unwrap<SubscriptionPaymentSummary[]>(api.get('/subscriptions/payments')),
  checkout: (input: SubscriptionCheckoutInput) => unwrap<{ snapToken: string; redirectUrl?: string }>(api.post('/subscriptions/checkout', input)),
};
export const pushService = {
  subscribe: (input: PushSubscriptionInput) => unwrap(api.post('/push/subscribe', input)),
  unsubscribe: (endpoint: string) => unwrap(api.delete('/push/unsubscribe', { data: { endpoint } })),
};

export type ApiEnvelope<T> = ApiSuccess<T>;
