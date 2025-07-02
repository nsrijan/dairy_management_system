-- Remove module_type column from tenant table (keeping currency and timezone as they're useful)
ALTER TABLE tenant DROP COLUMN IF EXISTS module_type;

-- Remove module_type column from tenant audit table  
ALTER TABLE tenant_aud DROP COLUMN IF EXISTS module_type; 