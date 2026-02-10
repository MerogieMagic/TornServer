# Development Log & Project Manifest

**Last Updated:** 2026-02-10

## Project Overview
This repository hosts the backend infrastructure for **Torn City Utilities**. It currently supports two main verticals:
1.  **Faction Warfare Analytics (Node.js/TypeScript)**: Automated attack logging, chain monitoring, and respect calculation.
2.  **Foreign Stock Predictor (Python)**: Market analysis to predict travel run profitability.

## Environment Setup

### Development (Local)
*   **Run Command:** `npm run dev` (uses `nodemon` for hot reloading).
*   **Database:** Local MySQL instance or Docker container.
*   **Env Vars:** `.env` file with `DATABASE_URL` and `TORN_API_KEY`.
*   **Python:** Run scripts manually: `python foreign_stock/ingestor.py`.

### Production (Server)
*   **Run Command:** `npm start` (compiled JS) or use **PM2** (`pm2 start dist/index.js`).
*   **Database:** Managed MySQL/PostgreSQL (e.g., RDS, DigitalOcean).
*   **Env Vars:** Environment variables injected via CI/CD or secure vault.
*   **Python:** Systemd services or Docker containers for `ingestor.py` and `bot.py`.

## Feature Log

### ✅ Completed
*   **Core Scheduler System**: `SchedulerRunner` class to manage periodic tasks.
*   **War Analytics Engine**:
    *   `AttackScheduler`: Fetches attack logs every hour.
    *   `analyze_war.ts`: deeply analyzes war performance (Retaliation, Chain usage).
    *   `backfill_attacks.ts`: Historical data ingestion.
*   **Foreign Stock Predictor**:
    *   `ingestor.py`: YATA API consumer.
    *   `predictor.py`: Restock algorithm (Sold Out + Duration/2).
    *   `bot.py`: Discord bot for alerts.

### 🚧 In Progress / Planned
*   **Authentication**: Admin dashboard login.
*   **Frontend**: React/Next.js dashboard for visualizing war stats.

## Code Manifest & Intent

### 📂 src/schedulers
*   **`SchedulerRunner.ts`**: The main loop handler. It registers and ticks all schedulers.
*   **`impl/AttackScheduler.ts`**: **[CRITICAL]** Fetches 100 recent attacks from Torn API. Handles duplicate checking and db insertion.
*   **`impl/HelloWorldScheduler.ts`**: Reference implementation for testing scheduler logic.

### 📂 src/scripts (Utilities)
*   **`backfill_attacks.ts`**: **[ADMIN]** Run manually to fetch historical attacks from a specific date (default 2026-01-01).
*   **`analyze_war.ts`**: **[CORE]** Generates the "War Report" JSON. Calculates Fair Fight capping and individual contributions.
*   **`export_war_hits.ts`**: Exports raw hit data for CSV/Excel analysis.
*   **`fetch_war_attacks.ts`**: Targeted fetch for a specific war duration (start/end timestamps).
*   **`inspect_attacks.ts`**: Debug tool to view raw JSON of the last 5 DB entries.
*   **`verify_refactor.ts`**: Test script to ensure refactored code matches legacy output.

### 📂 foreign_stock (Python Module)
*   **`schema.sql`**: Postgres schema for stock logs.
*   **`ingestor.py`**: Pollard script (60s) for YATA API.
*   **`predictor.py`**: Pure logic function for calculating restock windows.
*   **`bot.py`**: Discord bot interface.
