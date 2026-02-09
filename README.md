# ⚔️ Torn City Faction Warfare Analytics
**Automated War Intelligence & Data Pipeline**

## Overview
A custom-built analytics engine designed to optimize faction warfare strategies in the MMORPG **Torn City**. This system consumes the Torn API to track real-time combat logs, member activity, and chain efficiency, transforming raw JSON streams into actionable strategic intelligence.

## Key Features
*   **API Ingestion Pipeline:** Automated fetching of faction attack logs with rate-limit handling (respecting Torn's API constraints).
*   **Data Persistence:** Normalized SQL database schema to store historical war data for trend analysis.
*   **Conflict Analytics:** Algorithms to calculate "Attacks Per Member," "Chain Sustainability," and "Retaliation Efficiency."
*   **Automated Reporting:** Generates JSON exports for external dashboard visualization.

## Tech Stack
*   **Core:** Node.js / TypeScript
*   **Database:** MySQL (managed via Prisma ORM)
*   **Integration:** REST API (Torn API v2)

## Installation

### 1. Clone the repo
```bash
git clone https://github.com/MerogieMagic/TornServer.git
cd TornServer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the root directory (you can use `.env.example` as a template if available, or see `PRODUCTION_SETUP.md`).

Add your credentials:
```ini
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
TORN_API_KEY="YOUR_API_KEY"
```
*(Note: Do NOT commit real keys!)*

### 4. Initialize Database
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Run
```bash
npm run dev
```
