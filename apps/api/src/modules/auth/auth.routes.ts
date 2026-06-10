import { AuthService } from './auth.service';
import type { Role } from '@mediklinik/types';
import { ok } from '../shared/response';
import type { ApiRouter } from '../shared/api-router';

const authService = new AuthService();

export function registerAuthRoutes(router: ApiRouter) {
  router.post(
    '/auth/login',
    async ({ body }) =>
      ok(
        await authService.login({
          email: requireString(body, 'email'),
          password: requireString(body, 'password'),
        }),
        'Login berhasil',
      ),
    {
      summary: 'Login user',
      description: 'Masuk sebagai admin, dokter, pasien, atau super admin dan dapatkan access token serta refresh token.',
      tags: ['Auth'],
      auth: 'public',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
    },
  );

  router.post(
    '/auth/register',
    async ({ body }) =>
      ok(
        await authService.register({
          email: requireString(body, 'email'),
          password: requireString(body, 'password'),
          fullName: requireString(body, 'fullName'),
          role: ((body as { role?: Role } | undefined)?.role ?? 'PATIENT'),
          clinicId: typeof (body as { clinicId?: unknown } | undefined)?.clinicId === 'string' ? (body as { clinicId: string }).clinicId : undefined,
        }),
        'Registrasi berhasil',
      ),
    {
      summary: 'Register patient',
      description: 'Registrasi akun pasien mandiri dari halaman publik atau flow auth umum.',
      tags: ['Auth'],
      auth: 'public',
    },
  );

  router.post(
    '/auth/refresh',
    async ({ body }) =>
      ok(
        await authService.refresh(
          requireString(body, 'refreshToken'),
        ),
        'Token diperbarui',
      ),
    {
      summary: 'Refresh token',
      description: 'Rotasi access token menggunakan refresh token yang masih valid.',
      tags: ['Auth'],
      auth: 'public',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RefreshRequest' },
          },
        },
      },
    },
  );
}

function requireString(body: unknown, field: string) {
  const value = (body as Record<string, unknown> | undefined)?.[field];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} wajib diisi.`);
  return value.trim();
}
