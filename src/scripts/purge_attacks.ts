
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Purging all FactionAttack data...');
    const result = await prisma.factionAttack.deleteMany({});
    console.log(`Deleted ${result.count} attacks.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
