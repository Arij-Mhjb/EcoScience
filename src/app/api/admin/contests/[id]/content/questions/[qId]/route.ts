// PATCH + DELETE /api/admin/contests/[id]/content/questions/[qId]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function PATCH(req: Request, { params }: { params: { id: string; qId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { text, options, answer, points, tip, order, zoneId } = await req.json();
    const question = await prisma.question.update({
      where: { id: params.qId },
      data: {
        ...(text !== undefined && { text }),
        ...(options !== undefined && { options }),
        ...(answer !== undefined && { answer }),
        ...(points !== undefined && { points }),
        ...(tip !== undefined && { tip }),
        ...(order !== undefined && { order }),
        ...(zoneId !== undefined && { zoneId }),
      },
    });
    return NextResponse.json({ question });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; qId: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await prisma.question.delete({ where: { id: params.qId } });
  return NextResponse.json({ success: true });
}
