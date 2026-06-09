import axios from 'axios';
import type { ApiSuccess, AuthSession } from '@mediklinik/types';
import { useAuthStore } from '../stores/auth-store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;
api.interceptors.response.use(undefined, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || original?._retry) throw error;
  original._retry = true;
  const store = useAuthStore.getState();
  refreshPromise ??= axios
    .post<ApiSuccess<AuthSession>>(`${api.defaults.baseURL}/auth/refresh`, { refreshToken: store.refreshToken })
    .then(({ data }) => {
      store.setSession(data.data);
      return data.data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });
  try {
    original.headers.Authorization = `Bearer ${await refreshPromise}`;
    return api(original);
  } catch (refreshError) {
    store.clearSession();
    window.location.assign('/login');
    throw refreshError;
  }
});

export async function unwrap<T>(request: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  return (await request).data.data;
}
