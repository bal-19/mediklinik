import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { clinicService } from '../../services/api-services';
import { QueryState } from '../../components/shared/Page';

export function PublicClinicPage() {
  const slug = useParams().slug ?? '';
  const [searchParams] = useSearchParams();
  const clinic = useQuery({ queryKey: ['public-clinic', slug], queryFn: () => clinicService.public(slug) });
  const doctors = useQuery({ queryKey: ['public-doctors', slug], queryFn: () => clinicService.doctors(slug) });

  if (clinic.isLoading || clinic.error) {
    return (
      <main className="public-shell">
        <QueryState isLoading={clinic.isLoading} error={clinic.error} />
      </main>
    );
  }

  const active = clinic.data && ['TRIAL', 'ACTIVE'].includes(clinic.data.subscriptionStatus) && clinic.data.isPublicPageVisible;
  const queueRegistered = searchParams.get('registered') === '1';
  const openHours = Object.entries(clinic.data?.openHours ?? {});

  return (
    <main className="public-shell">
      <Helmet>
        <title>{clinic.data?.name} | MediKlinik</title>
        <meta name="description" content={clinic.data?.description} />
      </Helmet>

      <header>
        <a className="brand" href="/">
          Medi<span>Klinik</span>
        </a>
        <span className="badge">{active ? 'Buka untuk antrian' : 'Layanan nonaktif'}</span>
      </header>

      <section className="clinic-hero">
        <p className="eyebrow">Halaman resmi klinik</p>
        <h1>{clinic.data?.name}</h1>
        <p className="lead">{clinic.data?.description}</p>
        <p>{clinic.data?.address}</p>
        <p>{clinic.data?.phone}</p>

        {queueRegistered && <div className="context-banner success">Akun pasien berhasil dibuat dan nomor antrian Anda sudah didaftarkan.</div>}

        {active ? (
          <div className="actions">
            <Link className="button" to={`/klinik/${slug}/login`}>
              Daftar Antrian
            </Link>
            <Link className="ghost button" to={`/klinik/${slug}/login`}>
              Login Pasien
            </Link>
          </div>
        ) : (
          <div className="panel danger">Klinik ini sedang tidak tersedia. Silakan hubungi klinik melalui telepon untuk informasi lebih lanjut.</div>
        )}
      </section>

      <section className="section public-grid">
        <article className="panel">
          <h2>Jam operasional</h2>
          {openHours.length ? (
            <div className="hours-list">
              {openHours.map(([day, value]) => (
                <div key={day}>
                  <strong>{day}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Jam operasional akan diumumkan oleh klinik.</p>
          )}
        </article>
        <article className="panel">
          <h2>Dokter dan jadwal praktik</h2>
          <QueryState isLoading={doctors.isLoading} error={doctors.error} />
          <div className="cards doctor-cards">
            {doctors.data?.map((doctor) => (
              <article key={doctor.id}>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialization}</p>
                <small>{doctor.practiceSchedule.join(', ')}</small>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
