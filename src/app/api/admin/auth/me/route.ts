// GET /api/admin/auth/me
import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  return NextResponse.json({ admin });
}
