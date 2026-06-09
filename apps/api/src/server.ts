import { ApiRouter } from './modules/shared/api-router';
import { registerAuthRoutes } from './modules/auth/auth.routes';
import { registerClinicRoutes } from './modules/clinics/clinics.routes';
import { registerDashboardRoutes } from './modules/dashboard/dashboard.routes';
import { registerInvoiceRoutes } from './modules/invoices/invoices.routes';
import { registerMedicineRoutes } from './modules/medicines/medicines.routes';
import { registerMedicalRecordRoutes } from './modules/medical-records/medical-records.routes';
import { registerPublicClinicRoutes } from './modules/public-clinics/public-clinics.routes';
import { registerQueueRoutes } from './modules/queues/queues.routes';
import { registerReportRoutes } from './modules/reports/reports.routes';
import { registerSubscriptionRoutes } from './modules/subscriptions/subscriptions.routes';
import { registerUserRoutes } from './modules/users/users.routes';

export function createApp() {
  const router = new ApiRouter();

  router.get('/health', () => ({
    success: true,
    data: {
      status: 'ok',
      service: 'mediklinik-api',
    },
  }));

  registerAuthRoutes(router);
  registerClinicRoutes(router);
  registerDashboardRoutes(router);
  registerInvoiceRoutes(router);
  registerMedicineRoutes(router);
  registerMedicalRecordRoutes(router);
  registerPublicClinicRoutes(router);
  registerQueueRoutes(router);
  registerReportRoutes(router);
  registerSubscriptionRoutes(router);
  registerUserRoutes(router);

  return router;
}
