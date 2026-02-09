import asyncpg
from datetime import datetime, timedelta
import math

async def get_db_connection(dsn: str):
    return await asyncpg.connect(dsn)

async def calculate_next_restock(conn, item_id: int, country_code: str):
    """
    Predicts the next restock time for a given item in a specific country.
    
    Logic:
    1. Find the most recent "Sold Out" event (Quantity goes from >0 to 0).
    2. Find the "Restock" event immediately preceding that (Quantity > 0).
    3. Duration = Time(Sold Out) - Time(Restock).
    4. Next Restock = Time(Sold Out) + (Duration / 2).
    5. Round to nearest 15 minutes.
    """
    
    # Fetch recent history (e.g., last 7 days) ordered by time DESC
    # We need enough history to find at least one full cycle (Restock -> Sold Out)
    rows = await conn.fetch('''
        SELECT recorded_at, quantity
        FROM foreign_stock_log
        WHERE item_id = $1 AND country_code = $2
        ORDER BY recorded_at DESC
        LIMIT 1000
    ''', item_id, country_code)

    if not rows or len(rows) < 2:
        return None

    last_sold_out_time = None
    prev_restock_time = None

    # Iterate backwards through history (DESC) to find the LATEST sold out event
    for i in range(len(rows) - 1):
        current = rows[i]
        next_row = rows[i+1] # This is chronologically earlier

        # Check for Sold Out Event: 
        # Current (newer) is 0, Previous (older) was > 0
        if current['quantity'] == 0 and next_row['quantity'] > 0:
            last_sold_out_time = current['recorded_at']
            
            # Now search further back for when it was stocked
            # We want the start of that stock cycle
            for j in range(i + 1, len(rows) - 1):
                stock_current = rows[j]     # Has stock
                stock_prev = rows[j+1]      # Is 0 (start of restock)
                
                if stock_current['quantity'] > 0 and stock_prev['quantity'] == 0:
                    prev_restock_time = stock_current['recorded_at']
                    break
            
            # If we found both, break the main loop
            if prev_restock_time:
                break
    
    if last_sold_out_time and prev_restock_time:
        duration = last_sold_out_time - prev_restock_time
        
        # Formula: Sold_Out + (Duration / 2)
        predicted_time = last_sold_out_time + (duration / 2)
        
        # Round to nearest 15 minutes
        # Timestamp logic
        ts = predicted_time.timestamp()
        rounded_ts = math.ceil(ts / 900) * 900
        rounded_dt = datetime.fromtimestamp(rounded_ts)
        
        return rounded_dt

    return None
