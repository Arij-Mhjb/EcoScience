const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting...');
    await prisma.$connect();
    console.log('Connected successfully!');
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users.`);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
