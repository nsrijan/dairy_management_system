-- Add module_type, currency, and timezone columns to tenant table
ALTER TABLE tenant ADD COLUMN module_type VARCHAR(20) NOT NULL DEFAULT 'DAIRY';
ALTER TABLE tenant ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'INR';
ALTER TABLE tenant ADD COLUMN timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata';

-- Update existing records
UPDATE tenant SET module_type = 'DAIRY', currency = 'INR', timezone = 'Asia/Kolkata' WHERE slug = 'default';
UPDATE tenant SET module_type = 'DAIRY', currency = 'INR', timezone = 'Asia/Kolkata' WHERE slug = 'test'; 