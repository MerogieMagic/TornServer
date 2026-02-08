
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.factionAttack.count();
    console.log(`Total Attacks in DB: ${count}`);

    const sample = await prisma.factionAttack.findFirst({
        orderBy: { startedAt: 'desc' }
    });

    if (sample) {
        console.log('Latest Attack Sample:');
        console.log(`ID: ${sample.id}`);
        console.log(`Code: ${sample.code}`);
        console.log(`StartedAt (DateTime): ${sample.startedAt.toISOString()}`);
        console.log(`StartedTimestamp (Int): ${sample.startedTimestamp}`);
        console.log(`EndedAt (DateTime): ${sample.endedAt.toISOString()}`);
        console.log(`EndedTimestamp (Int): ${sample.endedTimestamp}`);

        // Verification
        const derivedStart = Math.floor(sample.startedAt.getTime() / 1000);
        const match = derivedStart === sample.startedTimestamp;
        console.log(`Timestamp Match Verification: ${match ? 'PASS' : 'FAIL'} (${derivedStart} vs ${sample.startedTimestamp})`);
    } else {
        console.log('No attacks found in DB yet.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
