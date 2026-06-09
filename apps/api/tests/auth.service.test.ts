import { describe, expect, test } from 'bun:test';
import { AuthService } from '../src/modules/auth/auth.service';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';
import { parseAccessToken } from '../src/modules/shared/token';

setupInMemoryTest();

describe('AuthService', () => {
  test('login returns auth session with tokens', () => {
    const service = new AuthService();
    const result = service.login({ email: 'admin@mediklinik.id', password: 'secret' });
    const payload = parseAccessToken(result.accessToken);

    expect(result.accessToken.split('.').length).toBe(3);
    expect(result.refreshToken.startsWith('refresh_')).toBe(true);
    expect(result.user.role).toBe('ADMIN');
    expect(payload?.clinicId).toBe('clinic_demo');
  });
});
