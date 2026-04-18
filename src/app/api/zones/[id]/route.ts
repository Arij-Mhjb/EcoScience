// API — GET /api/zones/[id] : Zone avec ses questions
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: params.id },
      include: {
        questions: true,
      },
    });

    if (!zone) {
      return NextResponse.json(
        { error: 'Zone non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(zone);
  } catch (error) {
    console.error('Erreur API zone:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de la zone' },
      { status: 500 }
    );
  }
}
