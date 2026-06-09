import { AuthService } from './auth.service';
import { ok } from '../shared/response';
import type { ApiRouter } from '../shared/api-router';

const authService = new AuthService();

export function registerAuthRoutes(router: ApiRouter) {
  router.post(
    '/auth/login',
    () =>
      ok(
        authService.login({
          email: 'admin@mediklinik.id',
          password: 'password',
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
    () =>
      ok(
        authService.register({
          email: 'patient@example.com',
          password: 'password',
          fullName: 'Pasien Demo',
          role: 'PATIENT',
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
    () => ok(authService.refresh('refresh_user_demo'), 'Token diperbarui'),
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
