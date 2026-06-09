import { beforeEach } from 'bun:test';
import { resetInMemoryDb } from './in-memory-db';

export function setupInMemoryTest() {
  beforeEach(() => {
    resetInMemoryDb();
  });
}
