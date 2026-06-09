import type { CreatePrescriptionInput } from '@mediklinik/types';
import type { ApiRouter } from '../shared/api-router';
import { ok } from '../shared/response';
import { PrescriptionsService } from './prescriptions.service';

const service = new PrescriptionsService();
export function registerPrescriptionRoutes(router: ApiRouter) {
  router.post('/prescriptions', async ({ body }) => ok(await service.create(body as CreatePrescriptionInput), 'Resep tersimpan dan stok diperbarui'), {
    summary: 'Create prescription and deduct stock', description: 'Menyimpan resep, mengurangi stok, dan membuat mutasi OUT dalam satu transaction boundary.', tags: ['Prescriptions'], auth: 'bearer', subscriptionRequired: true,
  });
  router.post('/prescriptions/:id/items', async ({ params, body }) => {
    const payload = body as { medicalRecordId: string; items: CreatePrescriptionInput['items']; notes?: string };
    return ok(await service.create({ medicalRecordId: payload.medicalRecordId, notes: payload.notes ?? `Tambahan item ${params.id}`, items: payload.items }));
  }, { summary: 'Add prescription items', tags: ['Prescriptions'], auth: 'bearer', subscriptionRequired: true });
}
