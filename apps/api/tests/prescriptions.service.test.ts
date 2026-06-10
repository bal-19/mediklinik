import { describe, expect, test } from 'bun:test';
import { PrescriptionsService } from '../src/modules/prescriptions/prescriptions.service';

describe('PrescriptionsService', () => {
  test('rejects an empty prescription before querying database', async () => {
    const service = new PrescriptionsService();
    await expect(service.create({ medicalRecordId: crypto.randomUUID(), items: [] })).rejects.toThrow('Resep harus memiliki item');
  });
});
