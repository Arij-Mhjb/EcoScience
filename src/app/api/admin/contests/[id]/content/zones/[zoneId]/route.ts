// PATCH + DELETE /api/admin/contests/[id]/content/zones/[zoneId]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function PATCH(req: Request, { params }: { params: { id: string; zoneId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { title, description, icon, order } = await req.json();
    const zone = await prisma.zone.update({
      where: { id: params.zoneId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
      },
    });
    return NextResponse.json({ zone });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; zoneId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await prisma.question.deleteMany({ where: { zoneId: params.zoneId } });
  await prisma.visualChallenge.deleteMany({ where: { zoneId: params.zoneId } });
  await prisma.zone.delete({ where: { id: params.zoneId } });

  return NextResponse.json({ success: true });
}
