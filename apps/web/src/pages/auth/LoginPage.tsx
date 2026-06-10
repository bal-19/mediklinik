import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import type { AuthSession } from '@mediklinik/types';
import { authService, clinicRegistrationService, clinicService, queueService } from '../../services/api-services';
import { useAuthStore } from '../../stores/auth-store';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid.'),
  password: z.string().min(6, 'Password minimal 6 karakter.'),
});

const clinicRegisterSchema = z.object({
  clinicName: z.string().min(3, 'Nama klinik wajib diisi.'),
  ownerName: z.string().min(3, 'Nama penanggung jawab wajib diisi.'),
  email: z.string().email('Email tidak valid.'),
  password: z.string().min(8, 'Password minimal 8 karakter.'),
});

const patientRegisterSchema = z.object({
  fullName: z.string().min(3, 'Nama pasien wajib diisi.'),
  email: z.string().email('Email tidak valid.'),
  password: z.string().min(8, 'Password minimal 8 karakter.'),
});

type LoginValues = z.infer<typeof loginSchema>;
type ClinicRegisterValues = z.infer<typeof clinicRegisterSchema>;
type PatientRegisterValues = z.infer<typeof patientRegisterSchema>;

export function LoginPage({ register = false }: { register?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const setSession = useAuthStore((state) => state.setSession);

  const publicClinic = useQuery({
    queryKey: ['auth-public-clinic', slug],
    queryFn: () => clinicService.public(slug ?? ''),
    enabled: Boolean(slug),
  });

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const clinicRegisterForm = useForm<ClinicRegisterValues>({
    resolver: zodResolver(clinicRegisterSchema),
    defaultValues: { clinicName: '', ownerName: '', email: '', password: '' },
  });
  const patientRegisterForm = useForm<PatientRegisterValues>({
    resolver: zodResolver(patientRegisterSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const finishClinicQueueFlow = async (session: AuthSession) => {
    setSession(session);
    if (slug && session.user.role === 'PATIENT') {
      await queueService.registerPublic(slug);
      navigate(`/klinik/${slug}?action=queue&registered=1`);
      return;
    }
    navigate(new URLSearchParams(location.search).get('redirect') ?? '/app/dashboard');
  };

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (session) => {
      await finishClinicQueueFlow(session);
    },
  });

  const clinicRegisterMutation = useMutation({
    mutationFn: clinicRegistrationService.register,
    onSuccess: () => {
      navigate('/login?registeredClinic=1');
    },
  });

  const patientRegisterMutation = useMutation({
    mutationFn: authService.registerPatient,
    onSuccess: async (session) => {
      await finishClinicQueueFlow(session);
    },
  });

  const isClinicContext = Boolean(slug);
  const pageTitle = isClinicContext ? `Masuk Pasien ${publicClinic.data?.name ?? 'Klinik'} | MediKlinik` : register ? 'Daftar Klinik | MediKlinik' : 'Masuk | MediKlinik';
  const intro = isClinicContext
    ? `Masuk atau buat akun pasien untuk mengambil antrian online di ${publicClinic.data?.name ?? 'klinik ini'}.`
    : register
      ? 'Aktifkan trial 14 hari untuk mulai mengelola operasional klinik secara digital.'
      : 'Masuk ke workspace klinik yang aman dan terisolasi.';

  return (
    <main className="auth-shell">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <section className="auth-card">
        <a className="brand" href="/">
          Medi<span>Klinik</span>
        </a>
        <div className="auth-copy">
          <p className="eyebrow">{isClinicContext ? 'Portal Pasien' : register ? 'Registrasi Klinik' : 'Portal Staff'}</p>
          <h1>{isClinicContext ? 'Daftar antrian tanpa antre di meja depan' : register ? 'Mulai trial klinik baru' : 'Selamat datang kembali'}</h1>
          <p>{intro}</p>
        </div>

        {isClinicContext && publicClinic.data && (
          <div className="context-banner">
            <strong>{publicClinic.data.name}</strong>
            <span>{publicClinic.data.address}</span>
          </div>
        )}

        {!register && (
          <form className="auth-form" onSubmit={loginForm.handleSubmit((values) => loginMutation.mutate(values))}>
            <label>
              Email
              <input {...loginForm.register('email')} placeholder={isClinicContext ? 'pasien@contoh.id' : 'admin@klinik.id'} />
            </label>
            <FormMessage message={loginForm.formState.errors.email?.message} />
            <label>
              Password
              <input type="password" {...loginForm.register('password')} placeholder="Masukkan password" />
            </label>
            <FormMessage message={loginForm.formState.errors.password?.message} />
            <FormMessage message={loginMutation.error instanceof Error ? loginMutation.error.message : undefined} />
            <button disabled={loginMutation.isPending}>{loginMutation.isPending ? 'Memproses...' : isClinicContext ? 'Masuk dan ambil antrian' : 'Masuk'}</button>
          </form>
        )}

        {register && (
          <form className="auth-form" onSubmit={clinicRegisterForm.handleSubmit((values) => clinicRegisterMutation.mutate(values))}>
            <label>
              Nama klinik
              <input {...clinicRegisterForm.register('clinicName')} placeholder="Klinik Sehat Sentosa" />
            </label>
            <FormMessage message={clinicRegisterForm.formState.errors.clinicName?.message} />
            <label>
              Nama penanggung jawab
              <input {...clinicRegisterForm.register('ownerName')} placeholder="dr. Siti Rahayu" />
            </label>
            <FormMessage message={clinicRegisterForm.formState.errors.ownerName?.message} />
            <label>
              Email login admin
              <input {...clinicRegisterForm.register('email')} placeholder="owner@klinik.id" />
            </label>
            <FormMessage message={clinicRegisterForm.formState.errors.email?.message} />
            <label>
              Password
              <input type="password" {...clinicRegisterForm.register('password')} placeholder="Minimal 8 karakter" />
            </label>
            <FormMessage message={clinicRegisterForm.formState.errors.password?.message} />
            <FormMessage message={clinicRegisterMutation.error instanceof Error ? clinicRegisterMutation.error.message : undefined} />
            <button disabled={clinicRegisterMutation.isPending}>{clinicRegisterMutation.isPending ? 'Membuat workspace...' : 'Buat trial 14 hari'}</button>
          </form>
        )}

        {isClinicContext && (
          <div className="auth-divider">
            <span>Belum punya akun pasien?</span>
          </div>
        )}

        {isClinicContext && publicClinic.data && (
          <form
            className="auth-form subtle"
            onSubmit={patientRegisterForm.handleSubmit((values) =>
              patientRegisterMutation.mutate({
                ...values,
                clinicId: publicClinic.data.id,
              }),
            )}
          >
            <label>
              Nama lengkap
              <input {...patientRegisterForm.register('fullName')} placeholder="Nama pasien" />
            </label>
            <FormMessage message={patientRegisterForm.formState.errors.fullName?.message} />
            <label>
              Email
              <input {...patientRegisterForm.register('email')} placeholder="pasien@contoh.id" />
            </label>
            <FormMessage message={patientRegisterForm.formState.errors.email?.message} />
            <label>
              Password
              <input type="password" {...patientRegisterForm.register('password')} placeholder="Minimal 8 karakter" />
            </label>
            <FormMessage message={patientRegisterForm.formState.errors.password?.message} />
            <FormMessage message={patientRegisterMutation.error instanceof Error ? patientRegisterMutation.error.message : undefined} />
            <button disabled={patientRegisterMutation.isPending}>{patientRegisterMutation.isPending ? 'Membuat akun...' : 'Buat akun pasien dan ambil antrian'}</button>
          </form>
        )}

        <p className="auth-links">
          {register ? (
            <>
              Sudah punya workspace? <Link to="/login">Masuk sekarang</Link>
            </>
          ) : (
            <>
              Ingin membuka klinik baru? <Link to="/register">Mulai trial 14 hari</Link>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

function FormMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="form-message">{message}</p>;
}
