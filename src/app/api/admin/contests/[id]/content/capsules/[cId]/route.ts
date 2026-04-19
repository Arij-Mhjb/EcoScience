// PATCH + DELETE /api/admin/contests/[id]/content/capsules/[cId]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function PATCH(req: Request, { params }: { params: { id: string; cId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { title, description, videoUrl, duration, turtleMsg, order } = await req.json();
    const capsule = await prisma.capsule.update({
      where: { id: params.cId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
        ...(turtleMsg !== undefined && { turtleMsg }),
        ...(order !== undefined && { order }),
      },
    });
    return NextResponse.json({ capsule });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; cId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await prisma.capsule.delete({ where: { id: params.cId } });
  return NextResponse.json({ success: true });
}
