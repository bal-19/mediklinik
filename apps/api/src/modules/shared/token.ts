import type { JwtPayload, SubscriptionStatus } from '@mediklinik/types';

interface AccessTokenPayload extends JwtPayload {
  clinicId?: string;
  subscriptionStatus?: SubscriptionStatus;
}

export function createAccessToken(payload: AccessTokenPayload) {
  const header = {
    alg: 'none',
    typ: 'JWT',
  };

  return `${encodeSegment(header)}.${encodeSegment(payload)}.signature`;
}

export function parseAccessToken(token: string): AccessTokenPayload | null {
  const segments = token.split('.');
  const payloadSegment = segments[1];
  if (segments.length < 2 || !payloadSegment) {
    return null;
  }

  try {
    return JSON.parse(decodeSegment(payloadSegment)) as AccessTokenPayload;
  } catch {
    return null;
  }
}

function encodeSegment(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function decodeSegment(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}
