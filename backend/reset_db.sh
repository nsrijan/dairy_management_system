#!/bin/bash

# Database name
DB_NAME="dairy_management_system"

# PostgreSQL connection details
PG_USER="postgres"
PG_PASSWORD="postgres123" # Be cautious with hardcoding passwords in scripts

echo "Connecting to PostgreSQL..."
PGPASSWORD="${PG_PASSWORD}" psql -U "${PG_USER}" -d postgres -c "
SELECT 
    pg_terminate_backend(pid) 
FROM 
    pg_stat_activity 
WHERE 
    datname = '${DB_NAME}' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS ${DB_NAME};
CREATE DATABASE ${DB_NAME};
"
echo "Database reset complete!" 