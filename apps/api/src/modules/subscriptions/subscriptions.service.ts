import type { MidtransWebhookPayload, SubscriptionCheckoutInput, SubscriptionPaymentSummary } from '@mediklinik/types';
import { MidtransService } from '../payments/midtrans.service';
import { getAuthContext } from '../shared/request-context';
import { getSupabaseAdminClient } from '../shared/supabase-client';

const prices = { STARTER: 149000, CLINIC: 299000, PRO: 499000 } as const;

export class SubscriptionsService {
  async checkout(input: SubscriptionCheckoutInput) {
    const orderId = `${input.clinicSlug}-SUB-${input.plan}-${Date.now()}`;
    const result = await new MidtransService(process.env.MIDTRANS_PLATFORM_SERVER_KEY, process.env.MIDTRANS_PLATFORM_IS_PRODUCTION === 'true')
      .createSnap(orderId, prices[input.plan], { email: input.email, name: input.clinicSlug });
    return { orderId, ...result };
  }

  async webhook(payload: MidtransWebhookPayload): Promise<SubscriptionPaymentSummary> {
    new MidtransService(process.env.MIDTRANS_PLATFORM_SERVER_KEY).verify(payload);
    const match = payload.order_id.match(/^(.+)-SUB-(STARTER|CLINIC|PRO)-\d+$/);
    if (!match) throw new Error('Order ID bukan transaksi subscription yang valid.');
    const [, clinicSlug, plan] = match;
    const { data: clinic, error: clinicError } = await getSupabaseAdminClient().from('clinics').select('id').eq('slug', clinicSlug).maybeSingle();
    if (clinicError || !clinic) throw new Error(`Klinik subscription tidak ditemukan: ${clinicError?.message ?? clinicSlug}`);

    const paid = ['settlement', 'capture'].includes(payload.transaction_status);
    const periodStart = new Date();
    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    const status = paid ? 'PAID' : payload.transaction_status === 'pending' ? 'PENDING' : payload.transaction_status === 'expire' ? 'EXPIRED' : 'FAILED';
    const { data: payment, error } = await getSupabaseAdminClient().from('subscription_payments').upsert({
      clinic_id: clinic.id,
      plan,
      amount: Number(payload.gross_amount),
      midtrans_order_id: payload.order_id,
      status,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      paid_at: paid ? new Date().toISOString() : null,
    }, { onConflict: 'midtrans_order_id' }).select('*').single();
    if (error || !payment) throw new Error(`Gagal menyimpan pembayaran subscription: ${error?.message ?? 'upsert gagal.'}`);

    if (paid) {
      const { error: clinicUpdateError } = await getSupabaseAdminClient().from('clinics').update({
        subscription_status: 'ACTIVE', subscription_plan: plan, subscription_expires_at: periodEnd.toISOString(),
      }).eq('id', clinic.id);
      if (clinicUpdateError) throw new Error(`Gagal mengaktifkan subscription klinik: ${clinicUpdateError.message}`);
    }

    return mapPayment(payment);
  }

  async history(): Promise<SubscriptionPaymentSummary[]> {
    const auth = getAuthContext();
    if (!auth) throw new Error('Unauthorized.');
    let query = getSupabaseAdminClient().from('subscription_payments').select('*').order('created_at', { ascending: false });
    if (auth.role !== 'SUPER_ADMIN') {
      if (!auth.clinicId) throw new Error('Clinic context tidak ditemukan.');
      query = query.eq('clinic_id', auth.clinicId);
    }
    const { data, error } = await query;
    if (error) throw new Error(`Gagal mengambil riwayat subscription: ${error.message}`);
    return (data ?? []).map(mapPayment);
  }
}

function mapPayment(row: Record<string, unknown>): SubscriptionPaymentSummary {
  return {
    id: String(row.id),
    clinicId: String(row.clinic_id),
    plan: row.plan as SubscriptionPaymentSummary['plan'],
    amount: Number(row.amount),
    status: row.status as SubscriptionPaymentSummary['status'],
    periodStart: String(row.period_start),
    periodEnd: String(row.period_end),
    paidAt: row.paid_at ? String(row.paid_at) : null,
  };
}
