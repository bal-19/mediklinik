import { useQuery } from '@tanstack/react-query';
import { Page, QueryState } from '../../components/shared/Page';
import { medicineService } from '../../services/api-services';

export function MedicinesPage() {
  const query = useQuery({ queryKey: ['medicines'], queryFn: medicineService.list });
  return <Page title="Stok Obat" description="Pantau stok dan batas minimum tanpa kehilangan jejak mutasi."><QueryState isLoading={query.isLoading} error={query.error} /><div className="list">{query.data?.map((item) => <article key={item.id}><div><strong>{item.name}</strong><p>Rp {item.sellPrice.toLocaleString('id-ID')} / {item.unit}</p></div><strong className={item.stockQuantity <= item.minStockAlert ? 'danger-text' : ''}>{item.stockQuantity} {item.unit}</strong><span className="badge">{item.stockQuantity <= item.minStockAlert ? 'Stok rendah' : 'Aman'}</span></article>)}</div></Page>;
}
