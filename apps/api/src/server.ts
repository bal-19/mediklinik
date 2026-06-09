import { ApiRouter } from './modules/shared/api-router';
import { registerAuthRoutes } from './modules/auth/auth.routes';
import { registerClinicRoutes } from './modules/clinics/clinics.routes';
import { registerPublicClinicRoutes } from './modules/public-clinics/public-clinics.routes';
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
  registerPublicClinicRoutes(router);
  registerSubscriptionRoutes(router);
  registerUserRoutes(router);

  return router;
}
