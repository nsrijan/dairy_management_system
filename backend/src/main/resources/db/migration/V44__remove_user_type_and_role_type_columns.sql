-- Remove user_type column from users table
ALTER TABLE users DROP COLUMN IF EXISTS user_type;

-- Remove user_type column from users_aud table
ALTER TABLE users_aud DROP COLUMN IF EXISTS user_type;

-- Remove role_type column from role table
ALTER TABLE role DROP COLUMN IF EXISTS role_type;

-- Remove role_type column from role_aud table
ALTER TABLE role_aud DROP COLUMN IF EXISTS role_type; 