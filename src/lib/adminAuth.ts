// Utilitaires d'authentification Admin — JWT via cookies HTTP-only
// Séparé de NextAuth (session élève)

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'ecoscience-admin-secret-2024'
);

const COOKIE_NAME = 'admin_token';

export interface AdminPayload {
  adminId: string;
  email: string;
  name: string;
}

// Signer un token JWT admin
export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET);
}

// Vérifier et décoder un token JWT admin
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

// Récupérer l'admin depuis le cookie (server component)
export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// Récupérer l'admin (API routes & Server components)
export async function getAdminFromRequest(): Promise<AdminPayload | null> {
  return getAdminFromCookie();
}

export { COOKIE_NAME };
