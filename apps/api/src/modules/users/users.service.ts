import type { DashboardUser } from '@mediklinik/types';

export class UsersService {
  getCurrentUser(): DashboardUser {
    return {
      id: 'user_demo',
      clinicId: 'clinic_demo',
      email: 'admin@mediklinik.id',
      fullName: 'Admin Klinik',
      role: 'ADMIN',
      subscriptionStatus: 'TRIAL',
    };
  }
}
