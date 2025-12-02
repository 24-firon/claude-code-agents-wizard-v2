import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from 'jose';
import { env } from '../config/env';

const accessSecret = new TextEncoder().encode(env.JWT_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  projectId?: string;
}

export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(accessSecret);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, accessSecret);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      projectId: payload.projectId as string | undefined,
    };
  } catch {
    throw new Error('Invalid or expired access token');
  }
}

export async function verifyRefreshToken(token: string): Promise<string> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload.sub as string;
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
}
