-- Add new fields to inventory_items table
ALTER TABLE inventory_items 
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS color TEXT;

-- Create index for better performance on brand lookups
CREATE INDEX IF NOT EXISTS idx_inventory_items_brand_id ON inventory_items("brandId");

-- Create index for better performance on games lookups  
CREATE INDEX IF NOT EXISTS idx_inventory_items_games_id ON inventory_items USING GIN("gamesId");