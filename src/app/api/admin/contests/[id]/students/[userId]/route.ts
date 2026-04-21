// DELETE /api/admin/contests/[id]/students/[userId] — retirer un élève
// POST   /api/admin/contests/[id]/students/[userId] — reset progression
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function DELETE(req: Request, { params }: { params: { id: string; userId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await prisma.participation.deleteMany({
    where: { contestId: params.id, userId: params.userId },
  });

  return NextResponse.json({ success: true });
}

export async function POST(req: Request, { params }: { params: { id: string; userId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { action } = await req.json();

    if (action === 'reset') {
      await prisma.participation.deleteMany({
        where: { contestId: params.id, userId: params.userId },
      });
      const created = await prisma.participation.create({
        data: {
          contestId: params.id,
          userId: params.userId,
          score: 0,
          timeSpent: 0,
          errors: 0,
          completedZones: [],
          quizAnswers: {},
          challengeAnswers: {},
          status: 'not_started',
        },
      });
      return NextResponse.json({ success: true, updated: created });
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch (error) {
    console.error('Contest student action error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
