import { describe, expect, test } from 'bun:test';
import { QueuesService } from '../src/modules/queues/queues.service';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('QueuesService', () => {
  test('register creates a new waiting queue number', () => {
    const service = new QueuesService();
    const result = service.register({ patientId: 'patient_99' });

    expect(result.patientId).toBe('patient_99');
    expect(result.queueNumber.startsWith('A-')).toBe(true);
    expect(result.status).toBe('WAITING');
  });
});
