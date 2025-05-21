-- Seed role_permissions mapping
-- Map system admin role to all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permission
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map tenant admin role to tenant-level permissions
INSERT INTO role_permissions (role_id, permission_id)
VALUES
-- User management within tenant
(2, 1), (2, 2), (2, 3), (2, 4),
-- Role management within tenant
(2, 6), (2, 7),
-- Company management within tenant
(2, 9), (2, 10), (2, 11), (2, 12),
-- Report access
(2, 25), (2, 26)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map company admin role to company-level permissions
INSERT INTO role_permissions (role_id, permission_id)
VALUES
-- User management within company
(3, 1), (3, 2), (3, 3), (3, 4),
-- Role assignment within company (read-only)
(3, 6),
-- Company details (read-only)
(3, 10),
-- All dairy management permissions
(3, 17), (3, 18), (3, 19), (3, 20),  -- Milk collection
(3, 21), (3, 22), (3, 23), (3, 24),  -- Payments
(3, 25), (3, 26),                    -- Reports
(3, 27), (3, 28), (3, 29), (3, 30)   -- Inventory
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map MCB staff role to milk collection and farmer management permissions
INSERT INTO role_permissions (role_id, permission_id)
VALUES
-- Milk collection permissions
(8, 17), (8, 18), (8, 19),
-- Payment viewing
(8, 22),
-- Limited user viewing (farmers)
(8, 2)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Map farmer role to view own milk collection and payment records
INSERT INTO role_permissions (role_id, permission_id)
VALUES
(5, 18), -- View milk collection
(5, 22)  -- View payments
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Additional role-permission mappings can be added later as needed 