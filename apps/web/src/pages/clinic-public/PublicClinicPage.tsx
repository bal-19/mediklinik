import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { clinicService } from '../../services/api-services';
import { QueryState } from '../../components/shared/Page';

export function PublicClinicPage() {
  const slug = useParams().slug ?? '';
  const clinic = useQuery({ queryKey: ['public-clinic', slug], queryFn: () => clinicService.public(slug) });
  const doctors = useQuery({ queryKey: ['public-doctors', slug], queryFn: () => clinicService.doctors(slug) });
  if (clinic.isLoading || clinic.error) return <main className="public-shell"><QueryState isLoading={clinic.isLoading} error={clinic.error} /></main>;
  const active = clinic.data && ['TRIAL', 'ACTIVE'].includes(clinic.data.subscriptionStatus) && clinic.data.isPublicPageVisible;
  return <main className="public-shell"><Helmet><title>{clinic.data?.name} | MediKlinik</title><meta name="description" content={clinic.data?.description} /></Helmet><header><a className="brand" href="/">Medi<span>Klinik</span></a><span className="badge">{active ? 'Buka untuk antrian' : 'Layanan nonaktif'}</span></header><section className="clinic-hero"><p className="eyebrow">Halaman resmi klinik</p><h1>{clinic.data?.name}</h1><p className="lead">{clinic.data?.description}</p><p>{clinic.data?.address} · {clinic.data?.phone}</p>{active ? <Link className="button" to={`/klinik/${slug}/login`}>Daftar Antrian</Link> : <div className="panel danger">Layanan online klinik sedang tidak aktif. Silakan hubungi klinik melalui telepon.</div>}</section><section className="section"><h2>Dokter dan jadwal praktik</h2><div className="cards">{doctors.data?.map((doctor) => <article key={doctor.id}><h3>{doctor.name}</h3><p>{doctor.specialization}</p><small>{doctor.practiceSchedule.join(', ')}</small></article>)}</div></section></main>;
}
