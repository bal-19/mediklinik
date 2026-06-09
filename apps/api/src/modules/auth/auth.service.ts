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
    const payload: JwtPayload = {
      sub: 'user_demo',
      email: input.email,
      role: 'ADMIN',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900,
    };

    return {
      accessToken: createAccessToken({
        ...payload,
        clinicId: 'clinic_demo',
        subscriptionStatus: 'TRIAL',
      }),
      refreshToken: `refresh_${payload.sub}`,
      user: {
        id: payload.sub,
        clinicId: 'clinic_demo',
        email: payload.email,
        fullName: 'Admin Demo',
        role: payload.role,
        subscriptionStatus: 'TRIAL',
      },
    };
  }

  register(input: RegisterInput): AuthSession {
    return {
      accessToken: createAccessToken({
        sub: 'user_new',
        email: input.email,
        role: input.role,
        clinicId: input.clinicId ?? 'clinic_new',
        subscriptionStatus: 'TRIAL',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      }),
      refreshToken: `refresh_${input.email}`,
      user: {
        id: 'user_new',
        clinicId: input.clinicId ?? 'clinic_new',
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
