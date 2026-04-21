// PATCH + DELETE /api/admin/contests/[id]/content/challenges/[chId]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function PATCH(req: Request, { params }: { params: { id: string; chId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { title, type, items, points, order, zoneId } = await req.json();
    const challenge = await prisma.visualChallenge.update({
      where: { id: params.chId },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(items !== undefined && { items }),
        ...(points !== undefined && { points }),
        ...(order !== undefined && { order }),
        ...(zoneId !== undefined && { zoneId }),
      },
    });
    return NextResponse.json({ challenge });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; chId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await prisma.visualChallenge.delete({ where: { id: params.chId } });
  return NextResponse.json({ success: true });
}
