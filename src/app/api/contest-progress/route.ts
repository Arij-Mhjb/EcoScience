// API — Progression par concours (migré de ContestProgress → Participation)
// GET  /api/contest-progress?contestId=xxx
// POST /api/contest-progress — sauvegarder score final
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const contestId = searchParams.get('contestId');
    if (!contestId) return NextResponse.json({ error: 'contestId manquant' }, { status: 400 });

    const userId = (session.user as { id: string }).id;

    const participation = await prisma.participation.findFirst({
      where: { userId, contestId },
    });

    // Retourner format compatible avec l'espace élève existant
    if (!participation) return NextResponse.json({ progress: null });

    return NextResponse.json({
      progress: {
        id: participation.id,
        userId: participation.userId,
        contestId: participation.contestId,
        score: participation.score,
        timeSpent: participation.timeSpent,
        errors: participation.errors,
        quizAnswers: participation.quizAnswers,
        challengeAnswers: participation.challengeAnswers,
        completedAt: participation.completedAt,
        completedZones: participation.completedZones,
        status: participation.status,
      },
    });
  } catch (error) {
    console.error('[GET /api/contest-progress]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { contestId, score, timeSpent, errors, quizAnswers, challengeAnswers, isComplete } = body;

    if (!contestId || score === undefined) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });

    const statusToSet = isComplete ? 'completed' : 'in_progress';

    let participation = await prisma.participation.findFirst({ where: { userId, contestId } });

    if (participation) {
      // Mettre à jour si meilleur score ou compléter
      if (score >= participation.score) {
        participation = await prisma.participation.update({
          where: { id: participation.id },
          data: {
            score,
            timeSpent: timeSpent ?? participation.timeSpent,
            errors: errors ?? participation.errors,
            quizAnswers: quizAnswers ?? participation.quizAnswers,
            challengeAnswers: challengeAnswers ?? participation.challengeAnswers,
            status: statusToSet,
            completedAt: isComplete ? new Date() : participation.completedAt,
          },
        });
      }
    } else {
      // Créer une participation si inexistante
      participation = await prisma.participation.create({
        data: {
          userId, contestId, score: score ?? 0, timeSpent: timeSpent ?? 0,
          errors: errors ?? 0, quizAnswers: quizAnswers ?? [],
          challengeAnswers: challengeAnswers ?? [], status: statusToSet,
          completedAt: isComplete ? new Date() : null,
        },
      });
    }

    return NextResponse.json({ success: true, progress: participation });
  } catch (error) {
    console.error('[POST /api/contest-progress]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
