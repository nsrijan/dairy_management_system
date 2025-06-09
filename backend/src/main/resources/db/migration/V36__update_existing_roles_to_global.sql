-- Update existing roles to be marked as global
UPDATE role
SET module_id = NULL,
    module_type = NULL
WHERE name IN (
    'SYSTEM_ADMIN',
    'TENANT_ADMIN',
    'COMPANY_ADMIN',
    'SUPPLIER',
    'CUSTOMER'
);

-- Update existing roles to be dairy module roles
UPDATE role
SET module_type = 'DAIRY'
WHERE name IN (
    'MCB_STAFF',
    'DELIVERY_STAFF'
); 