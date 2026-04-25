// GET + POST /api/admin/contests/[id]/content/capsules
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const capsules = await prisma.capsule.findMany({
    where: { contestId: params.id },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ capsules });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { title, titleFr, description, descriptionFr, videoUrl, duration, turtleMsg, turtleMsgFr, order } = await req.json();
    if (!title || !videoUrl) return NextResponse.json({ error: 'Titre et URL vidéo requis' }, { status: 400 });

    const capsule = await prisma.capsule.create({
      data: { 
        title, 
        titleFr, 
        description: description || '', 
        descriptionFr, 
        videoUrl, 
        duration: duration || 0, 
        turtleMsg: turtleMsg || '', 
        turtleMsgFr, 
        order: order || 0, 
        contestId: params.id 
      },
    });

    return NextResponse.json({ capsule }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
