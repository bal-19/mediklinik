import { useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { medicineService } from '../../services/api-services';

export function MedicinesPage() {
  const query = useQuery({ queryKey: ['medicines'], queryFn: medicineService.list });
  const lowStock = query.data?.filter((item) => item.stockQuantity <= item.minStockAlert) ?? [];

  return (
    <Page
      eyebrow="Apotek"
      title="Stok Obat dan Alert Minimum"
      description="Pantau obat aktif, unit tersisa, dan item yang perlu restock tanpa kehilangan konteks harga jual."
      action={<button>Catat stok masuk</button>}
    >
      <QueryState isLoading={query.isLoading} error={query.error} />

      <div className="stat-grid compact">
        <article>
          <span>Total item aktif</span>
          <strong>{query.data?.length ?? 0}</strong>
        </article>
        <article>
          <span>Perlu restock</span>
          <strong>{lowStock.length}</strong>
        </article>
        <article>
          <span>Unit kritis tertinggi</span>
          <strong>{lowStock[0]?.name ?? '-'}</strong>
        </article>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Daftar obat</p>
            <h2>Persediaan yang tersedia di klinik</h2>
          </div>
        </div>

        <div className="entity-list">
          {query.data?.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  Harga jual Rp {item.sellPrice.toLocaleString('id-ID')} / {item.unit}
                </p>
              </div>
              <div className="entity-meta">
                <strong className={item.stockQuantity <= item.minStockAlert ? 'danger-text' : ''}>
                  {item.stockQuantity} {item.unit}
                </strong>
                <span className={`status-pill ${item.stockQuantity <= item.minStockAlert ? 'tone-warning' : 'tone-success'}`}>
                  {item.stockQuantity <= item.minStockAlert ? 'LOW_STOCK' : 'AMAN'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
