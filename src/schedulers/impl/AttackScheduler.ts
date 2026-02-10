
import { IScheduler } from '../IScheduler';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

/**
 * Script Name: AttackScheduler
 * Intent: Runs hourly to fetch the latest 100 attacks from the Torn API. 
 *         It handles duplicate detection and ensures our DB stays in sync with live data.
 */
const prisma = new PrismaClient();

export class AttackScheduler implements IScheduler {
    name: string = 'Attack Sync (Hourly)';
    intervalMs: number = 3600 * 1000; // 1 Hour
    enabled: boolean = true;

    async run(): Promise<void> {
        const apiKey = process.env.TORN_API_KEY;
        if (!apiKey) {
            console.error('[AttackScheduler] Skipped: No API Key.');
            return;
        }

        // Lookback window: 2 hours ago
        const now = Math.floor(Date.now() / 1000);
        const twoHoursAgo = now - (2 * 3600);

        console.log(`[AttackScheduler] Starting sync. Window: ${twoHoursAgo} -> ${now}`);

        await this.fetchRecursive(apiKey, twoHoursAgo);
    }

    private async fetchRecursive(apiKey: string, minTimestamp: number, toTimestamp?: number) {
        let url = `https://api.torn.com/v2/faction/attacks?key=${apiKey}&limit=100&sort=desc`;
        if (toTimestamp) {
            url += `&to=${toTimestamp}`;
        }
        // We technically don't need 'from' in the URL if we stop manually, 
        // but adding it helps the API filter early if supported.
        url += `&from=${minTimestamp}`;

        console.log(`[AttackScheduler] Fetching: ${url}`);

        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.error) {
                console.error('[AttackScheduler] API Error:', data.error);
                return;
            }

            const attacks = data.attacks || [];
            if (attacks.length === 0) {
                console.log('[AttackScheduler] No attacks found in this batch.');
                return;
            }

            console.log(`[AttackScheduler] Processing ${attacks.length} attacks...`);
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
                    attackerFactionName: attack.attacker?.faction?.name || null, // Added
                    defenderId: attack.defender?.id || null,
                    defenderName: attack.defender?.name || null,
                    defenderFactionId: attack.defender?.faction?.id || null,
                    defenderFactionName: attack.defender?.faction?.name || null, // Added

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
            console.log(`[AttackScheduler] Upserted ${upsertedCount} attacks.`);

            // Check if we need to recurse
            // Logic: If the oldest attack in this batch is STILL newer than our minTimestamp,
            // we need to fetch the next page (older attacks).
            const oldestAttack = attacks[attacks.length - 1];

            if (oldestAttack.started > minTimestamp) {
                // Check metadata for next link
                if (data._metadata && data._metadata.links && data._metadata.links.prev) {
                    const prevLink = data._metadata.links.prev;
                    const nextToMatch = prevLink.match(/to=(\d+)/);
                    // Use the link's 'to' or fall back to the last attack's timestamp
                    const nextToVal = nextToMatch ? parseInt(nextToMatch[1]) : oldestAttack.started;

                    // Small delay to be nice to API? 
                    // 1000ms is safe. Scheduler runs hourly anyway.
                    await new Promise(r => setTimeout(r, 1000));

                    await this.fetchRecursive(apiKey, minTimestamp, nextToVal);
                } else {
                    console.log('[AttackScheduler] No previous link (end of data). Stopping.');
                }
            } else {
                console.log(`[AttackScheduler] Reached limit (${oldestAttack.started} <= ${minTimestamp}). Sync complete.`);
            }

        } catch (error) {
            console.error('[AttackScheduler] Request failed:', error);
        }
    }
}
