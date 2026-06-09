import type { AuthSession, DashboardUser } from '@mediklinik/types';
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: DashboardUser | null;
  setSession: (session: AuthSession) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: sessionStorage.getItem('mediklinik-refresh-token'),
  user: null,
  setSession: (session) => {
    sessionStorage.setItem('mediklinik-refresh-token', session.refreshToken);
    set(session);
  },
  setAccessToken: (accessToken) => set({ accessToken }),
  clearSession: () => {
    sessionStorage.removeItem('mediklinik-refresh-token');
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
