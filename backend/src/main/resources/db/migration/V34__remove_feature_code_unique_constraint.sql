-- Remove unique constraint from feature table's code column
ALTER TABLE feature DROP CONSTRAINT IF EXISTS code; 