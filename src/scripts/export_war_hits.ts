// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Arguments: <StartDate (YYYY-MM-DD HH:mm:ss)> [AttackerFaction] [DefenderFaction]
const args = process.argv.slice(2);
const startDateStr = args[0] || '2026-02-05 14:00:00';
const attackerFaction = args[1] || 'KitsuLand';
const defenderFaction = args[2] || 'Cortex';

async function main() {
    console.log(`Exporting Valid Hits: ${attackerFaction} vs ${defenderFaction}`);

    try {
        const startDate = new Date(startDateStr);
        if (isNaN(startDate.getTime())) throw new Error("Invalid Date");

        const results = await prisma.$queryRaw`
            WITH Variables AS (
                SELECT 
                    24 as firstCapWindowHours,
                    200 as firstCapLimit,
                    6800 as factionCapLimit,
                    ${startDate} as warStartDate
            ),
            WarAttacks AS (
                SELECT 
                    id,
                    attackerName,
                    defenderName,
                    respectGain,
                    chain,
                    startedAt,
                    modWar,
                    CASE 
                        WHEN chain IN (10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000) THEN 'CHAIN'
                        ELSE 'RESPECT' 
                    END as hitType,
                    CASE 
                        WHEN startedAt < DATE_ADD((SELECT warStartDate FROM Variables), INTERVAL (SELECT firstCapWindowHours FROM Variables) HOUR) 
                        THEN 1 ELSE 0 
                    END as isFirstWindow
                FROM FactionAttack
                JOIN Variables ON 1=1
                WHERE attackerFactionName = ${attackerFaction}
                  AND defenderFactionName = ${defenderFaction}
                  AND modWar > 0
                  AND startedAt >= (SELECT warStartDate FROM Variables)
            ),
            IndividualRunning AS (
                SELECT 
                    *,
                    CASE 
                        WHEN isFirstWindow = 1 
                        THEN SUM(respectGain) OVER (PARTITION BY attackerName, isFirstWindow ORDER BY startedAt ASC)
                        ELSE 0 
                    END as userWindowTotal
                FROM WarAttacks
            ),
            ValidIndividualHits AS (
                SELECT *
                FROM IndividualRunning
                WHERE 
                     (isFirstWindow = 0) OR
                     ((userWindowTotal - respectGain) < (SELECT firstCapLimit FROM Variables))
            ),
            FactionRunning AS (
                SELECT 
                    *,
                    SUM(respectGain) OVER (ORDER BY startedAt ASC) as factionRunningTotal
                FROM ValidIndividualHits
            ),
            FinalValidHits AS (
                SELECT *
                FROM FactionRunning
                WHERE (factionRunningTotal - respectGain) < (SELECT factionCapLimit FROM Variables)
            )
            SELECT 
                attackerName,
                defenderName,
                respectGain,
                hitType,
                chain,
                startedAt,
                isFirstWindow,
                userWindowTotal,
                factionRunningTotal
            FROM FinalValidHits
            ORDER BY startedAt ASC;
        `;

        console.table(results.map(r => ({
            Attacker: r.attackerName,
            Defender: r.defenderName,
            Respect: Number(r.respectGain),
            Type: r.hitType,
            Starts: r.startedAt.toISOString().replace('T', ' ').substring(0, 19),
            Win1: r.isFirstWindow ? 'Yes' : 'No',
            UserRun: Number(r.userWindowTotal).toFixed(2),
            FacRun: Number(r.factionRunningTotal).toFixed(2)
        })));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
