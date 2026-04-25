// GET + POST /api/admin/contests/[id]/content/questions
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const zoneId = searchParams.get('zoneId');

  // Récupérer les zones du concours
  const zones = await prisma.zone.findMany({ where: { contestId: params.id }, select: { id: true } });
  const zoneIds = zones.map((z) => z.id);

  const questions = await prisma.question.findMany({
    where: { zoneId: zoneId ? zoneId : { in: zoneIds } },
    include: { zone: { select: { title: true } } },
    orderBy: [{ zoneId: 'asc' }, { order: 'asc' }],
  });

  return NextResponse.json({ questions });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await req.json();

    // Import batch JSON
    if (Array.isArray(body)) {
      const zones = await prisma.zone.findMany({ where: { contestId: params.id }, orderBy: { order: 'asc' } });
      const created = await Promise.all(
        body.map(async (q) => {
          const zone = q.zoneId ? zones.find((z) => z.id === q.zoneId)
            : q.zoneOrder !== undefined ? zones[q.zoneOrder - 1]
            : zones[0];
          if (!zone) throw new Error(`Zone introuvable pour la question: ${q.text}`);
          return prisma.question.create({
            data: { text: q.text, options: q.options, answer: q.answer, points: q.points || 3, tip: q.tip || '', order: q.order || 0, zoneId: zone.id },
          });
        })
      );
      return NextResponse.json({ questions: created, count: created.length }, { status: 201 });
    }

    // Création unique
    const { text, textFr, options, optionsFr, answer, points, tip, tipFr, order, zoneId } = body;
    if (!text || !options || answer === undefined || !zoneId) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: { 
        text, 
        textFr, 
        options, 
        optionsFr: optionsFr || [], 
        answer, 
        points: points || 3, 
        tip: tip || '', 
        tipFr, 
        order: order || 0, 
        zoneId 
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
