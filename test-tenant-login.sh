#!/bin/bash

# This script tests tenant-specific login by simulating subdomain access
# Usage: ./test-tenant-login.sh [tenant-slug]
# Example: ./test-tenant-login.sh abc

TENANT_SLUG=${1:-"test"}
HOST="${TENANT_SLUG}.localhost"

echo "Testing login for tenant: $TENANT_SLUG (simulating $HOST)"
echo "Using Host header: $HOST"

# Login with tenant-specific user credentials
# You'll need to create these users in each tenant
echo "Sending request with Host: $HOST"
LOGIN_RESPONSE=$(curl -v -X POST \
  -H "Content-Type: application/json" \
  -H "Host: ${HOST}" \
  -d '{
    "usernameOrEmail": "tenant_user",
    "password": "password123"
  }' \
  http://localhost:8080/api/v1/auth/login 2>&1)

echo "Full curl output:"
echo "$LOGIN_RESPONSE"

# Extract just the response body
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | sed -n '/^{/,/^}/p')
echo "Response Body:"
echo "$RESPONSE_BODY"

# Check if login was successful
if [[ $RESPONSE_BODY == *"token"* ]]; then
  echo "Login successful!"
  
  # Extract token from the response using grep and sed
  TOKEN=$(echo $RESPONSE_BODY | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
  
  echo -e "\nAccessing tenant context test endpoint..."
  CONTEXT_RESPONSE=$(curl -v -X GET \
    -H "Authorization: Bearer $TOKEN" \
    -H "Host: ${HOST}" \
    http://localhost:8080/api/v1/tenant-test/context 2>&1)
  
  echo "Tenant context response:"
  echo "$CONTEXT_RESPONSE"
  
  # Check for tenant ID
  if [[ $CONTEXT_RESPONSE == *"isSuperAdmin\":false"* ]]; then
    echo -e "\n✅ SUCCESS: Tenant context is correctly set (not super admin)!"
    
    # Extract tenant ID
    TENANT_ID=$(echo $CONTEXT_RESPONSE | grep -o '"currentTenantId":[^,}]*' | sed 's/"currentTenantId"://')
    echo "Tenant ID: $TENANT_ID"
  else
    echo -e "\n❌ ERROR: Tenant context is not correctly set."
  fi
else
  echo "Login failed. Possible reasons:"
  echo "1. The tenant '$TENANT_SLUG' doesn't exist"
  echo "2. The user 'tenant_user' doesn't exist for this tenant"
  echo "3. The server is not running"
fi

echo -e "\nNOTE: For proper local testing, add the following to your /etc/hosts file:"
echo "127.0.0.1 ${HOST}"
echo "Then you can access: http://${HOST}:8080" 