import { pushService } from '../services/api-services';

function urlBase64ToUint8Array(value: string) {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  return Uint8Array.from(atob((value + padding).replace(/-/g, '+').replace(/_/g, '/')), (char) => char.charCodeAt(0));
}

export function usePushNotification() {
  const subscribe = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Izin notifikasi tidak diberikan');
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''),
    });
    const json = subscription.toJSON();
    await pushService.subscribe({ endpoint: subscription.endpoint, keys: { p256dh: json.keys?.p256dh ?? '', auth: json.keys?.auth ?? '' } });
  };
  return { subscribe };
}
