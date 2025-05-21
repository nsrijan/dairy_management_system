-- Add missing columns to the revinfo table based on CustomRevisionEntity
ALTER TABLE revinfo 
ADD COLUMN username VARCHAR(255),
ADD COLUMN ip_address VARCHAR(255),
ADD COLUMN action VARCHAR(255); 