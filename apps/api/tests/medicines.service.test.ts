import { describe, expect, test } from 'bun:test';
import { MedicinesService } from '../src/modules/medicines/medicines.service';
import { setupInMemoryTest } from '../src/modules/shared/test-utils';

setupInMemoryTest();

describe('MedicinesService', () => {
  test('stock in increases medicine stock and records mutation', async () => {
    const service = new MedicinesService();
    const result = await service.stockIn('med_1', { quantity: 5, notes: 'Test restock' });

    expect(result.medicine.id).toBe('med_1');
    expect(result.mutation.type).toBe('IN');
    expect(result.medicine.stockQuantity).toBeGreaterThan(8);
  });
});
