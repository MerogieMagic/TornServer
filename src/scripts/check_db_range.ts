
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.factionAttack.count();

    if (total === 0) {
        console.log('No attacks in DB.');
        return;
    }

    const oldest = await prisma.factionAttack.findFirst({
        orderBy: { startedAt: 'asc' }
    });

    const newest = await prisma.factionAttack.findFirst({
        orderBy: { startedAt: 'desc' }
    });

    console.log(`Total Attacks: ${total}`);
    console.log(`Oldest: ${oldest.startedAt.toISOString()} (TS: ${oldest.startedTimestamp})`);
    console.log(`Newest: ${newest.startedAt.toISOString()} (TS: ${newest.startedTimestamp})`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
