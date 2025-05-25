-- Add module_type, currency, and timezone columns to tenant_aud table
ALTER TABLE tenant_aud ADD COLUMN IF NOT EXISTS module_type VARCHAR(20);
ALTER TABLE tenant_aud ADD COLUMN IF NOT EXISTS currency VARCHAR(10);
ALTER TABLE tenant_aud ADD COLUMN IF NOT EXISTS timezone VARCHAR(50); 