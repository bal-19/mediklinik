import type { AuthSession, JwtPayload, Role } from '@mediklinik/types';

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
      accessToken: `access_${payload.sub}`,
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
      accessToken: `access_${input.email}`,
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
    return {
      accessToken: `${refreshToken}_rotated_access`,
      refreshToken: `${refreshToken}_rotated`,
    };
  }
}
