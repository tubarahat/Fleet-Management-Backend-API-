-- Ensure your trip table has these defaults
ALTER TABLE trips 
ALTER COLUMN "isCompleted" SET DEFAULT false,
ALTER COLUMN "tripCost" SET DEFAULT 0;

