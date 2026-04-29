// API — Progression utilisateur (zones complétées + XP)
// GET : récupérer progression / POST : sauvegarder complétion zone
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const userId = (session.user as { id?: string }).id;
    if (!userId) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    // Récupérer les zones complétées depuis les participations
    const participations = await prisma.participation.findMany({
      where: { userId },
      select: { completedZones: true },
    });
    const completedZones = participations.flatMap(p => p.completedZones);

    return NextResponse.json({ ...user, completedZones });
  } catch (error) {
    console.error('Erreur GET progress:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const userId = (session.user as { id?: string }).id;
    if (!userId) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const { zoneId, xpEarned, contestId } = await request.json();
    if (!zoneId || xpEarned === undefined) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });

    const newXP = user.xp + xpEarned;
    const newLevel = Math.floor(newXP / 100) + 1;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { xp: newXP, level: newLevel },
      select: { xp: true, level: true },
    });

    // Mettre à jour la participation si contestId fourni
    if (contestId) {
      const participation = await prisma.participation.findFirst({ where: { userId, contestId } });
      
      if (!participation) {
        // Créer si inexistant
        await prisma.participation.create({
          data: {
            userId,
            contestId,
            completedZones: [zoneId],
            status: 'in_progress',
            score: 0,
            timeSpent: 0,
            errors: 0
          }
        });
      } else if (!participation.completedZones.includes(zoneId)) {
        // Mettre à jour si existant
        await prisma.participation.update({
          where: { id: participation.id },
          data: {
            completedZones: [...participation.completedZones, zoneId],
            status: 'in_progress',
            startedAt: participation.startedAt ?? new Date(),
          },
        });
      }
    }

    return NextResponse.json({ ...updatedUser, completedZones: [zoneId] });
  } catch (error) {
    console.error('Erreur POST progress:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
