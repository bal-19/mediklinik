import type { MidtransWebhookPayload, SubscriptionCheckoutInput, SubscriptionPaymentSummary } from '@mediklinik/types';
import { inMemoryDb } from '../shared/in-memory-db';
import { MidtransService } from '../payments/midtrans.service';

const prices = { STARTER: 149000, CLINIC: 299000, PRO: 499000 } as const;
export class SubscriptionsService {
  async checkout(input: SubscriptionCheckoutInput) {
    const orderId = `${input.clinicSlug}-SUB-${Date.now()}`;
    const result = await new MidtransService(process.env.MIDTRANS_PLATFORM_SERVER_KEY, process.env.MIDTRANS_PLATFORM_IS_PRODUCTION === 'true')
      .createSnap(orderId, prices[input.plan], { email: input.email, name: input.clinicSlug });
    return { orderId, ...result };
  }
  webhook(payload: MidtransWebhookPayload): SubscriptionPaymentSummary {
    new MidtransService(process.env.MIDTRANS_PLATFORM_SERVER_KEY).verify(payload);
    if (!payload.order_id.includes('-SUB-')) throw new Error('Order ID bukan transaksi subscription.');
    const paid = ['settlement', 'capture'].includes(payload.transaction_status);
    const now = new Date();
    const payment: SubscriptionPaymentSummary = { id: `subpay_${Date.now()}`, clinicId: 'clinic_demo', plan: 'CLINIC', amount: Number(payload.gross_amount), status: paid ? 'PAID' : 'PENDING', periodStart: now.toISOString(), periodEnd: new Date(now.setMonth(now.getMonth() + 1)).toISOString(), paidAt: paid ? new Date().toISOString() : null };
    inMemoryDb.getState().subscriptionPayments.unshift(payment);
    if (paid) { inMemoryDb.getState().subscription.status = 'ACTIVE'; inMemoryDb.getState().subscription.subscriptionExpiresAt = payment.periodEnd; }
    return payment;
  }
  history() { return inMemoryDb.getState().subscriptionPayments; }
}
