-- Seed global permissions for the system
-- User management permissions
INSERT INTO permission (id, name, description, created_at, updated_at, version)
VALUES
(1, 'USER_CREATE', 'Create new users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(2, 'USER_READ', 'View user details', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(3, 'USER_UPDATE', 'Update user information', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(4, 'USER_DELETE', 'Delete users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Role management permissions
(5, 'ROLE_CREATE', 'Create new roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(6, 'ROLE_READ', 'View role details', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(7, 'ROLE_UPDATE', 'Update role details', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(8, 'ROLE_DELETE', 'Delete roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Company management permissions
(9, 'COMPANY_CREATE', 'Create new companies', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(10, 'COMPANY_READ', 'View company details', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(11, 'COMPANY_UPDATE', 'Update company information', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(12, 'COMPANY_DELETE', 'Delete companies', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Tenant management permissions
(13, 'TENANT_CREATE', 'Create new tenants', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(14, 'TENANT_READ', 'View tenant details', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(15, 'TENANT_UPDATE', 'Update tenant information', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(16, 'TENANT_DELETE', 'Delete tenants', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Dairy management specific permissions
(17, 'MILK_COLLECTION_CREATE', 'Record milk collection', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(18, 'MILK_COLLECTION_READ', 'View milk collection records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(19, 'MILK_COLLECTION_UPDATE', 'Update milk collection records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(20, 'MILK_COLLECTION_DELETE', 'Delete milk collection records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

(21, 'PAYMENT_CREATE', 'Create payment records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(22, 'PAYMENT_READ', 'View payment records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(23, 'PAYMENT_UPDATE', 'Update payment records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(24, 'PAYMENT_DELETE', 'Delete payment records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

(25, 'REPORT_GENERATE', 'Generate reports', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(26, 'REPORT_VIEW', 'View reports', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

(27, 'INVENTORY_CREATE', 'Create inventory records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(28, 'INVENTORY_READ', 'View inventory records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(29, 'INVENTORY_UPDATE', 'Update inventory records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(30, 'INVENTORY_DELETE', 'Delete inventory records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING; 