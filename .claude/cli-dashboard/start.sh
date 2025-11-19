#!/bin/bash

# Claude Agent Dashboard Launcher
# Automatically installs dependencies and starts the dashboard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Dashboard directory
DASHBOARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${CYAN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚀 CLAUDE AGENT DASHBOARD LAUNCHER                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo -e "${YELLOW}  Please install Node.js 14 or higher${NC}"
    echo -e "${YELLOW}  Visit: https://nodejs.org/${NC}"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${RED}✗ Node.js version $NODE_VERSION is too old${NC}"
    echo -e "${YELLOW}  Please upgrade to Node.js 14 or higher${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Change to dashboard directory
cd "$DASHBOARD_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⟳ Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check if .claude directory exists
CLAUDE_DIR="$(dirname "$DASHBOARD_DIR")"
if [ ! -d "$CLAUDE_DIR" ]; then
    echo -e "${YELLOW}⚠ Warning: .claude directory not found at $CLAUDE_DIR${NC}"
    echo -e "${YELLOW}  Creating directory...${NC}"
    mkdir -p "$CLAUDE_DIR"/{metrics,sessions,logs}

    # Create sample todos.json
    cat > "$CLAUDE_DIR/todos.json" <<EOF
{
  "todos": [
    {
      "id": 1,
      "title": "Sample todo - Setup project",
      "status": "completed"
    },
    {
      "id": 2,
      "title": "Sample todo - Implement features",
      "status": "in-progress",
      "assignedTo": "coder"
    },
    {
      "id": 3,
      "title": "Sample todo - Run tests",
      "status": "pending"
    }
  ]
}
EOF

    echo -e "${GREEN}✓ Created sample configuration${NC}"
fi

echo ""
echo -e "${CYAN}${BOLD}Starting dashboard...${NC}"
echo ""
echo -e "${YELLOW}Keyboard shortcuts:${NC}"
echo -e "  ${CYAN}q${NC}       - Quit"
echo -e "  ${CYAN}o${NC}       - Overview view"
echo -e "  ${CYAN}l${NC}       - Logs view"
echo -e "  ${CYAN}r${NC}       - Refresh"
echo -e "  ${CYAN}h or ?${NC}  - Help"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop the dashboard${NC}"
echo ""

# Start the dashboard
node index.js

# Cleanup on exit
echo ""
echo -e "${CYAN}Dashboard stopped${NC}"
echo -e "${GREEN}✓ Goodbye!${NC}"
