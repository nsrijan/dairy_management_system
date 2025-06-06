-- Add system admin role assignment
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM user_company_role 
        WHERE user_id = 1 AND company_id = 1 AND role_id = 1
    ) THEN
INSERT INTO user_company_role (
    id,
    created_at,
    created_by,
    updated_at,
    updated_by,
    version,
    user_id,
    company_id,
    role_id,
    is_active
)
VALUES (
    (SELECT COALESCE(MAX(id), 0) + 1 FROM user_company_role),
    CURRENT_TIMESTAMP,
    'SYSTEM',
    CURRENT_TIMESTAMP,
    'SYSTEM',
    0,
    1, -- admin user id
    1, -- system company id
    1, -- SYSTEM_ADMIN role id
    true
); 
    END IF;
END $$; 