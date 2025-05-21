#!/bin/bash

echo "Testing tenant context resolution..."

# Login with admin credentials
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "admin123"
  }' \
  http://localhost:8080/api/v1/auth/login)

# Check if login was successful
if [[ $LOGIN_RESPONSE == *"token"* ]]; then
  echo "Login successful!"
  
  # Extract token from the response using grep and sed
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
  
  echo -e "\nAccessing tenant context test endpoint..."
  CONTEXT_RESPONSE=$(curl -s -X GET \
    -H "Authorization: Bearer $TOKEN" \
    http://localhost:8080/api/v1/tenant-test/context)
  
  echo "Tenant context response:"
  echo "$CONTEXT_RESPONSE"
  
  # Check if isSuperAdmin is true in the response
  if [[ $CONTEXT_RESPONSE == *'"isSuperAdmin":true'* ]]; then
    echo -e "\n✅ SUCCESS: Super admin context is correctly set!"
  else
    echo -e "\n❌ ERROR: Super admin context is NOT correctly set."
  fi
else
  echo "Login failed. Please check the credentials or server status."
fi 