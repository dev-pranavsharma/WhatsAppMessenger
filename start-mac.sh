#!/bin/bash

# Quick start script for Mac development
echo "Starting WhatsApp Campaign Manager on Mac..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if port 5000 is available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 5000 is busy (likely AirPlay), using port 3000 instead"
    echo "App will be available at: http://localhost:3000"
    PORT=3000 HOST=localhost npm run dev
else
    echo "App will be available at: http://localhost:5000"
    HOST=localhost npm run dev
fi