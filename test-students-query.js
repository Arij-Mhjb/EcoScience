const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const users = await prisma.user.findMany({
      include: {
        participations: {
          include: { contest: { select: { id: true, title: true, icon: true, isActive: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Success, found users:', users.length);
  } catch (err) {
    console.error('Error fetching users:', err.message);
  }
}
main().finally(() => prisma.$disconnect());
