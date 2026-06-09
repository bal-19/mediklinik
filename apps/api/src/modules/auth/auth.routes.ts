import { AuthService } from './auth.service';
import { ok } from '../shared/response';
import type { ApiRouter } from '../shared/api-router';

const authService = new AuthService();

export function registerAuthRoutes(router: ApiRouter) {
  router.post('/auth/login', () =>
    ok(
      authService.login({
        email: 'admin@mediklinik.id',
        password: 'password',
      }),
      'Login berhasil',
    ),
  );

  router.post('/auth/register', () =>
    ok(
      authService.register({
        email: 'patient@example.com',
        password: 'password',
        fullName: 'Pasien Demo',
        role: 'PATIENT',
      }),
      'Registrasi berhasil',
    ),
  );

  router.post('/auth/refresh', () =>
    ok(authService.refresh('refresh_user_demo'), 'Token diperbarui'),
  );
}
