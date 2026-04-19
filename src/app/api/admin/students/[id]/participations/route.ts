// POST /api/admin/students/[id]/participations — inscrire à un concours
// DELETE — retirer d'un concours
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { contestId } = await req.json();
    if (!contestId) return NextResponse.json({ error: 'contestId requis' }, { status: 400 });

    const existing = await prisma.participation.findFirst({
      where: { userId: params.id, contestId },
    });
    if (existing) return NextResponse.json({ error: 'Déjà inscrit à ce concours' }, { status: 409 });

    const participation = await prisma.participation.create({
      data: { userId: params.id, contestId, status: 'not_started' },
    });

    return NextResponse.json({ participation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { contestId } = await req.json();
    if (!contestId) return NextResponse.json({ error: 'contestId requis' }, { status: 400 });

    await prisma.participation.deleteMany({
      where: { userId: params.id, contestId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
