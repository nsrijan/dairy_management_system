#!/bin/bash

# This script helps test the front-end tenant login functionality
# It provides instructions on how to set up subdomain testing for localhost

echo "=========================================================================="
echo "Frontend Tenant Login Testing Helper"
echo "=========================================================================="
echo ""

# Check if hosts file exists where expected
HOSTS_FILE="/etc/hosts"
if [ ! -f "$HOSTS_FILE" ]; then
    echo "⚠️ Hosts file not found at $HOSTS_FILE"
    if [ "$(uname)" == "Darwin" ]; then
        echo "You're on macOS, hosts file should be at /etc/hosts"
    elif [ "$(uname)" == "Linux" ]; then
        echo "You're on Linux, hosts file should be at /etc/hosts"
    elif [[ "$(uname)" == MINGW* || "$(uname)" == CYGWIN* ]]; then
        echo "You're on Windows, hosts file should be at C:\\Windows\\System32\\drivers\\etc\\hosts"
        HOSTS_FILE="C:\\Windows\\System32\\drivers\\etc\\hosts"
    fi
    echo ""
fi

echo "To test tenant logins via subdomain, add these entries to your hosts file:"
echo ""
echo "127.0.0.1    localhost      # Main domain for Tenant Manager login"
echo "127.0.0.1    test.localhost # Test tenant login"
echo "127.0.0.1    dev.localhost  # Dev tenant login"
echo ""
echo "You'll need to edit the hosts file with administrator privileges."
echo ""

if [ "$(uname)" == "Linux" ]; then
    echo "On Linux, you can run: sudo nano $HOSTS_FILE"
elif [ "$(uname)" == "Darwin" ]; then
    echo "On macOS, you can run: sudo nano $HOSTS_FILE"
else
    echo "On Windows, open Notepad as Administrator and edit $HOSTS_FILE"
fi

echo ""
echo "After updating your hosts file, you can access:"
echo "- http://localhost:3000      - For Tenant Manager login"
echo "- http://test.localhost:3000 - For Test Tenant login" 
echo "- http://dev.localhost:3000  - For Dev Tenant login"
echo ""

# Check if frontend is running
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running at localhost:3000"
else
    echo "⚠️ Frontend doesn't seem to be running. Start it with 'cd web && npm run dev'"
fi

# Check if backend is running
curl -s http://localhost:8080 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running at localhost:8080"
else
    echo "⚠️ Backend doesn't seem to be running. Start it from your IDE or with 'cd backend && ./mvnw spring-boot:run'"
fi

echo ""
echo "Test credentials:"
echo "- For Tenant Manager: admin / admin@123"
echo "- For Tenant users: tenant_user / password123"
echo ""
echo "==========================================================================" 