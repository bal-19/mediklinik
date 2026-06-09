import { describe, expect, test } from 'bun:test';
import { createApp } from '../src/server';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('Docs routes', () => {
  test('serves openapi json', async () => {
    const app = createApp();
    const response = await app.fetch(new Request('http://localhost/openapi.json'));
    const document = await response.json();

    expect(response.status).toBe(200);
    expect(document.openapi).toBe('3.1.0');
    expect(document.paths['/auth/login']).toBeDefined();
    expect(document.paths['/docs']).toBeDefined();
  });

  test('serves scalar docs page', async () => {
    const app = createApp();
    const response = await app.fetch(new Request('http://localhost/docs'));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html.includes('@scalar/api-reference')).toBe(true);
    expect(html.includes('/openapi.json')).toBe(true);
  });
});
