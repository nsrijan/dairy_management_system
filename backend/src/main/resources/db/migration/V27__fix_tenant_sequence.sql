-- Fix tenant sequence to start after existing records
SELECT setval('tenant_id_seq', COALESCE((SELECT MAX(id) FROM tenant), 1)); 