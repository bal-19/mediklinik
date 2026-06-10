import { beforeEach } from 'bun:test';

export function setupDatabaseTest() {
  beforeEach(() => {
    process.env.DEFAULT_CLINIC_ID = '11111111-1111-1111-1111-111111111111';
  });
}
