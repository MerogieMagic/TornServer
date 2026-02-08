
// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Arguments: <StartDate (YYYY-MM-DD HH:mm:ss)> [AttackerFaction] [DefenderFaction]
const args = process.argv.slice(2);
const startDateStr = args[0] || '2026-02-05 14:00:00'; // Default per user request
const attackerFaction = args[1] || 'KitsuLand';
const defenderFaction = args[2] || 'Cortex';

async function main() {
    console.log(`Analyzing War: ${attackerFaction} vs ${defenderFaction}`);
    console.log(`Start Date: ${startDateStr}`);

    try {
        // Parse date for safety/validation
        const startDate = new Date(startDateStr);
        if (isNaN(startDate.getTime())) {
            throw new Error("Invalid Date Format. Use 'YYYY-MM-DD HH:mm:ss'");
        }

        const totalPayout = 750000000;

        const results = await prisma.$queryRaw`
            WITH Variables AS (
                SELECT 
                    750000000 as totalPayout,
                    24 as firstCapWindowHours,
                    200 as firstCapLimit,
                    6800 as factionCapLimit,
                    ${startDate} as warStartDate
            ),
            RawAttacks AS (
                SELECT 
                    id,
                    attackerName,
                    respectGain,
                    chain,
                    startedAt,
                    CASE 
                        WHEN chain IN (10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000) THEN 'CHAIN'
                        ELSE 'RESPECT' 
                    END as hitType,
                    -- Check First Window
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
            -- 1. Calculate Per-User Average (Pass 1)
            UserAverages AS (
                SELECT 
                    attackerName,
                    COUNT(CASE WHEN hitType = 'RESPECT' THEN 1 END) as respectHits,
                    SUM(CASE WHEN hitType = 'RESPECT' THEN respectGain ELSE 0 END) as baseRespect,
                    (SUM(CASE WHEN hitType = 'RESPECT' THEN respectGain ELSE 0 END) / NULLIF(COUNT(CASE WHEN hitType = 'RESPECT' THEN 1 END), 0)) as avgRespect
                FROM RawAttacks
                GROUP BY attackerName
            ),
            -- 2. Assign Scores to Hits
            ScoredHits AS (
                SELECT 
                    r.*,
                    u.avgRespect,
                    -- Calculated Score for INDIVIDUAL Running Total / Payout (Adjusted for Chain)
                    CASE 
                        WHEN r.hitType = 'RESPECT' THEN r.respectGain
                        WHEN r.hitType = 'CHAIN' THEN COALESCE(u.avgRespect, 0) 
                        ELSE 0
                    END as calculatedScore
                FROM RawAttacks r
                LEFT JOIN UserAverages u ON r.attackerName = u.attackerName
            ),
            -- 3. Faction Running Total (APPLIED FIRST)
            -- NOTE: Uses RAW respectGain (Actual Chain Value) as requested.
            FactionRunning AS (
                SELECT 
                    *,
                    SUM(respectGain) OVER (ORDER BY startedAt ASC) as factionRunningTotal
                FROM ScoredHits
            ),
            -- 4. Apply Faction Cap
            ValidFactionHits AS (
                SELECT *
                FROM FactionRunning
                WHERE (factionRunningTotal - respectGain) < (SELECT factionCapLimit FROM Variables)
            ),
            -- 5. Individual Running Total (APPLIED SECOND, on Remaining Hits)
            -- NOTE: Uses calculatedScore (Adjusted Chain Value) as requested.
            IndividualRunning AS (
                SELECT 
                    *,
                    CASE 
                        WHEN isFirstWindow = 1 
                        THEN SUM(calculatedScore) OVER (PARTITION BY attackerName, isFirstWindow ORDER BY startedAt ASC)
                        ELSE 0 
                    END as userWindowTotal
                FROM ValidFactionHits
            ),
            -- 6. Apply Individual Cap
            FinalValidHits AS (
                SELECT *
                FROM IndividualRunning
                WHERE 
                     (isFirstWindow = 0) OR
                     ((userWindowTotal - calculatedScore) < (SELECT firstCapLimit FROM Variables))
            ),
            -- 7. Final Aggregation
            Stats AS (
                SELECT
                    attackerName,
                    COUNT(*) as effectiveHits,
                    COUNT(CASE WHEN hitType = 'RESPECT' THEN 1 END) as respectHits,
                    SUM(CASE WHEN hitType = 'RESPECT' THEN respectGain ELSE 0 END) as baseRespect,
                    COUNT(CASE WHEN hitType = 'CHAIN' THEN 1 END) as chainHits
                FROM FinalValidHits
                GROUP BY attackerName
            ),
            AdjustedScores AS (
                SELECT 
                    attackerName,
                    effectiveHits,
                    (baseRespect + (chainHits * (baseRespect / NULLIF(respectHits, 0)))) as adjustedScore
                FROM Stats
            ),
            Totals AS (
                SELECT SUM(adjustedScore) as grandTotalScore FROM AdjustedScores
            )
            SELECT
                a.attackerName,
                a.effectiveHits,
                ROUND(a.adjustedScore, 2) as adjustedScore,
                ROUND((a.adjustedScore / t.grandTotalScore) * 100, 2) as contributionPercent,
                ROUND((a.adjustedScore / t.grandTotalScore) * v.totalPayout, 2) as estimatedPayout
            FROM AdjustedScores a, Totals t, Variables v
            ORDER BY a.adjustedScore DESC
        `;

        console.table(results.map(r => ({
            Attacker: r.attackerName,
            EffHits: Number(r.effectiveHits),
            AdjScore: Number(r.adjustedScore).toFixed(2),
            Percent: `${Number(r.contributionPercent).toFixed(2)}%`,
            Payout: Number(r.estimatedPayout).toLocaleString()
        })));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
