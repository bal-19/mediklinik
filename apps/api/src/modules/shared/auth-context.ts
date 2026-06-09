import type { Role, SubscriptionStatus } from '@mediklinik/types';

export interface AuthContext {
  userId: string;
  clinicId: string | null;
  role: Role;
  subscriptionStatus: SubscriptionStatus;
}
