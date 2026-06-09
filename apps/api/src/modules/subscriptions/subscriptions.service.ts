import type { SubscriptionPaymentSummary } from '@mediklinik/types';

export class SubscriptionsService {
  checkout() {
    return {
      orderId: 'klinik-sehat-SUB-2026-06',
      snapToken: 'snap_demo_token',
      redirectUrl: 'https://app.sandbox.midtrans.com/snap/v4/redirection/demo',
    };
  }

  webhook() {
    const payment: SubscriptionPaymentSummary = {
      id: 'subpay_1',
      clinicId: 'clinic_demo',
      plan: 'CLINIC',
      amount: 299000,
      status: 'PAID',
      periodStart: '2026-06-09T00:00:00.000Z',
      periodEnd: '2026-07-09T00:00:00.000Z',
      paidAt: '2026-06-09T10:00:00.000Z',
    };

    return payment;
  }
}
