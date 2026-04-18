// API — GET /api/contests : Liste tous les concours
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(contests);
  } catch (error) {
    console.error('Erreur API contests:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des concours' },
      { status: 500 }
    );
  }
}
