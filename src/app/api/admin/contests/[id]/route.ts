// GET/PATCH/DELETE /api/admin/contests/[id]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const contest = await prisma.contest.findUnique({
    where: { id: params.id },
    include: {
      zones: { include: { questions: true, challenges: true }, orderBy: { order: 'asc' } },
      capsules: { orderBy: { order: 'asc' } },
      participations: {
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { score: 'desc' },
      },
    },
  });

  if (!contest) return NextResponse.json({ error: 'Concours introuvable' }, { status: 404 });

  // Calculer stats
  const parts = contest.participations;
  const completed = parts.filter((p) => p.status === 'completed').length;
  const avgScore = parts.length ? Math.round(parts.reduce((a, b) => a + b.score, 0) / parts.length) : 0;
  const avgTime = parts.length ? Math.round(parts.reduce((a, b) => a + b.timeSpent, 0) / parts.length) : 0;
  const completionRate = parts.length ? Math.round((completed / parts.length) * 100) : 0;

  // Question la plus ratée
  let hardestQuestion = null;
  const errorMap: Record<string, { text: string; errors: number; total: number }> = {};
  for (const p of parts) {
    if (p.quizAnswers && Array.isArray(p.quizAnswers)) {
      for (const qa of p.quizAnswers as { questionId: string; questionText: string; correct: boolean }[]) {
        if (!errorMap[qa.questionId]) {
          errorMap[qa.questionId] = { text: qa.questionText || qa.questionId, errors: 0, total: 0 };
        }
        errorMap[qa.questionId].total++;
        if (!qa.correct) errorMap[qa.questionId].errors++;
      }
    }
  }
  const sorted = Object.entries(errorMap).sort((a, b) => b[1].errors / b[1].total - a[1].errors / a[1].total);
  if (sorted.length > 0) {
    hardestQuestion = { text: sorted[0][1].text, errorRate: Math.round((sorted[0][1].errors / sorted[0][1].total) * 100) };
  }

  return NextResponse.json({
    contest,
    stats: { participantCount: parts.length, avgScore, avgTime, completionRate, completed, hardestQuestion },
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, image, icon, order, durationMin, isActive, isHidden } = body;

    const updated = await prisma.contest.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(durationMin !== undefined && { durationMin }),
        ...(isActive !== undefined && { isActive }),
        ...(isHidden !== undefined && { isHidden }),
      },
    });

    return NextResponse.json({ contest: updated });
  } catch (error) {
    console.error('Update contest error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    // Supprimer en cascade
    await prisma.participation.deleteMany({ where: { contestId: params.id } });
    await prisma.capsule.deleteMany({ where: { contestId: params.id } });

    const zones = await prisma.zone.findMany({ where: { contestId: params.id }, select: { id: true } });
    const zoneIds = zones.map((z) => z.id);

    await prisma.question.deleteMany({ where: { zoneId: { in: zoneIds } } });
    await prisma.visualChallenge.deleteMany({ where: { zoneId: { in: zoneIds } } });
    await prisma.zone.deleteMany({ where: { contestId: params.id } });
    await prisma.contest.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete contest error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
