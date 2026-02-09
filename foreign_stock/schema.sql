-- schema.sql
-- Run this to initialize the database

CREATE TABLE IF NOT EXISTS foreign_stock_log (
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    item_id INTEGER NOT NULL,
    item_name VARCHAR(255),
    quantity INTEGER NOT NULL,
    cost INTEGER, -- Optional: track price too
    PRIMARY KEY (item_id, country_code, recorded_at)
);

-- Index for fast retrieval of item history
CREATE INDEX IF NOT EXISTS idx_stock_history ON foreign_stock_log (item_id, recorded_at DESC);

-- Optional: Function to clean up old data (Retention Policy: 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_stock_logs() RETURNS void AS $$
BEGIN
    DELETE FROM foreign_stock_log WHERE recorded_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
