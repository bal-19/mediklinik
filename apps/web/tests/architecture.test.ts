import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';

describe('React production architecture', () => {
  test('uses query-driven routes and PWA registration', async () => {
    const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
    const main = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8');
    expect(app).toContain('ProtectedRoute');
    expect(app).toContain('lazy(');
    expect(main).toContain('QueryClientProvider');
    expect(main).toContain('registerSW');
  });

  test('keeps access token in Zustand memory and uses refresh interceptor', async () => {
    const store = await readFile(new URL('../src/stores/auth-store.ts', import.meta.url), 'utf8');
    const axios = await readFile(new URL('../src/lib/axios.ts', import.meta.url), 'utf8');
    expect(store).not.toContain("localStorage");
    expect(axios).toContain('/auth/refresh');
  });
});
