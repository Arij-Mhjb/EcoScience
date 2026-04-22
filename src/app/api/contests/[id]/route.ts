// API — GET /api/contests/[id] : Un concours avec ses zones
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: params.id },
      include: {
        zones: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!contest) {
      return NextResponse.json(
        { error: 'Concours non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(contest);
  } catch (error) {
    console.error('Erreur API contest:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du concours' },
      { status: 500 }
    );
  }
}
