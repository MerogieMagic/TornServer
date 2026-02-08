
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Refactored Fields...');

    // Get a recent attack that likely has modifiers and faction info
    const sample = await prisma.factionAttack.findFirst({
        where: {
            OR: [
                { modWar: { gt: 0 } },
                { modChain: { gt: 0 } },
                { attackerFactionName: { not: null } }
            ]
        },
        orderBy: { startedAt: 'desc' }
    });

    if (sample) {
        console.log('Masked Sample Attack:');
        console.log(`ID: ${sample.id}`);
        console.log(`Attacker Faction: ${sample.attackerFactionName} (ID: ${sample.attackerFactionId})`);
        console.log(`Defender Faction: ${sample.defenderFactionName} (ID: ${sample.defenderFactionId})`);
        console.log('--- Flattened Modifiers ---');
        console.log(`War: ${sample.modWar}`);
        console.log(`Retaliation: ${sample.modRetaliation}`);
        console.log(`Group: ${sample.modGroup}`);
        console.log(`Chain: ${sample.modChain}`);
        console.log(`Fair Fight: ${sample.fairFight}`); // Native column

        if (sample.attackerFactionName || sample.defenderFactionName) {
            console.log('VERIFICATION: Faction Names Present ✅');
        } else {
            console.log('VERIFICATION: Faction Names MISSING ❌');
        }
    } else {
        console.log('No attacks with interesting data found yet (script still running?).');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
