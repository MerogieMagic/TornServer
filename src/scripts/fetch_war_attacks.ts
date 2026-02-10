
// @ts-nocheck
/**
 * Script Name: Fetch War Attacks
 * Intent: Targeted fetcher for a specific time range (Default: 2026). 
 *         Used to fill gaps or get data for a specific war period.
 */
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const API_KEY = process.env.TORN_API_KEY;

// Default: Fetch from start of 2026 (1767225600) to now/end of 2026 (1798761600)
const START_2026 = 1767225600;
const END_2026 = 1798761600;

// Read args: --from <timestamp> --to <timestamp>
const args = process.argv.slice(2);
const fromArgIndex = args.indexOf('--from');
const toArgIndex = args.indexOf('--to');

const START_TIMESTAMP = fromArgIndex !== -1 ? parseInt(args[fromArgIndex + 1]) : START_2026;
const END_TIMESTAMP = toArgIndex !== -1 ? parseInt(args[toArgIndex + 1]) : END_2026;

/**
 * @param {number} [toTimestamp]
 */
async function fetchAttacksRecursive(toTimestamp = END_TIMESTAMP) {
    let url = `https://api.torn.com/v2/faction/attacks?key=${API_KEY}&limit=100&sort=desc`;
    if (toTimestamp) {
        url += `&to=${toTimestamp}`;
    }
    url += `&from=${START_TIMESTAMP}`;

    console.log(`Fetching: ${url}`);

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.error) {
            console.error('API Error:', data.error);
            return;
        }

        const attacks = data.attacks || [];
        if (attacks.length === 0) {
            console.log('No more attacks found.');
            return;
        }

        console.log(`Received ${attacks.length} attacks. Processing batch...`);

        // PROCESS BATCH IMMEDIATELY
        let upsertedCount = 0;
        for (const attack of attacks) {
            const safeFloat = (val) => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

            // Map data to DB structure
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

                // Flattened Modifiers
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
        console.log(`Batch of ${upsertedCount} upserted.`);

        // Filter out attacks older than START_TIMESTAMP if needed
        const oldestAttack = attacks[attacks.length - 1];

        // Recursion Logic
        if (data._metadata && data._metadata.links && data._metadata.links.prev) {
            if (oldestAttack.started > START_TIMESTAMP) {
                const prevLink = data._metadata.links.prev;
                const nextToMatch = prevLink.match(/to=(\d+)/);
                const nextToVal = nextToMatch ? parseInt(nextToMatch[1]) : oldestAttack.started;

                await new Promise(r => setTimeout(r, 1000)); // Rate limit safety
                return fetchAttacksRecursive(nextToVal);
            } else {
                console.log(`Reached start timestamp ${START_TIMESTAMP}. Stopping.`);
            }
        } else {
            console.log('No previous link in metadata. Stopping.');
        }

    } catch (error) {
        console.error('Request failed:', error);
    }
}

async function main() {
    if (!API_KEY) {
        console.error('TORN_API_KEY is missing in .env');
        return;
    }

    console.log(`Starting DB Import. Range: ${START_TIMESTAMP} -> ${END_TIMESTAMP}`);
    try {
        await fetchAttacksRecursive();
        console.log('Import complete.');
    } catch (e) {
        console.error('Import failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
