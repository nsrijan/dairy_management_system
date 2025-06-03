-- Add unique constraint on role name if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uk_role_name'
    ) THEN
        ALTER TABLE role ADD CONSTRAINT uk_role_name UNIQUE (name);
    END IF;
END $$;

-- Insert tenant admin role
INSERT INTO role (id, name, description, created_by, created_at, updated_by, updated_at, version, role_type)
VALUES (
    (SELECT COALESCE(MAX(id), 0) + 1 FROM role),
    'ROLE_TENANT_ADMIN',
    'Administrator role for managing tenant-wide resources',
    'SYSTEM',
    CURRENT_TIMESTAMP,
    'SYSTEM',
    CURRENT_TIMESTAMP,
    0,
    'TENANT'
)
ON CONFLICT (name) DO NOTHING;

-- Get the role ID
DO $$
DECLARE
    tenant_admin_role_id BIGINT;
    permission_ids BIGINT[];
BEGIN
    SELECT id INTO tenant_admin_role_id FROM role WHERE name = 'ROLE_TENANT_ADMIN';
    
    -- Get IDs of all relevant permissions
    SELECT ARRAY_AGG(id) INTO permission_ids
    FROM permission
    WHERE name IN (
        'CREATE_COMPANY',
        'READ_COMPANY',
        'UPDATE_COMPANY',
        'DELETE_COMPANY',
        'CREATE_USER',
        'READ_USER',
        'UPDATE_USER',
        'DELETE_USER',
        'MANAGE_ROLES',
        'VIEW_AUDIT_LOGS',
        'MANAGE_TENANT_SETTINGS'
    );

    -- Insert role-permission mappings
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT tenant_admin_role_id, permission_id
    FROM unnest(permission_ids) AS permission_id
    ON CONFLICT (role_id, permission_id) DO NOTHING;
END $$;

-- Add new permissions
INSERT INTO permission (id, name, description, created_at, updated_at, version)
VALUES
((SELECT COALESCE(MAX(id), 0) + 1 FROM permission), 'VIEW_AUDIT_LOGS', 'View system audit logs', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
((SELECT COALESCE(MAX(id), 0) + 2 FROM permission), 'MANAGE_TENANT_SETTINGS', 'Manage tenant-wide settings', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (name) DO NOTHING;

-- Add new permissions to existing TENANT_ADMIN role
DO $$
DECLARE
    tenant_admin_role_id BIGINT;
BEGIN
    -- Get the TENANT_ADMIN role ID (we know it's 2, but let's be safe)
    SELECT id INTO tenant_admin_role_id FROM role WHERE name = 'TENANT_ADMIN';
    
    -- Add new permissions
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT tenant_admin_role_id, p.id
    FROM permission p
    WHERE p.name IN (
        'VIEW_AUDIT_LOGS',
        'MANAGE_TENANT_SETTINGS'
    )
    AND NOT EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.role_id = tenant_admin_role_id 
        AND rp.permission_id = p.id
    );

    -- Also ensure TENANT_ADMIN has all necessary role management permissions
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT tenant_admin_role_id, p.id
    FROM permission p
    WHERE p.name IN (
        'ROLE_CREATE',
        'ROLE_READ',
        'ROLE_UPDATE',
        'ROLE_DELETE'
    )
    AND NOT EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.role_id = tenant_admin_role_id 
        AND rp.permission_id = p.id
    );
END $$;