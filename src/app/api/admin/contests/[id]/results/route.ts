// GET /api/admin/contests/[id]/results — classement officiel
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const participations = await prisma.participation.findMany({
    where: { contestId: params.id },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: [{ score: 'desc' }, { errors: 'asc' }, { timeSpent: 'asc' }],
  });

  const ranked = participations.map((p, i) => ({
    rank: i + 1,
    userId: p.userId,
    firstName: p.user.firstName,
    lastName: p.user.lastName,
    email: p.user.email,
    score: p.score,
    timeSpent: p.timeSpent,
    errors: p.errors,
    status: p.status,
    completedZones: p.completedZones,
    quizAnswers: p.quizAnswers,
    challengeAnswers: p.challengeAnswers,
    completedAt: p.completedAt,
    startedAt: p.startedAt,
    participationId: p.id,
  }));

  return NextResponse.json({ results: ranked });
}
