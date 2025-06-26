#!/bin/bash

# WhatsApp Business Campaign Manager - Mac Setup Script
echo "🚀 Setting up WhatsApp Business Campaign Manager for Mac..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js using one of these methods:"
    echo "1. Homebrew: brew install node"
    echo "2. Download from: https://nodejs.org/"
    echo "3. Use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node --version)"
    echo "Please upgrade Node.js."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available."
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Check if port 5000 is available on Mac
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5000 is in use (likely AirPlay Receiver on Mac)"
    echo "   You can either:"
    echo "   1. Stop AirPlay Receiver: System Preferences > Sharing > AirPlay Receiver"
    echo "   2. Use a different port by setting PORT=3000 in your .env file"
else
    echo "✅ Port 5000 is available"
fi

echo ""
echo "🎉 Setup complete! To start the app:"
echo "   npm run dev"
echo ""
echo "📖 The app will be available at: http://localhost:5000"
echo "💡 If port 5000 is busy, set PORT=3000 in .env file"
echo ""
echo "📚 For more information, see README.md"