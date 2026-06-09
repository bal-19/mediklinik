import { describe, expect, test } from 'bun:test';
import { PrescriptionsService } from '../src/modules/prescriptions/prescriptions.service';
import { inMemoryDb } from '../src/modules/shared/in-memory-db';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();
describe('PrescriptionsService', () => {
  test('deducts medicine stock and records OUT mutation', async () => {
    const service = new PrescriptionsService();
    const before = inMemoryDb.getState().medicines.find((item) => item.id === 'med_2')!.stockQuantity;
    const prescription = await service.create({ medicalRecordId: 'mr_1', items: [{ medicineId: 'med_2', quantity: 2 }] });
    expect(prescription.items).toHaveLength(1);
    expect(inMemoryDb.getState().medicines.find((item) => item.id === 'med_2')!.stockQuantity).toBe(before - 2);
    expect(inMemoryDb.getState().stockMutations[0]?.referenceId).toBe(prescription.id);
  });
});
