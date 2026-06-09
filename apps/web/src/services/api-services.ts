import type {
  ApiSuccess,
  AuthSession,
  ClinicDoctorCard,
  ClinicPublicPage,
  ClinicSummary,
  DashboardSummary,
  InvoiceSummary,
  MedicalRecordSummary,
  MedicineSummary,
  PushSubscriptionInput,
  QueueItemSummary,
  SubscriptionCheckoutInput,
  SubscriptionPaymentSummary,
  SubscriptionSummary,
} from '@mediklinik/types';
import { api, unwrap } from '../lib/axios';

export const authService = {
  login: (input: { email: string; password: string }) => unwrap<AuthSession>(api.post('/auth/login', input)),
};
export const dashboardService = { summary: () => unwrap<DashboardSummary>(api.get('/dashboard/summary')) };
export const queueService = {
  today: () => unwrap<QueueItemSummary[]>(api.get('/queues/today')),
  callNext: () => unwrap<QueueItemSummary>(api.patch('/queues/next/call')),
};
export const medicineService = { list: () => unwrap<MedicineSummary[]>(api.get('/medicines')) };
export const medicalRecordService = { list: (patientId = 'patient_1') => unwrap<MedicalRecordSummary[]>(api.get(`/medical-records/${patientId}`)) };
export const invoiceService = {
  list: () => unwrap<InvoiceSummary[]>(api.get('/invoices')),
  payOnline: (id: string) => unwrap<{ snapToken: string; orderId: string; redirectUrl?: string }>(api.post(`/invoices/${id}/pay-online`)),
};
export const clinicService = {
  me: () => unwrap<ClinicSummary>(api.get('/clinics/me')),
  public: (slug: string) => unwrap<ClinicPublicPage>(api.get(`/public/clinics/${slug}`)),
  doctors: (slug: string) => unwrap<ClinicDoctorCard[]>(api.get(`/public/clinics/${slug}/doctors`)),
  saveMidtrans: (input: object) => unwrap<{ isMidtransConfigured: boolean }>(api.put('/clinics/me/midtrans', input)),
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
