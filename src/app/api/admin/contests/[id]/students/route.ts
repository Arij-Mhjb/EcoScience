// GET /api/admin/contests/[id]/students — participants de CE concours
// POST — ajouter un élève existant à ce concours
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const participations = await prisma.participation.findMany({
    where: { contestId: params.id },
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true, xp: true, level: true } } },
    orderBy: [{ score: 'desc' }, { errors: 'asc' }, { timeSpent: 'asc' }],
  });

  return NextResponse.json({ participations });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 });

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Élève introuvable' }, { status: 404 });

    // Vérifier qu'il n'est pas déjà inscrit
    const existing = await prisma.participation.findFirst({
      where: { userId, contestId: params.id },
    });
    if (existing) return NextResponse.json({ error: 'Élève déjà inscrit à ce concours' }, { status: 409 });

    const participation = await prisma.participation.create({
      data: { userId, contestId: params.id, status: 'not_started' },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });

    return NextResponse.json({ participation }, { status: 201 });
  } catch (error) {
    console.error('Add student to contest error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
