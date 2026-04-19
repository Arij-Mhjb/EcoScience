// Middleware Next.js — Protection des routes /admin/* (sauf /admin/login)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'ecoscience-admin-secret-2024'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Uniquement intercepter les routes admin
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // La page login est libre d'accès
  if (pathname === '/admin/login') return NextResponse.next();

  // Vérifier le cookie admin
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
