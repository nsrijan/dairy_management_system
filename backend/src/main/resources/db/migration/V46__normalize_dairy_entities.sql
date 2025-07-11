-- =====================================================
-- Migration: V46 - Normalize Dairy Entities
-- Description: Removes redundant 'code' and 'tenant_id' columns from dairy-specific tables
--              to align with a normalized data model where the tenant is derived from the company.
-- =====================================================

-- === Clean up milk_collection_branch table ===

-- Drop constraints and indexes associated with the columns to be removed
ALTER TABLE milk_collection_branch DROP CONSTRAINT IF EXISTS uk_mcb_code_company;
ALTER TABLE milk_collection_branch DROP CONSTRAINT IF EXISTS fk_mcb_tenant;
DROP INDEX IF EXISTS idx_mcb_tenant_id;

-- Drop the redundant columns
ALTER TABLE milk_collection_branch DROP COLUMN IF EXISTS code;
ALTER TABLE milk_collection_branch DROP COLUMN IF EXISTS tenant_id;


-- === Clean up factory table ===

-- Drop constraints and indexes associated with the columns to be removed
ALTER TABLE factory DROP CONSTRAINT IF EXISTS uk_factory_code_company;
ALTER TABLE factory DROP CONSTRAINT IF EXISTS fk_factory_tenant;
DROP INDEX IF EXISTS idx_factory_tenant_id;

-- Drop the redundant columns
ALTER TABLE factory DROP COLUMN IF EXISTS code;
ALTER TABLE factory DROP COLUMN IF EXISTS tenant_id;


-- === Clean up shop table ===

-- Drop constraints and indexes associated with the columns to be removed
ALTER TABLE shop DROP CONSTRAINT IF EXISTS uk_shop_code_company;
ALTER TABLE shop DROP CONSTRAINT IF EXISTS fk_shop_tenant;
DROP INDEX IF EXISTS idx_shop_tenant_id;

-- Drop the redundant columns
ALTER TABLE shop DROP COLUMN IF EXISTS code;
ALTER TABLE shop DROP COLUMN IF EXISTS tenant_id;

COMMENT ON TABLE milk_collection_branch IS 'Company-scoped milk collection branches. Tenant is derived via company_id.';
COMMENT ON TABLE factory IS 'Company-scoped factories. Tenant is derived via company_id.';
COMMENT ON TABLE shop IS 'Company-scoped shops. Tenant is derived via company_id.';