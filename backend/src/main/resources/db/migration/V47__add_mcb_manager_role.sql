-- =====================================================
-- Migration: V47 - Add MCB Manager Role and Permissions
-- Description: Adds the MCB_MANAGER role and associated permissions for managing a milk collection branch.
-- =====================================================

-- Insert the MCB_MANAGER role if it doesn't already exist.
-- This role was defined in the design but this script ensures its existence.
-- The ID must be provided manually as the 'id' column is not a SERIAL type.
INSERT INTO role (id, name, description, created_at, updated_at, version)
SELECT
    (SELECT COALESCE(MAX(id), 0) + 1 FROM role),
    'MCB_MANAGER',
    'Manages a single Milk Collection Branch, including staff, farmers, and daily operations.',
    NOW(), NOW(), 0
ON CONFLICT (name) DO NOTHING;

-- Reset the permission sequence before inserting. This is necessary because a previous
-- migration (V28) inserted IDs manually, which desynchronized the sequence. This
-- command ensures the next ID generated will be correct.
SELECT setval(pg_get_serial_sequence('permission', 'id'), COALESCE((SELECT MAX(id) FROM permission), 0) + 1, false);

-- Insert permissions specific to MCB management if they don't exist.
INSERT INTO permission (name, description, created_at, updated_at, version)
VALUES
    ('MANAGE_MCB_FARMERS', 'Allows creating, updating, and managing farmers within an MCB.', NOW(), NOW(), 0),
    ('MANAGE_MCB_COLLECTIONS', 'Allows recording and managing daily milk collections.', NOW(), NOW(), 0),
    ('MANAGE_MCB_VATS', 'Allows managing chill vats within an MCB.', NOW(), NOW(), 0),
    ('MANAGE_MCB_RATES', 'Allows setting and updating milk buy/sell rates for an MCB.', NOW(), NOW(), 0),
    ('VIEW_MCB_REPORTS', 'Allows viewing reports and statistics for a specific MCB.', NOW(), NOW(), 0),
    ('MANAGE_MCB_STAFF', 'Allows managing staff assignments for an MCB.', NOW(), NOW(), 0)
ON CONFLICT (name) DO NOTHING;

-- Link the new permissions to the MCB_MANAGER role.
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    (SELECT id FROM role WHERE name = 'MCB_MANAGER'),
    p.id
FROM permission p
WHERE p.name IN (
    'MANAGE_MCB_FARMERS', 'MANAGE_MCB_COLLECTIONS', 'MANAGE_MCB_VATS',
    'MANAGE_MCB_RATES', 'VIEW_MCB_REPORTS', 'MANAGE_MCB_STAFF'
)
-- Ensure we don't insert duplicates
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = (SELECT id FROM role WHERE name = 'MCB_MANAGER') AND rp.permission_id = p.id
);