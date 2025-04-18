#!/bin/bash

# Connect to PostgreSQL as the system user
echo "Connecting to PostgreSQL..."
PGPASSWORD=postgres123 psql -U postgres -d postgres -c "
DROP DATABASE IF EXISTS dairy_management_system;
CREATE DATABASE dairy_management_system;
"

echo "Database reset complete!" 