-- Update role table to match BaseEntity fields
ALTER TABLE role 
  RENAME COLUMN created_date TO created_at;
  
ALTER TABLE role
  RENAME COLUMN last_modified_date TO updated_at;
  
ALTER TABLE role
  RENAME COLUMN last_modified_by TO updated_by; 