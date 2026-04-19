// GET /api/admin/students  — tous les élèves avec participations
// POST — créer un élève (+ inscription optionnelle à des concours)
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: {
      participations: {
        include: { contest: { select: { id: true, title: true, icon: true, isActive: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { firstName, lastName, email, password, contestIds } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashed, plainPassword: password, xp: 0, level: 1 },
    });

    // Inscrire aux concours si fournis
    if (contestIds && Array.isArray(contestIds) && contestIds.length > 0) {
      await prisma.participation.createMany({
        data: contestIds.map((cId: string) => ({ userId: user.id, contestId: cId, status: 'not_started' })),
      });
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
