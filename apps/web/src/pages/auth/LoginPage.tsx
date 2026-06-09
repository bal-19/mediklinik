import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { authService } from '../../services/api-services';
import { useAuthStore } from '../../stores/auth-store';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type LoginValues = z.infer<typeof schema>;

export function LoginPage({ register = false }: { register?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: 'admin@mediklinik.id', password: 'password' } });
  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      setSession(session);
      const target = slug ? `/klinik/${slug}?action=queue` : new URLSearchParams(location.search).get('redirect') ?? '/app/dashboard';
      navigate(target);
    },
  });
  return <main className="auth-shell"><Helmet><title>{register ? 'Daftar' : 'Masuk'} | MediKlinik</title></Helmet><form className="auth-card" onSubmit={form.handleSubmit((value) => mutation.mutate(value))}><a className="brand" href="/">Medi<span>Klinik</span></a><h1>{register ? 'Mulai trial klinik' : 'Selamat datang kembali'}</h1><p>Masuk ke workspace klinik yang aman dan terisolasi.</p><label>Email<input {...form.register('email')} /></label><label>Password<input type="password" {...form.register('password')} /></label>{mutation.error && <p className="danger-text">{mutation.error.message}</p>}<button disabled={mutation.isPending}>{mutation.isPending ? 'Memproses...' : register ? 'Daftar klinik' : 'Masuk'}</button></form></main>;
}
