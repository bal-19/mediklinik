import { describe, expect, test } from 'bun:test';
import { AuthService } from '../src/modules/auth/auth.service';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('AuthService', () => {
  test('login returns auth session with tokens', () => {
    const service = new AuthService();
    const result = service.login({ email: 'admin@mediklinik.id', password: 'secret' });

    expect(result.accessToken.startsWith('access_')).toBe(true);
    expect(result.refreshToken.startsWith('refresh_')).toBe(true);
    expect(result.user.role).toBe('ADMIN');
  });
});
