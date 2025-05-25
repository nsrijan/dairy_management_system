-- Create a test tenant for development
INSERT INTO tenant (id, name, slug, is_active, created_at, updated_at, version)
VALUES (2, 'Test Tenant', 'test', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING;

-- Create a company for the test tenant
INSERT INTO company (id, name, description, is_active, tenant_id, created_at, updated_at, version)
VALUES (10, 'Test Company', 'A company for testing tenant functionality', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING;

-- Create a user in the test tenant with hashed password 'password123'
-- Note: The password hash should match your application's encoding method
INSERT INTO users (id, username, email, password, first_name, last_name, is_active, is_email_verified, 
                 is_phone_verified, user_type, primary_tenant_id, created_at, updated_at, version)
VALUES (10, 'tenant_user', 'tenant_user@test.com', 
       '$2a$12$dQBcRLTehtZFJT9qfUQNKuJm2hN2Yu5O5EEkI.eSFtXMcSYlAWsr6', -- 'password123' hashed 
       'Tenant', 'User', true, true, true, 'INTERNAL', 2, 
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING;

-- Assign a tenant admin role to this user
INSERT INTO user_company_role (user_id, company_id, role_id, is_active, created_at, updated_at, version)
SELECT 10, 10, id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0
FROM role WHERE name = 'TENANT_ADMIN'
ON CONFLICT (user_id, company_id, role_id) DO NOTHING; 