#!/bin/bash

echo "Testing super admin login on localhost (treating as main domain)..."

# Login with admin credentials
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "admin123"
  }' \
  http://localhost:8080/api/v1/auth/login)

echo "Login Response:"
echo "$LOGIN_RESPONSE"

# Check if login was successful by looking for "token" in the response
if [[ $LOGIN_RESPONSE == *"token"* ]]; then
  echo "Login successful! Super admin context is working correctly."
else
  echo "Login failed. Please check the credentials or server status."
fi 