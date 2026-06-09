import type { AuthSession } from '@mediklinik/types';

let session: AuthSession | null = null;

export function setSession(nextSession: AuthSession | null) {
  session = nextSession;
}

export function getSession() {
  return session;
}

export function getAccessToken() {
  return session?.accessToken ?? null;
}
