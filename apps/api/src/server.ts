import { ApiRouter } from './modules/shared/api-router';
import { registerAuthRoutes } from './modules/auth/auth.routes';
import { registerClinicRoutes } from './modules/clinics/clinics.routes';
import { registerDashboardRoutes } from './modules/dashboard/dashboard.routes';
import { registerDocsRoutes } from './modules/docs/docs.routes';
import { registerInvoiceRoutes } from './modules/invoices/invoices.routes';
import { registerMedicineRoutes } from './modules/medicines/medicines.routes';
import { registerMedicalRecordRoutes } from './modules/medical-records/medical-records.routes';
import { registerPublicClinicRoutes } from './modules/public-clinics/public-clinics.routes';
import { registerQueueRoutes } from './modules/queues/queues.routes';
import { registerReportRoutes } from './modules/reports/reports.routes';
import { registerSubscriptionRoutes } from './modules/subscriptions/subscriptions.routes';
import { registerUserRoutes } from './modules/users/users.routes';
import { registerPrescriptionRoutes } from './modules/prescriptions/prescriptions.routes';
import { registerPaymentRoutes } from './modules/payments/payments.routes';
import { registerPushRoutes } from './modules/push/push.routes';

export function createApp() {
  const router = new ApiRouter();

  router.get(
    '/health',
    () => ({
      success: true,
      data: {
        status: 'ok',
        service: 'mediklinik-api',
      },
    }),
    {
      summary: 'Health check',
      description: 'Memastikan service API aktif.',
      tags: ['Health'],
      auth: 'public',
    },
  );

  registerAuthRoutes(router);
  registerClinicRoutes(router);
  registerDashboardRoutes(router);
  registerDocsRoutes(router);
  registerInvoiceRoutes(router);
  registerMedicineRoutes(router);
  registerMedicalRecordRoutes(router);
  registerPublicClinicRoutes(router);
  registerPrescriptionRoutes(router);
  registerPaymentRoutes(router);
  registerPushRoutes(router);
  registerQueueRoutes(router);
  registerReportRoutes(router);
  registerSubscriptionRoutes(router);
  registerUserRoutes(router);

  return router;
}
