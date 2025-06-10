-- Add module column to role table
ALTER TABLE role
    ADD COLUMN module_id BIGINT,
    ADD COLUMN module_type VARCHAR(50);

-- Add module column to role_aud table
ALTER TABLE role_aud
    ADD COLUMN module_id BIGINT,
    ADD COLUMN module_type VARCHAR(50);

-- Add foreign key constraint
ALTER TABLE role
    ADD CONSTRAINT fk_role_module
    FOREIGN KEY (module_id) REFERENCES module(id);

-- Update existing roles to have null module (making them global roles)
UPDATE role SET module_id = NULL, module_type = NULL; 