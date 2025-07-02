-- Remove module-related columns from role table
ALTER TABLE role DROP COLUMN IF EXISTS module_id;
ALTER TABLE role DROP COLUMN IF EXISTS module_type;

-- Remove module-related columns from role audit table
ALTER TABLE role_aud DROP COLUMN IF EXISTS module_id;
ALTER TABLE role_aud DROP COLUMN IF EXISTS module_type; 