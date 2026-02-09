# Foreign Stock Predictor

Predicts restock times for foreign items in Torn City using historical data analysis.

## Setup

1.  **Install Requirements**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Database**:
    Ensure PostgreSQL is running and apply the schema:
    ```bash
    psql -U your_user -d your_db -f schema.sql
    ```

3.  **Environment Variables**:
    Create `.env` (or export variables):
    ```ini
    POSTGRES_DSN="postgresql://user:password@localhost/torn_db"
    DISCORD_BOT_TOKEN="your_discord_token"
    DISCORD_CHANNEL_ID="1234567890"
    ```

## Usage

1.  **Start Ingestor**:
    Runs in the background to fetch YATA data every minute.
    ```bash
    python ingestor.py
    ```

2.  **Start Bot**:
    Runs the Discord bot to alert users.
    ```bash
    python bot.py
    ```

## Logic
Restock prediction is based on the formula:
`Next Restock = Last Sold Out Time + (Duration of Last Stock / 2)`
Results are rounded to the nearest 15-minute interval.
