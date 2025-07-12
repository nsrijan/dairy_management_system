-- Create system tenant if not exists
INSERT INTO tenant (id, name, slug, is_active, created_at, updated_at, version)
VALUES (1, 'System Tenant', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING;

-- Create system company if not exists
INSERT INTO company (id, name, tenant_id, is_active, created_at, updated_at, version)
VALUES (1, 'System Company', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING;

-- Create system admin user if not exists
INSERT INTO users (id, username, email, password, first_name, last_name, is_active, is_email_verified, is_phone_verified, user_type, primary_tenant_id, created_at, updated_at, version)
VALUES (
    1, 
    'admin',
    'admin@dms.com',
    '$2a$12$dQBcRLTehtZFJT9qfUQNKuJm2hN2Yu5O5EEkI.eSFtXMcSYlAWsr6', -- This is 'admin123' hashed with BCrypt
    'System',
    'Administrator',
    true,
    true,
    true,
    'INTERNAL',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0
)
ON CONFLICT (id) DO NOTHING;

-- Create user company role assignment if not exists
INSERT INTO user_company_role (user_id, company_id, role_id, is_active, created_at, updated_at, version)
VALUES (1, 1, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (user_id, company_id, role_id) DO NOTHING; 