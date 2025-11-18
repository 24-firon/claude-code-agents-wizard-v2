#!/bin/bash

# Installation script for Changelog Generator

echo "🚀 Installing Changelog Generator..."
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install Node.js and npm first:"
    echo "  https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "⚠️  Warning: Node.js 16 or higher is recommended"
    echo "   Current version: $(node -v)"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Installation failed"
    exit 1
fi

# Make CLI executable
chmod +x cli.js

echo ""
echo "✅ Installation complete!"
echo ""
echo "📚 Quick Start:"
echo "  ./cli.js --help           Show all commands"
echo "  ./cli.js generate         Generate changelog"
echo "  ./cli.js preview          Preview next release"
echo "  ./cli.js validate         Validate commits"
echo "  ./cli.js bump             Get version recommendation"
echo ""
echo "📖 Documentation: README.md"
echo ""
echo "🔗 Optional: Link globally"
echo "  npm link                  Makes 'changelog' command available globally"
echo ""
