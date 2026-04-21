const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const now = new Date();
    // Use raw query for MongoDB to update string dates to ISODate
    await prisma.$runCommandRaw({
      update: 'Participation',
      updates: [
        {
          q: { updatedAt: { $type: 'string' } },
          u: [ { $set: { updatedAt: { $toDate: "$updatedAt" } } } ],
          multi: true
        },
        {
          q: { updatedAt: null },
          u: { $set: { updatedAt: { $date: now.toISOString() } } },
          multi: true
        }
      ]
    });
    
    await prisma.$runCommandRaw({
      update: 'Contest',
      updates: [
        {
          q: { updatedAt: { $type: 'string' } },
          u: [ { $set: { updatedAt: { $toDate: "$updatedAt" } } } ],
          multi: true
        },
        {
          q: { updatedAt: null },
          u: { $set: { updatedAt: { $date: now.toISOString() } } },
          multi: true
        }
      ]
    });
    console.log('Successfully patched MongoDB documents with Date objects!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main().finally(() => prisma.$disconnect());
