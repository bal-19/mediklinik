import { useMutation, useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { queryClient } from '../../lib/query-client';
import { invoiceService } from '../../services/api-services';

export function InvoicesPage() {
  const query = useQuery({ queryKey: ['invoices'], queryFn: invoiceService.list });
  const pay = useMutation({
    mutationFn: ({ id, amountPaid }: { id: string; amountPaid: number }) => invoiceService.markManualPaid(id, amountPaid),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const unpaid = query.data?.filter((invoice) => invoice.status !== 'PAID') ?? [];
  const paidTotal = query.data
    ?.filter((invoice) => invoice.status === 'PAID')
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0) ?? 0;

  return (
    <Page
      eyebrow="Keuangan"
      title="Invoice dan Status Pembayaran"
      description="Lihat tagihan pasien dan tandai pembayaran secara manual setelah dokter atau staf memastikan pasien sudah membayar."
    >
      <QueryState isLoading={query.isLoading} error={query.error} />

      <div className="stat-grid compact">
        <article>
          <span>Total invoice</span>
          <strong>{query.data?.length ?? 0}</strong>
        </article>
        <article>
          <span>Belum lunas</span>
          <strong>{unpaid.length}</strong>
        </article>
        <article>
          <span>Nilai lunas</span>
          <strong>Rp {paidTotal.toLocaleString('id-ID')}</strong>
        </article>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Daftar tagihan</p>
            <h2>Transaksi pasien yang perlu dipantau</h2>
          </div>
        </div>

        <div className="entity-list">
          {query.data?.map((invoice) => (
            <article key={invoice.id}>
              <div>
                <strong>{invoice.id}</strong>
                <p>Pasien ID: {invoice.patientId}</p>
              </div>
              <div className="entity-meta">
                <strong>Rp {invoice.totalAmount.toLocaleString('id-ID')}</strong>
                <span className={`status-pill ${getInvoiceTone(invoice.status)}`}>{invoice.status}</span>
                {invoice.status !== 'PAID' && (
                  <button onClick={() => pay.mutate({ id: invoice.id, amountPaid: invoice.totalAmount })}>
                    Tandai lunas manual
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}

function getInvoiceTone(status: string) {
  switch (status) {
    case 'PAID':
      return 'tone-success';
    case 'PARTIAL':
      return 'tone-warning';
    case 'VOID':
      return 'tone-muted';
    default:
      return 'tone-danger';
  }
}
