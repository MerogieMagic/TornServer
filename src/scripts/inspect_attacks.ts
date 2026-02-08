
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Inspecting Faction Attacks Data ---');

        const record = await prisma.factionRawData.findFirst({
            where: { endpoint: 'attacks' },
            orderBy: { createdAt: 'desc' }
        });

        if (record && record.data) {
            console.log(`Hash: ${record.hash}`);
            console.log(`Sample Data Keys:`);
            const data: any = record.data;
            if (data.attacks) {
                // Attacks is an object with IDs as keys, or array?
                // V2 usually IDs as keys.
                console.log(`Type of data.attacks: ${typeof data.attacks}`);
                if (typeof data.attacks === 'object' && !Array.isArray(data.attacks)) {
                    const keys = Object.keys(data.attacks);
                    if (keys.length > 0) {
                        const firstKey = keys[0];
                        console.log(`Sample Attack ID: ${firstKey}`);
                        console.log(JSON.stringify(data.attacks[firstKey], null, 2));
                    }
                } else if (Array.isArray(data.attacks)) {
                    if (data.attacks.length > 0) {
                        console.log(JSON.stringify(data.attacks[0], null, 2));
                    }
                }
            } else {
                console.log('No "attacks" property found in data.');
                console.log(Object.keys(data));
            }
        } else {
            console.log('No attacks data found in DB.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
