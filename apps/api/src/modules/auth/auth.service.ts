import type { AuthSession, DashboardUser, JwtPayload, Role, SubscriptionStatus } from '@mediklinik/types';
import { getSupabaseAdminClient } from '../shared/supabase-client';
import { createAccessToken } from '../shared/token';

interface AuthUserRow {
  id: string;
  clinic_id: string | null;
  email: string;
  password_hash: string;
  role: Role;
  is_active: boolean;
  profiles: { full_name: string | null } | Array<{ full_name: string | null }> | null;
  clinics:
    | {
        subscription_status: SubscriptionStatus;
      }
    | Array<{
        subscription_status: SubscriptionStatus;
      }>
    | null;
}

function getProfileFullName(profile: AuthUserRow['profiles']) {
  if (Array.isArray(profile)) {
    return profile[0]?.full_name ?? null;
  }

  return profile?.full_name ?? null;
}

function getClinicSubscriptionStatus(clinic: AuthUserRow['clinics']) {
  if (Array.isArray(clinic)) {
    return clinic[0]?.subscription_status ?? null;
  }

  return clinic?.subscription_status ?? null;
}

function mapRowToDashboardUser(row: AuthUserRow): DashboardUser {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    email: row.email,
    fullName: getProfileFullName(row.profiles) ?? row.email,
    role: row.role,
    subscriptionStatus: row.role === 'SUPER_ADMIN' ? 'ACTIVE' : (getClinicSubscriptionStatus(row.clinics) ?? 'TRIAL'),
  };
}

async function findSupabaseUserByEmail(email: string) {
  const { data, error } = await getSupabaseAdminClient()
    .from('users')
    .select('id, clinic_id, email, password_hash, role, is_active, profiles(full_name), clinics!users_clinic_id_fkey(subscription_status)')
    .eq('email', email)
    .maybeSingle<AuthUserRow>();

  if (error) {
    throw new Error(`Gagal mengambil user login: ${error.message}`);
  }

  return data;
}

async function findSupabaseUserById(userId: string) {
  const { data, error } = await getSupabaseAdminClient()
    .from('users')
    .select('id, clinic_id, email, password_hash, role, is_active, profiles(full_name), clinics!users_clinic_id_fkey(subscription_status)')
    .eq('id', userId)
    .maybeSingle<AuthUserRow>();

  if (error) {
    throw new Error(`Gagal mengambil user sesi: ${error.message}`);
  }

  return data;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  clinicId?: string;
}

export class AuthService {
  async login(input: LoginInput): Promise<AuthSession> {
    const row = await findSupabaseUserByEmail(input.email);
    if (!row || !row.is_active) {
      throw new Error('Email atau password tidak valid.');
    }

    const validPassword = await Bun.password.verify(input.password, row.password_hash);
    if (!validPassword) {
      throw new Error('Email atau password tidak valid.');
    }

    return this.createSession(mapRowToDashboardUser(row));
  }

  async register(input: RegisterInput): Promise<AuthSession> {
    if (input.role !== 'SUPER_ADMIN' && !input.clinicId) {
      throw new Error('clinicId wajib diisi untuk user tenant.');
    }

    const passwordHash = await Bun.password.hash(input.password, { algorithm: 'bcrypt' });
    const { data: user, error: userError } = await getSupabaseAdminClient()
      .from('users')
      .insert({
        clinic_id: input.role === 'SUPER_ADMIN' ? null : input.clinicId,
        email: input.email,
        password_hash: passwordHash,
        role: input.role,
        is_active: true,
      })
      .select('id, clinic_id, email, role')
      .single();

    if (userError || !user) {
      throw new Error(`Gagal membuat user: ${userError?.message ?? 'insert tidak mengembalikan data.'}`);
    }

    const { error: profileError } = await getSupabaseAdminClient().from('profiles').insert({
      user_id: user.id,
      full_name: input.fullName,
    });
    if (profileError) {
      await getSupabaseAdminClient().from('users').delete().eq('id', user.id);
      throw new Error(`Gagal membuat profil user: ${profileError.message}`);
    }

    return this.createSession({
      id: user.id,
      clinicId: user.clinic_id,
      email: user.email,
      fullName: input.fullName,
      role: user.role,
      subscriptionStatus: input.role === 'SUPER_ADMIN' ? 'ACTIVE' : 'TRIAL',
    });
  }

  async refresh(refreshToken: string): Promise<Pick<AuthSession, 'accessToken' | 'refreshToken'>> {
    const userId = parseRefreshToken(refreshToken);
    if (!userId) {
      throw new Error('Refresh token tidak valid.');
    }

    const row = await findSupabaseUserById(userId);
    if (!row || !row.is_active) {
      throw new Error('User sesi tidak ditemukan.');
    }

    const session = this.createSession(mapRowToDashboardUser(row));
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  private createSession(user: DashboardUser): AuthSession {
    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + 900,
    };

    return {
      accessToken: createAccessToken({
        ...payload,
        clinicId: user.clinicId ?? undefined,
        subscriptionStatus: user.subscriptionStatus,
      }),
      refreshToken: createRefreshToken(user.id),
      user,
    };
  }
}

function createRefreshToken(userId: string) {
  return `refresh_${userId}`;
}

function parseRefreshToken(refreshToken: string) {
  return refreshToken.startsWith('refresh_') ? refreshToken.slice('refresh_'.length) : null;
}
