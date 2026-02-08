
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Inspecting Faction Data ---');

        // Get all unique endpoints
        const endpoints = await prisma.factionRawData.groupBy({
            by: ['endpoint'],
        });

        console.log(`Found ${endpoints.length} unique endpoints.`);

        for (const ep of endpoints) {
            const record = await prisma.factionRawData.findFirst({
                where: { endpoint: ep.endpoint },
                orderBy: { createdAt: 'desc' }
            });

            if (record && record.data) {
                console.log(`\n=== Endpoint: ${ep.endpoint} ===`);
                console.log(`Hash: ${record.hash}`);
                console.log(`Sample Data Keys:`);
                printKeys(record.data);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

function printKeys(obj: any, prefix = '  ') {
    if (typeof obj !== 'object' || obj === null) return;

    // If array, print generic type if meaningful
    if (Array.isArray(obj)) {
        if (obj.length > 0) {
            console.log(`${prefix}[Array of Objects?] (Length: ${obj.length})`);
            // Print keys of first item if it's an object
            if (typeof obj[0] === 'object') {
                printKeys(obj[0], prefix + '  ');
            }
        } else {
            console.log(`${prefix}[Empty Array]`);
        }
        return;
    }

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        const type = Array.isArray(value) ? 'Array' : typeof value;

        let sample = '';
        if (type !== 'object' && type !== 'Array') {
            sample = ` (Sample: ${JSON.stringify(value).substring(0, 30)})`;
        }

        console.log(`${prefix}- ${key} (${type})${sample}`);

        if (type === 'object' && value !== null) {
            // Only recurse one level deep to avoid spam, or recurse if simple object
            // Let's recurse 1 level
            if (prefix.length < 6) {
                printKeys(value, prefix + '  ');
            }
        }
        if (type === 'Array' && value.length > 0 && typeof value[0] === 'object') {
            if (prefix.length < 6) {
                console.log(`${prefix}  [Item Schema]:`);
                printKeys(value[0], prefix + '    ');
            }
        }
    });
}

main();
