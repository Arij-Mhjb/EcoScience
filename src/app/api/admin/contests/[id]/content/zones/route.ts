// GET + POST /api/admin/contests/[id]/content/zones
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const zones = await prisma.zone.findMany({
    where: { contestId: params.id },
    include: { _count: { select: { questions: true, challenges: true } } },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ zones });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { title, titleFr, description, descriptionFr, icon, order } = await req.json();
    if (!title) return NextResponse.json({ error: 'Titre requis' }, { status: 400 });

    const zone = await prisma.zone.create({
      data: { 
        title, 
        titleFr, 
        description: description || '', 
        descriptionFr, 
        icon: icon || '📍', 
        order: order || 0, 
        contestId: params.id 
      },
    });

    return NextResponse.json({ zone }, { status: 201 });
  } catch (error) {
    console.error('Create zone error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
