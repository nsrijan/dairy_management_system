-- Create default system tenant
INSERT INTO tenant (id, name, slug, is_active, created_at, updated_at, version)
VALUES (1, 'System', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING; 