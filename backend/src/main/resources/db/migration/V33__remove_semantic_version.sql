-- Remove semantic_version from module table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='module') THEN
        ALTER TABLE module DROP COLUMN IF EXISTS semantic_version;
    END IF;
END $$;

-- Remove semantic_version from feature table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='feature') THEN
        ALTER TABLE feature DROP COLUMN IF EXISTS semantic_version;
    END IF;
END $$;

-- Remove semantic_version from module_aud table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='module_aud') THEN
        ALTER TABLE module_aud DROP COLUMN IF EXISTS semantic_version;
    END IF;
END $$;

-- Remove semantic_version from feature_aud table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='feature_aud') THEN
        ALTER TABLE feature_aud DROP COLUMN IF EXISTS semantic_version;
    END IF;
END $$; 