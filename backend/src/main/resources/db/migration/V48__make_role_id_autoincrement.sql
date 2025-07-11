-- =====================================================
-- Migration: V49 - Make Role ID Auto-incrementing
-- Description: Configures the 'id' column of the 'role' table to be auto-incrementing
--              using a sequence. This is the permanent fix for 'null value in column "id"'
--              errors when inserting new roles.
-- =====================================================

-- Create a sequence for the role table's primary key if it doesn't already exist.
CREATE SEQUENCE IF NOT EXISTS role_id_seq;

-- Set the sequence's current value to be higher than any existing ID.
-- The 'true' argument ensures the next call to nextval will return MAX(id) + 1.
SELECT setval('role_id_seq', COALESCE((SELECT MAX(id) FROM role), 0), true);

-- Alter the 'id' column to use the sequence as its default value for future INSERTs.
ALTER TABLE role ALTER COLUMN id SET DEFAULT nextval('role_id_seq');

-- Ensure the sequence is owned by the table's id column for proper dependency tracking.
ALTER SEQUENCE role_id_seq OWNED BY role.id;