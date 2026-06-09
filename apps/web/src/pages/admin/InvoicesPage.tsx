import { useMutation, useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { invoiceService } from '../../services/api-services';

export function InvoicesPage() {
  const query = useQuery({ queryKey: ['invoices'], queryFn: invoiceService.list });
  const pay = useMutation({ mutationFn: invoiceService.payOnline, onSuccess: ({ redirectUrl }) => { if (redirectUrl) window.location.assign(redirectUrl); } });
  return <Page title="Invoice" description="Tagihan pasien dan status pembayaran dalam satu pandangan."><QueryState isLoading={query.isLoading} error={query.error} /><div className="list">{query.data?.map((invoice) => <article key={invoice.id}><div><strong>{invoice.id}</strong><p>{invoice.patientId}</p></div><strong>Rp {invoice.totalAmount.toLocaleString('id-ID')}</strong><span className="badge">{invoice.status}</span>{invoice.status !== 'PAID' && <button onClick={() => pay.mutate(invoice.id)}>Bayar online</button>}</article>)}</div></Page>;
}
