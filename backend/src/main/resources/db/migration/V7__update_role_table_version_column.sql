-- Update role table version column from INTEGER to BIGINT
ALTER TABLE role
  ALTER COLUMN version TYPE BIGINT; 