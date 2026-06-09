import type {
  ApiError,
  ApiSuccess,
  AuthSession,
  DashboardSummary,
  InvoiceSummary,
  MedicineSummary,
  QueueItemSummary,
  SubscriptionSummary,
} from '@mediklinik/types';
import { getAccessToken, setSession } from './auth-state';

const API_URL = (globalThis as { __MEDIKLINIK_API_URL__?: string }).__MEDIKLINIK_API_URL__ ?? 'http://localhost:3000';

export async function loginDemo() {
  const response = await request<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@mediklinik.id',
      password: 'password',
    }),
  });

  setSession(response);
  return response;
}

export async function getDashboardSummary() {
  return request<DashboardSummary>('/dashboard/summary');
}

export async function getQueuesToday() {
  return request<QueueItemSummary[]>('/queues/today');
}

export async function getMedicines() {
  return request<MedicineSummary[]>('/medicines');
}

export async function getInvoices() {
  return request<InvoiceSummary[]>('/invoices');
}

export async function getSubscription() {
  return request<SubscriptionSummary>('/clinics/me/subscription');
}

async function request<T>(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set('content-type', 'application/json');

  const token = getAccessToken();
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? 'Request gagal.');
  }

  return payload.data;
}
