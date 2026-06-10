import { describe, expect, test } from 'bun:test';
import { createAccessToken, parseAccessToken } from '../src/modules/shared/token';

describe('token helpers', () => {
  test('creates and parses access token with clinic context', () => {
    const token = createAccessToken({
      sub: 'user_1',
      email: 'admin@klinik-sehat.test',
      role: 'ADMIN',
      clinicId: '11111111-1111-1111-1111-111111111111',
      subscriptionStatus: 'TRIAL',
      iat: 1,
      exp: 2,
    });

    const payload = parseAccessToken(token);

    expect(payload?.clinicId).toBe('11111111-1111-1111-1111-111111111111');
    expect(payload?.subscriptionStatus).toBe('TRIAL');
    expect(payload?.role).toBe('ADMIN');
  });
});
