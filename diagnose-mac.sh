#!/bin/bash

echo "WhatsApp Campaign Manager - Mac Diagnostic"
echo "==========================================="

# Check if server is running
echo "1. Checking server status..."
if curl -s http://localhost:5000 > /dev/null; then
    echo "   ✓ Server is running on port 5000"
    PORT=5000
elif curl -s http://localhost:3000 > /dev/null; then
    echo "   ✓ Server is running on port 3000"  
    PORT=3000
else
    echo "   ✗ Server is not running on port 5000 or 3000"
    echo "   Run: PORT=3000 HOST=127.0.0.1 npm run dev"
    exit 1
fi

# Check client loading
echo "2. Testing client response..."
RESPONSE=$(curl -s http://localhost:$PORT | head -5)
if [[ $RESPONSE == *"<!DOCTYPE html>"* ]]; then
    echo "   ✓ HTML is being served"
else
    echo "   ✗ HTML not loading properly"
fi

if [[ $RESPONSE == *"vite"* ]]; then
    echo "   ✓ Vite client is active"
else
    echo "   ✗ Vite client not detected"
fi

# Check browser access
echo "3. Opening browser..."
if command -v open > /dev/null; then
    open http://localhost:$PORT
    echo "   ✓ Browser opened to http://localhost:$PORT"
else
    echo "   → Manually open: http://localhost:$PORT"
fi

echo ""
echo "If the browser shows a blank page:"
echo "1. Open Developer Tools (F12 or Cmd+Option+I)"
echo "2. Check the Console tab for errors"
echo "3. Try refreshing the page (Cmd+R)"
echo ""
echo "Common issues on Mac:"
echo "- Safari may block local scripts - try Chrome/Firefox"
echo "- Check browser console for JavaScript errors"
echo "- Ensure all dependencies are installed: npm install"