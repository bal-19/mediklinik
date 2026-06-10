import { describe, expect, test } from 'bun:test';
import { AuthService } from '../src/modules/auth/auth.service';
import { setupDatabaseTest } from '../src/modules/shared/test-utils';
import { parseAccessToken } from '../src/modules/shared/token';

setupDatabaseTest();

describe('AuthService', () => {
  test('login returns auth session with tokens', () => {
    const service = new AuthService();
    const resultPromise = service.login({ email: 'admin@klinik-sehat.test', password: 'Password123!' });

    return resultPromise.then((result) => {
      const payload = parseAccessToken(result.accessToken);

      expect(result.accessToken.split('.').length).toBe(3);
      expect(result.refreshToken.startsWith('refresh_')).toBe(true);
      expect(result.user.role).toBe('ADMIN');
      expect(payload?.clinicId).toBe('11111111-1111-1111-1111-111111111111');
    });
  });

  test('super admin token can omit clinic context', () => {
    const service = new AuthService();
    const resultPromise = service.register({
      email: 'superadmin@mediklinik.id',
      password: 'secret',
      fullName: 'Super Admin',
      role: 'SUPER_ADMIN',
    });

    return resultPromise.then((result) => {
      const payload = parseAccessToken(result.accessToken);

      expect(result.user.role).toBe('SUPER_ADMIN');
      expect(result.user.clinicId).toBeNull();
      expect(payload?.clinicId).toBeUndefined();
    });
  });
});
