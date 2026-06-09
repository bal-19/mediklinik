import { describe, expect, test } from 'bun:test';
import { createApp } from '../src/server';
import { createAccessToken } from '../src/modules/shared/token';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('Route auth guard', () => {
  test('rejects protected route without bearer token', async () => {
    const app = createApp();
    const response = await app.fetch(new Request('http://localhost/dashboard/summary'));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
  });

  test('rejects protected route when subscription expired', async () => {
    const app = createApp();
    const token = createAccessToken({
      sub: 'user_demo',
      email: 'admin@mediklinik.id',
      role: 'ADMIN',
      clinicId: 'clinic_demo',
      subscriptionStatus: 'EXPIRED',
      iat: 1,
      exp: 2,
    });

    const response = await app.fetch(
      new Request('http://localhost/dashboard/summary', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
  });
});
