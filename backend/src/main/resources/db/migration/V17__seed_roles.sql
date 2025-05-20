-- Seed predefined roles
INSERT INTO role (id, name, description, role_type, created_at, updated_at, version)
VALUES
-- System-level roles
(1, 'SYSTEM_ADMIN', 'System administrator with full access to the platform', 'SYSTEM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Tenant-level roles
(2, 'TENANT_ADMIN', 'Tenant administrator with full access to their tenant', 'TENANT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Company-level roles
(3, 'COMPANY_ADMIN', 'Company administrator with full access to their company', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(4, 'SUPPLIER', 'Supplier with limited access to supply-related features', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(5, 'FARMER', 'Farmer with access to milk collection and payment features', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(6, 'SHOP_MANAGER', 'Shop manager with access to retail operations', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(7, 'FACTORY_MANAGER', 'Factory manager with access to production operations', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(8, 'MCB_STAFF', 'Milk collection booth staff with access to collection operations', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(9, 'DELIVERY_STAFF', 'Delivery staff with access to distribution operations', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(10, 'CUSTOMER', 'Customer with access to ordering and account management', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
ON CONFLICT (id) DO NOTHING; 