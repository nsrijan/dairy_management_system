-- V32__align_version_columns.sql
-- Ensures all tables have the correct version column (BIGINT) for optimistic locking from BaseEntity

-- For 'feature' table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='feature') THEN
        ALTER TABLE feature DROP COLUMN IF EXISTS version_number;
        -- Ensure version is BIGINT
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='feature' 
            AND column_name='version' 
            AND data_type='bigint'
        ) THEN
            -- Drop if exists with wrong type
            ALTER TABLE feature DROP COLUMN IF EXISTS version;
            -- Add with correct type
            ALTER TABLE feature ADD COLUMN version BIGINT;
        END IF;
    END IF;
END $$;

-- For 'module' table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='module') THEN
        ALTER TABLE module DROP COLUMN IF EXISTS version_number;
        -- Ensure version is BIGINT
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='module' 
            AND column_name='version' 
            AND data_type='bigint'
        ) THEN
            -- Drop if exists with wrong type
            ALTER TABLE module DROP COLUMN IF EXISTS version;
            -- Add with correct type
            ALTER TABLE module ADD COLUMN version BIGINT;
        END IF;
    END IF;
END $$;

-- For 'tenant_module' table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='tenant_module') THEN
        ALTER TABLE tenant_module DROP COLUMN IF EXISTS version_number;
        -- Ensure version is BIGINT
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='tenant_module' 
            AND column_name='version' 
            AND data_type='bigint'
        ) THEN
            -- Drop if exists with wrong type
            ALTER TABLE tenant_module DROP COLUMN IF EXISTS version;
            -- Add with correct type
            ALTER TABLE tenant_module ADD COLUMN version BIGINT;
        END IF;
    END IF;
END $$;

-- AUDIT TABLES --

-- For 'feature_aud' table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='feature_aud') THEN
        RAISE NOTICE 'V32: START processing feature_aud table';
        ALTER TABLE feature_aud DROP COLUMN IF EXISTS version_number;
        -- Ensure version is BIGINT
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='feature_aud' 
            AND column_name='version' 
            AND data_type='bigint'
        ) THEN
            -- Drop if exists with wrong type
            ALTER TABLE feature_aud DROP COLUMN IF EXISTS version;
            -- Add with correct type
            ALTER TABLE feature_aud ADD COLUMN version BIGINT;
        END IF;
        RAISE NOTICE 'V32: END processing feature_aud table';
    END IF;
END $$;

-- For 'module_aud' table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='module_aud') THEN
        RAISE NOTICE 'V32: START processing module_aud table';
        ALTER TABLE module_aud DROP COLUMN IF EXISTS version_number;
        -- Ensure version is BIGINT
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='module_aud' 
            AND column_name='version' 
            AND data_type='bigint'
        ) THEN
            -- Drop if exists with wrong type
            ALTER TABLE module_aud DROP COLUMN IF EXISTS version;
            -- Add with correct type
            ALTER TABLE module_aud ADD COLUMN version BIGINT;
        END IF;
        RAISE NOTICE 'V32: END processing module_aud table';
    END IF;
END $$;

-- For 'tenant_module_aud' table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='tenant_module_aud') THEN
        RAISE NOTICE 'V32: START processing tenant_module_aud table';
        ALTER TABLE tenant_module_aud DROP COLUMN IF EXISTS version_number;
        -- Ensure version is BIGINT
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='tenant_module_aud' 
            AND column_name='version' 
            AND data_type='bigint'
        ) THEN
            -- Drop if exists with wrong type
            ALTER TABLE tenant_module_aud DROP COLUMN IF EXISTS version;
            -- Add with correct type
            ALTER TABLE tenant_module_aud ADD COLUMN version BIGINT;
        END IF;
        RAISE NOTICE 'V32: END processing tenant_module_aud table';
    END IF;
END $$;