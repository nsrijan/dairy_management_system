-- Make sure to replace 'users' and 'id' if your table or PK column name is different.
-- This command finds the sequence name automatically.
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);
