import type { SubscriptionStatus } from '@mediklinik/types';
import { fail } from './response';

const allowedStatuses: SubscriptionStatus[] = ['TRIAL', 'ACTIVE'];

export function guardSubscription(status: SubscriptionStatus) {
  if (!allowedStatuses.includes(status)) {
    return fail('Masa langganan Anda telah berakhir. Perpanjang untuk melanjutkan.');
  }

  return null;
}
