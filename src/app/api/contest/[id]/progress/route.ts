import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const contestId = params.id;
    const { questionId, answer, questionText, timeSpent, completedZones, lastStep, score, errors } = await req.json();

    let participation = await prisma.participation.findFirst({ where: { userId, contestId } });

    let currentAnswers: Record<string, any> = {};
    let currentZones: string[] = [];

    if (participation) {
      if (participation.quizAnswers && typeof participation.quizAnswers === 'object' && !Array.isArray(participation.quizAnswers)) {
        currentAnswers = { ...participation.quizAnswers as Record<string, any> };
      } else if (Array.isArray(participation.quizAnswers)) {
         // Migration from old array format
         (participation.quizAnswers as any[]).forEach((ans: any) => {
            if (ans && ans.questionIndex !== undefined && ans.selectedAnswer !== undefined) {
               currentAnswers[String(ans.questionIndex)] = ans.selectedAnswer;
            }
         });
      }
      currentZones = participation.completedZones || [];
    }

    if (questionId !== undefined && answer !== undefined) {
      if (questionText) {
        currentAnswers[String(questionId)] = { answer, questionText };
      } else {
        currentAnswers[String(questionId)] = answer;
      }
    }

    if (completedZones && Array.isArray(completedZones)) {
      currentZones = Array.from(new Set([...currentZones, ...completedZones]));
    }

    if (participation) {
      participation = await prisma.participation.update({
        where: { id: participation.id },
        data: {
          quizAnswers: currentAnswers,
          completedZones: currentZones,
          timeSpent: timeSpent !== undefined ? timeSpent : participation.timeSpent,
          score: score !== undefined ? score : participation.score,
          errors: errors !== undefined ? errors : participation.errors,
          lastStep: lastStep || participation.lastStep,
          status: lastStep === 'results' ? 'completed' : 'in_progress',
          completedAt: lastStep === 'results' ? new Date() : participation.completedAt
        },
      });
    } else {
      participation = await prisma.participation.create({
        data: {
          userId,
          contestId,
          quizAnswers: currentAnswers,
          completedZones: currentZones,
          timeSpent: timeSpent || 0,
          score: score || 0,
          errors: errors || 0,
          lastStep: lastStep || 'animation',
          status: lastStep === 'results' ? 'completed' : 'in_progress',
          completedAt: lastStep === 'results' ? new Date() : null
        },
      });
    }

    return NextResponse.json({ success: true, progress: participation });
  } catch (error) {
    console.error('[PATCH /api/contest/[id]/progress]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
