# Schema Design: Faction Attacks (Final)

## Overview
Stores faction attack data directly (no raw intermediate table).
**Historical Start:** Jan 1, 2026.
**Fields:** Includes derived `DateTime` fields for start/end times.

## Table Structure

### Model: `FactionAttack`

| Column Name | SQL Type | Description |
|---|---|---|
| `id` | `INT PRIMARY KEY` | Torn Attack ID (e.g., `445657138`). |
| `code` | `VARCHAR(32) UNIQUE` | Unique attack code. |
| `startedAt` | `DATETIME NOT NULL` | Converted from API `started` timestamp. |
| `endedAt` | `DATETIME NOT NULL` | Converted from API `ended` timestamp. |
| `result` | `VARCHAR(50) NOT NULL` | Result (e.g., "Hospitalized"). |
| `stealthed` | `BOOLEAN DEFAULT FALSE` | `is_stealthed`. |
| `respectGain` | `FLOAT DEFAULT 0` | `respect_gain`. |
| `respectLoss` | `FLOAT DEFAULT 0` | `respect_loss`. |
| `chain` | `INT DEFAULT 0` | Chain hit number. |
| `raid` | `BOOLEAN DEFAULT FALSE` | `is_raid`. |
| `rankedWar` | `BOOLEAN DEFAULT FALSE` | `is_ranked_war`. |
| `fairFight` | `FLOAT DEFAULT 1` | Fair fight modifier. |
| `attackerId` | `INT NULL` | Attacker ID. |
| `attackerName` | `VARCHAR(255)` | Attacker Name (cached). |
| `attackerFactionId` | `INT NULL` | Attacker Faction ID. |
| `defenderId` | `INT NULL` | Defender ID. |
| `defenderName` | `VARCHAR(255)` | Defender Name (cached). |
| `defenderFactionId` | `INT NULL` | Defender Faction ID. |
| `modifiers` | `JSON` | Full modifiers object. |
| `updatedAt` | `DATETIME` | Internal DB update time. |

## Data Ingestion Strategy
1.  **Backfill:** One-time script to fetch all attacks from Jan 1, 2026 (`1767225600`) and insert them.
2.  **Scheduler:** Runs every 1-2 minutes.
    - Fetches the latest 100 attacks.
    - Upserts them into DB.
    - Stops when it finds an ID that already exists (or reaches the end of the list).
