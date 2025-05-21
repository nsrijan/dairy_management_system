#!/bin/bash

# This script opens browser tabs for testing different tenant login scenarios

# Function to detect the default browser based on OS
open_browser() {
    local url="$1"
    
    case "$(uname)" in
        "Darwin")  # macOS
            open "$url"
            ;;
        "Linux")
            if command -v xdg-open > /dev/null; then
                xdg-open "$url"
            elif command -v gnome-open > /dev/null; then
                gnome-open "$url"
            else
                echo "Could not detect browser. Please open: $url"
            fi
            ;;
        MINGW*|CYGWIN*)  # Windows
            start "$url"
            ;;
        *)
            echo "Could not detect browser. Please open: $url"
            ;;
    esac
}

echo "Opening browser tabs for tenant login testing..."

# First, remind about hosts file
echo "NOTE: Make sure you've added these entries to your hosts file first:"
echo "127.0.0.1    localhost      # Main domain for Tenant Manager login"
echo "127.0.0.1    test.localhost # Test tenant login"
echo ""

# Ask if ready to proceed
read -p "Do you want to open browser tabs for testing? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted. Run ./test-frontend-tenant-login.sh for setup instructions."
    exit 1
fi

# Check if frontend is running
curl -s http://localhost:3000 > /dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ Frontend doesn't seem to be running. Start it with 'cd web && npm run dev' first."
    exit 1
fi

# Open browser tabs - 2 second delay between each
echo "Opening localhost for Tenant Manager login..."
open_browser "http://localhost:3000"
sleep 2

echo "Opening test.localhost for Test tenant login..."
open_browser "http://test.localhost:3000"

echo ""
echo "Test credentials:"
echo "- For Tenant Manager: admin / admin@123"
echo "- For Tenant users: tenant_user / password123"
echo ""
echo "Happy testing! 🎉" 