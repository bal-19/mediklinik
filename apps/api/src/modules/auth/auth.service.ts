import type { AuthSession, JwtPayload, Role } from '@mediklinik/types';
import { createAccessToken } from '../shared/token';

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
  login(input: LoginInput): AuthSession {
    const isSuperAdmin = input.email === 'superadmin@mediklinik.id';
    const payload: JwtPayload = {
      sub: 'user_demo',
      email: input.email,
      role: isSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900,
    };

    return {
      accessToken: createAccessToken({
        ...payload,
        clinicId: isSuperAdmin ? undefined : 'clinic_demo',
        subscriptionStatus: 'TRIAL',
      }),
      refreshToken: `refresh_${payload.sub}`,
      user: {
        id: payload.sub,
        clinicId: isSuperAdmin ? null : 'clinic_demo',
        email: payload.email,
        fullName: isSuperAdmin ? 'Super Admin Demo' : 'Admin Demo',
        role: payload.role,
        subscriptionStatus: 'TRIAL',
      },
    };
  }

  register(input: RegisterInput): AuthSession {
    const clinicId = input.role === 'SUPER_ADMIN' ? null : (input.clinicId ?? 'clinic_new');
    return {
      accessToken: createAccessToken({
        sub: 'user_new',
        email: input.email,
        role: input.role,
        clinicId: clinicId ?? undefined,
        subscriptionStatus: 'TRIAL',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      }),
      refreshToken: `refresh_${input.email}`,
      user: {
        id: 'user_new',
        clinicId,
        email: input.email,
        fullName: input.fullName,
        role: input.role,
        subscriptionStatus: 'TRIAL',
      },
    };
  }

  refresh(refreshToken: string): Pick<AuthSession, 'accessToken' | 'refreshToken'> {
    const now = Math.floor(Date.now() / 1000);
    return {
      accessToken: createAccessToken({
        sub: 'user_demo',
        email: 'admin@mediklinik.id',
        role: 'ADMIN',
        clinicId: 'clinic_demo',
        subscriptionStatus: 'TRIAL',
        iat: now,
        exp: now + 900,
      }),
      refreshToken: `${refreshToken}_rotated`,
    };
  }
}
