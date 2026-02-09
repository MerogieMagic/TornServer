import asyncio
import aiohttp
import asyncpg
import os
import time
from datetime import datetime, timezone

# Configuration
DB_DSN = os.getenv('POSTGRES_DSN', 'postgresql://user:password@localhost/torn_db')
YATA_URL = "https://yata.yt/api/v1/travel/export/"

async def ingest_stocks():
    print(f"[{datetime.now()}] Starting ingestion cycle...")
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(YATA_URL) as response:
                if response.status != 200:
                    print(f"Error fetching data: {response.status}")
                    return
                data = await response.json()
        except Exception as e:
            print(f"Request failed: {e}")
            return

    # Connect to DB
    try:
        conn = await asyncpg.connect(DB_DSN)
    except Exception as e:
        print(f"Database connection failed: {e}")
        return

    # Prepare insert batch
    records = []
    recorded_at = datetime.now(timezone.utc)

    # Data structure: stocks -> [country_code] -> stocks -> [list of items]
    stocks_data = data.get('stocks', {})
    
    for country_code, country_data in stocks_data.items():
        if not isinstance(country_data, dict): continue
        
        items = country_data.get('stocks', [])
        for item in items:
            # Item format: {'id': 123, 'name': 'Flower', 'quantity': 50, 'cost': 1000, ...}
            item_id = item.get('id')
            item_name = item.get('name')
            quantity = item.get('quantity', 0)
            cost = item.get('cost', 0)

            if item_id is not None:
                records.append((recorded_at, country_code, item_id, item_name, quantity, cost))

    if not records:
        print("No records parsed.")
        await conn.close()
        return

    try:
        await conn.executemany('''
            INSERT INTO foreign_stock_log (recorded_at, country_code, item_id, item_name, quantity, cost)
            VALUES ($1, $2, $3, $4, $5, $6)
        ''', records)
        print(f"Inserted {len(records)} records.")
    except Exception as e:
        print(f"Insertion failed: {e}")
    finally:
        await conn.close()

async def main():
    while True:
        start_time = time.time()
        await ingest_stocks()
        
        # Calculate time to sleep to maintain roughly 60s intervals
        elapsed = time.time() - start_time
        sleep_time = max(0, 60 - elapsed)
        await asyncio.sleep(sleep_time)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Ingestor stopped.")
