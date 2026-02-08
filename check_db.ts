import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        // Query the SchedulerLog table
        const logs = await prisma.schedulerLog.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('--- Recent Scheduler Logs ---');
        console.dir(logs, { depth: null });
        console.log('-----------------------------');
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
