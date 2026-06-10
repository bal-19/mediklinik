import webpush from 'web-push';
import type { PushPayload, PushSubscriptionInput } from '@mediklinik/types';
import { getAuthContext } from '../shared/request-context';
import { getSupabaseAdminClient } from '../shared/supabase-client';

export class PushService {
  constructor() {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) webpush.setVapidDetails('mailto:admin@mediklinik.id', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  }
  async subscribe(input: PushSubscriptionInput) {
    const auth = getAuthContext();
    if (!auth) throw new Error('Auth context dibutuhkan.');
    if (!auth.clinicId) throw new Error('Clinic context dibutuhkan untuk menyimpan push subscription.');
    const { error } = await getSupabaseAdminClient().from('push_subscriptions').upsert({
      user_id: auth.userId, clinic_id: auth.clinicId, endpoint: input.endpoint, p256dh: input.keys.p256dh, auth: input.keys.auth,
    }, { onConflict: 'endpoint' });
    if (error) throw new Error(`Gagal menyimpan push subscription: ${error.message}`);
    return { subscribed: true };
  }
  async unsubscribe(endpoint: string) {
    const { error } = await getSupabaseAdminClient().from('push_subscriptions').delete().eq('endpoint', endpoint);
    if (error) throw new Error(`Gagal menghapus push subscription: ${error.message}`);
    return { subscribed: false };
  }
  async send(payload: PushPayload) {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return { sent: 0, skipped: true };
    const { data, error } = await getSupabaseAdminClient().from('push_subscriptions').select('endpoint,p256dh,auth');
    if (error) throw new Error(`Gagal mengambil push subscription: ${error.message}`);
    const subscriptions = (data ?? []).map((item) => ({ endpoint: item.endpoint, keys: { p256dh: item.p256dh, auth: item.auth } }));
    const results = await Promise.allSettled(subscriptions.map((subscription) => webpush.sendNotification(subscription, JSON.stringify(payload))));
    return { sent: results.filter((item) => item.status === 'fulfilled').length };
  }
  async sendToUser(userId: string, payload: PushPayload) {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return { sent: 0, skipped: true };
    const { data, error } = await getSupabaseAdminClient().from('push_subscriptions').select('endpoint,p256dh,auth').eq('user_id', userId);
    if (error) throw new Error(`Gagal mengambil push subscription user: ${error.message}`);
    const subscriptions = (data ?? []).map((item) => ({ endpoint: item.endpoint, keys: { p256dh: item.p256dh, auth: item.auth } }));
    const results = await Promise.allSettled(subscriptions.map((subscription) => webpush.sendNotification(subscription, JSON.stringify(payload))));
    return { sent: results.filter((item) => item.status === 'fulfilled').length };
  }
  sendLowStock(name: string, quantity: number) {
    return this.send({ title: 'Stok obat menipis', body: `${name} tersisa ${quantity}.`, url: '/app/medicines', tag: 'low-stock' });
  }
}
