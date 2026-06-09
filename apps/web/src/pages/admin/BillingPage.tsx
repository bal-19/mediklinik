import { useMutation, useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { clinicService, subscriptionService } from '../../services/api-services';
import { usePushNotification } from '../../hooks/usePushNotification';
import { useState } from 'react';

export function BillingPage({ blocked = false }: { blocked?: boolean }) {
  const clinic = useQuery({ queryKey: ['clinic'], queryFn: clinicService.me });
  const status = useQuery({ queryKey: ['subscription'], queryFn: subscriptionService.status });
  const checkout = useMutation({ mutationFn: subscriptionService.checkout, onSuccess: ({ redirectUrl }) => { if (redirectUrl) window.location.assign(redirectUrl); } });
  const push = usePushNotification();
  const [serverKey, setServerKey] = useState('');
  const [clientKey, setClientKey] = useState('');
  const saveMidtrans = useMutation({ mutationFn: clinicService.saveMidtrans });
  return <Page title={blocked ? 'Akses workspace dijeda' : 'Billing dan Integrasi'} description={blocked ? 'Perpanjang paket untuk membuka kembali operasional klinik.' : 'Kelola paket, pembayaran, dan notifikasi browser.'}><QueryState isLoading={status.isLoading} error={status.error} />{status.data && <div className="stat-grid"><article><span>Status</span><strong>{status.data.status}</strong></article><article><span>Paket</span><strong>{status.data.plan}</strong></article><article><span>Sisa hari</span><strong>{status.data.daysRemaining}</strong></article></div>}<div className="panel actions"><button onClick={() => clinic.data && checkout.mutate({ clinicId: clinic.data.id, clinicSlug: clinic.data.slug, plan: clinic.data.subscriptionPlan, email: 'admin@mediklinik.id' })}>Perpanjang via Midtrans</button><button className="ghost" onClick={() => void push.subscribe()}>Aktifkan notifikasi</button></div>{!blocked && <form className="panel settings-form" onSubmit={(event) => { event.preventDefault(); saveMidtrans.mutate({ serverKey, clientKey }); }}><h2>Midtrans klinik</h2><p>Credential dienkripsi di backend dan tidak pernah dikirim kembali ke browser.</p><input type="password" placeholder="Server key" value={serverKey} onChange={(event) => setServerKey(event.target.value)} /><input placeholder="Client key" value={clientKey} onChange={(event) => setClientKey(event.target.value)} /><button>Simpan credential</button></form>}</Page>;
}
