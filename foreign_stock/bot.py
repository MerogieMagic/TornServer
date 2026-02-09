import discord
from discord.ext import commands, tasks
import os
import asyncpg
from datetime import datetime
from predictor import calculate_next_restock

# Configuration
TOKEN = os.getenv('DISCORD_BOT_TOKEN')
DB_DSN = os.getenv('POSTGRES_DSN', 'postgresql://user:password@localhost/torn_db')
CHANNEL_ID = int(os.getenv('DISCORD_CHANNEL_ID', '0'))

# Target Items to Watch
WATCH_LIST = [
    {'item_id': 206, 'country': 'haw', 'name': 'Xanax'},       # Example
    {'item_id': 20, 'country': 'haw', 'name': 'Shark Fin'},     # Requested Example
]

# Travel Times (Minutes) - Simplified
TRAVEL_TIMES = {
    'haw': 94, # Standard without buffs, example value
    'mex': 18,
    'cay': 25,
    'can': 29,
    'uk': 111,
    'arg': 114, 
    'swi': 123,
    'jap': 158,
    'chi': 168, 
    'uae': 192,
    'saf': 208
}

intents = discord.Intents.default()
bot = commands.Bot(command_prefix='/', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')
    check_stocks.start()

@tasks.loop(minutes=1)
async def check_stocks():
    channel = bot.get_channel(CHANNEL_ID)
    if not channel: return

    conn = await asyncpg.connect(DB_DSN)
    try:
        now = datetime.now()
        
        for target in WATCH_LIST:
            item_id = target['item_id']
            country = target['country']
            
            # Check current stock first
            row = await conn.fetchrow('''
                SELECT quantity, recorded_at FROM foreign_stock_log 
                WHERE item_id = $1 AND country_code = $2 
                ORDER BY recorded_at DESC LIMIT 1
            ''', item_id, country)
            
            current_qty = row['quantity'] if row else 0
            
            # Only predict if currently empty or low? 
            # Request says: Predict next restock window.
            if current_qty == 0:
                predicted = await calculate_next_restock(conn, item_id, country)
                
                if predicted:
                    travel_time = TRAVEL_TIMES.get(country, 0)
                    arrival_time = now + timedelta(minutes=travel_time + 5) # 5 min buffer
                    
                    # If the predicted restock is roughly when we would arrive
                    # Or if it's coming up soon
                    time_until_restock = (predicted - now).total_seconds() / 60
                    
                    if 0 < time_until_restock <= (travel_time + 10):
                        await channel.send(
                            f"🚨 **RESTOCK ALERT** 🚨\n"
                            f"Item: **{target['name']}** in {country.upper()}\n"
                            f"Predicted: {predicted.strftime('%H:%M:%S')}\n"
                            f"Travel Time: {travel_time} mins\n"
                            f"GO NOW!"
                        )
    except Exception as e:
        print(f"Error in loop: {e}")
    finally:
        await conn.close()

@bot.command()
async def check_stock(ctx, country_code: str):
    conn = await asyncpg.connect(DB_DSN)
    try:
        # Get latest stock for all items in that country
        rows = await conn.fetch('''
            SELECT DISTINCT ON (item_id) item_name, quantity, recorded_at
            FROM foreign_stock_log
            WHERE country_code = $1
            ORDER BY item_id, recorded_at DESC
        ''', country_code.lower())
        
        if not rows:
            await ctx.send(f"No data for {country_code}.")
            return

        msg = f"**Stock for {country_code.upper()}**:\n"
        for row in rows:
            qty = row['quantity']
            name = row['item_name']
            
            if qty > 0:
                msg += f"✅ {name}: {qty}\n"
            else:
                # Try prediction
                predicted = await calculate_next_restock(conn, row['item_id'], country_code.lower())
                pred_str = predicted.strftime('%H:%M') if predicted else "Unknown"
                msg += f"❌ {name}: Sold Out (Est: {pred_str})\n"
        
        await ctx.send(msg)

    finally:
        await conn.close()

if __name__ == "__main__":
    bot.run(TOKEN)
