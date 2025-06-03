-- Remove semantic_version from module table
ALTER TABLE module DROP COLUMN IF EXISTS semantic_version;

-- Remove semantic_version from feature table
ALTER TABLE feature DROP COLUMN IF EXISTS semantic_version;

-- Remove semantic_version from module_aud table
ALTER TABLE module_aud DROP COLUMN IF EXISTS semantic_version;

-- Remove semantic_version from feature_aud table
ALTER TABLE feature_aud DROP COLUMN IF EXISTS semantic_version; 