import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';

/**
 * Script Name: Backfill Attacks
 * Intent: utility to fetch historical attack logs from Torn API starting from a specific date.
 *         Useful for populating the DB with past data for analysis.
 */


dotenv.config();

const prisma = new PrismaClient();

// Default Start: Jan 1, 2026 UTC
const DEFAULT_START_DATE = new Date('2026-01-01T00:00:00Z');
const DEFAULT_MIN_TIMESTAMP = Math.floor(DEFAULT_START_DATE.getTime() / 1000);

async function main() {
    const apiKey = process.env.TORN_API_KEY;
    if (!apiKey) {
        console.error('Error: TORN_API_KEY not found in .env');
        process.exit(1);
    }

    const args = process.argv.slice(2);
    let minTimestamp = DEFAULT_MIN_TIMESTAMP;

    // Optional override: --timestamp <unix_timestamp>
    const tsIndex = args.indexOf('--timestamp');
    if (tsIndex !== -1 && args[tsIndex + 1]) {
        minTimestamp = parseInt(args[tsIndex + 1]);
    }

    console.log(`[Backfill] Starting backfill.`);
    console.log(`[Backfill] Target Start Date: ${new Date(minTimestamp * 1000).toISOString()} (TS: ${minTimestamp})`);

    await fetchRecursive(apiKey, minTimestamp);
}

async function fetchRecursive(apiKey: string, minTimestamp: number, toTimestamp?: number) {
    let url = `https://api.torn.com/v2/faction/attacks?key=${apiKey}&limit=100&sort=desc`;
    if (toTimestamp) {
        url += `&to=${toTimestamp}`;
    }
    // 'from' helps the API filter, though we also check manually to stop
    url += `&from=${minTimestamp}`;

    console.log(`[Backfill] Fetching: ${url}`);

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.error) {
            console.error('[Backfill] API Error:', data.error);
            return;
        }

        const attacks = data.attacks || [];
        if (attacks.length === 0) {
            console.log('[Backfill] No attacks found in this batch.');
            return;
        }

        console.log(`[Backfill] Processing ${attacks.length} attacks...`);
        let upsertedCount = 0;

        for (const attack of attacks) {
            const safeFloat = (val: any) => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

            const attackData = {
                id: attack.id,
                code: attack.code,
                startedAt: new Date(attack.started * 1000),
                endedAt: new Date(attack.ended * 1000),
                startedTimestamp: attack.started,
                endedTimestamp: attack.ended,
                result: attack.result,
                stealthed: !!attack.is_stealthed,
                respectGain: safeFloat(attack.respect_gain),
                respectLoss: safeFloat(attack.respect_loss),
                chain: attack.chain || 0,
                raid: !!attack.is_raid,
                rankedWar: !!attack.is_ranked_war,
                fairFight: safeFloat(attack.modifiers?.fair_fight || 1),
                attackerId: attack.attacker?.id || null,
                attackerName: attack.attacker?.name || null,
                attackerFactionId: attack.attacker?.faction?.id || null,
                attackerFactionName: attack.attacker?.faction?.name || null,
                defenderId: attack.defender?.id || null,
                defenderName: attack.defender?.name || null,
                defenderFactionId: attack.defender?.faction?.id || null,
                defenderFactionName: attack.defender?.faction?.name || null,

                modWar: safeFloat(attack.modifiers?.war),
                modRetaliation: safeFloat(attack.modifiers?.retaliation),
                modGroup: safeFloat(attack.modifiers?.group),
                modOverseas: safeFloat(attack.modifiers?.overseas),
                modChain: safeFloat(attack.modifiers?.chain),
                modWarlord: safeFloat(attack.modifiers?.warlord),
                modifiers: attack.modifiers || {},
            };

            await prisma.factionAttack.upsert({
                where: { id: attack.id },
                update: attackData,
                create: attackData,
            });
            upsertedCount++;
        }
        console.log(`[Backfill] Upserted ${upsertedCount} attacks.`);

        const oldestAttack = attacks[attacks.length - 1];

        // If the batch's oldest attack is still newer than our target start date, verify we have more pages
        if (oldestAttack.started > minTimestamp) {
            if (data._metadata && data._metadata.links && data._metadata.links.prev) {
                const prevLink = data._metadata.links.prev;
                const nextToMatch = prevLink.match(/to=(\d+)/);
                const nextToVal = nextToMatch ? parseInt(nextToMatch[1]) : oldestAttack.started;

                // Rate limit safety
                await new Promise(r => setTimeout(r, 500));

                await fetchRecursive(apiKey, minTimestamp, nextToVal);
            } else {
                console.log('[Backfill] No previous link (end of data). Stopping.');
            }
        } else {
            console.log(`[Backfill] Reached limit (${oldestAttack.started} <= ${minTimestamp}). Sync complete.`);
        }

    } catch (error) {
        console.error('[Backfill] Request failed:', error);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
