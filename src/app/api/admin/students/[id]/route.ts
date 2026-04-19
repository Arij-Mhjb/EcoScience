// GET/PATCH/DELETE /api/admin/students/[id]
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      participations: {
        include: { contest: { select: { id: true, title: true, icon: true, isActive: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) return NextResponse.json({ error: 'Élève introuvable' }, { status: 404 });

  // Ne pas exposer le hash bcrypt — garder seulement plainPassword
  const { password: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { firstName, lastName, email, password } = await req.json();

    const data: Record<string, unknown> = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (email !== undefined) data.email = email;
    if (password) {
      data.password = await bcrypt.hash(password, 12);
      data.plainPassword = password; // stocker le nouveau mot de passe en clair
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
    });

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    await prisma.participation.deleteMany({ where: { userId: params.id } });
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
