// GET + POST /api/admin/contests/[id]/content/challenges
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const zones = await prisma.zone.findMany({ where: { contestId: params.id }, select: { id: true } });
  const zoneIds = zones.map((z) => z.id);

  const challenges = await prisma.visualChallenge.findMany({
    where: { zoneId: { in: zoneIds } },
    include: { zone: { select: { title: true } } },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ challenges });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { title, type, items, points, order, zoneId } = await req.json();
    if (!title || !type || !zoneId) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });

    const challenge = await prisma.visualChallenge.create({
      data: { title, type, items: items || {}, points: points || 5, order: order || 0, zoneId },
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
