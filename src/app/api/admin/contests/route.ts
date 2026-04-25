// GET /api/admin/contests  — liste tous les concours avec stats
// POST /api/admin/contests — créer un nouveau concours
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const contests = await prisma.contest.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { participations: true, zones: true, capsules: true } },
      participations: {
        select: { score: true, status: true, timeSpent: true },
      },
    },
  });

  const result = contests.map((c) => {
    const parts = c.participations;
    const completed = parts.filter((p) => p.status === 'completed').length;
    const avgScore = parts.length ? Math.round(parts.reduce((a, b) => a + b.score, 0) / parts.length) : 0;
    const avgTime = parts.length ? Math.round(parts.reduce((a, b) => a + b.timeSpent, 0) / parts.length) : 0;
    const completionRate = parts.length ? Math.round((completed / parts.length) * 100) : 0;

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      image: c.image,
      icon: c.icon,
      order: c.order,
      isActive: c.isActive,
      isHidden: c.isHidden,
      durationMin: c.durationMin,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      participantCount: c._count.participations,
      zoneCount: c._count.zones,
      capsuleCount: c._count.capsules,
      avgScore,
      avgTime,
      completionRate,
    };
  });

  return NextResponse.json({ contests: result });
}

export async function POST(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, titleFr, description, descriptionFr, image, icon, order, durationMin } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Titre et description requis' }, { status: 400 });
    }

    const contest = await prisma.contest.create({
      data: {
        title,
        titleFr,
        description,
        descriptionFr,
        image: image || '/images/contest-default.svg',
        icon: icon || '🏆',
        order: order || 99,
        durationMin: durationMin || 120,
        isActive: false,
        isHidden: false,
      },
    });

    return NextResponse.json({ contest }, { status: 201 });
  } catch (error) {
    console.error('Create contest error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
