import { AsyncLocalStorage } from 'node:async_hooks';
import type { AuthContext } from './auth-context';

const authContextStorage = new AsyncLocalStorage<AuthContext | null>();

export function runWithAuthContext<T>(authContext: AuthContext | null, callback: () => T) {
  return authContextStorage.run(authContext, callback);
}

export function getAuthContext() {
  return authContextStorage.getStore() ?? null;
}
