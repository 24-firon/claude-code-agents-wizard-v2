#!/bin/bash

# Install All Dependencies Script
# Installs npm dependencies for all 8 package.json files in the project

set -e  # Exit on error

echo "🚀 Installing dependencies for all project components..."
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

install_deps() {
    local dir=$1
    local name=$2

    if [ -f "$dir/package.json" ]; then
        echo -e "${BLUE}📦 Installing: $name${NC}"
        echo "   Location: $dir"
        (cd "$dir" && npm install)
        echo -e "${GREEN}✅ Completed: $name${NC}"
        echo ""
    else
        echo "⚠️  Skipping $name (package.json not found)"
        echo ""
    fi
}

# 1. CLI Dashboard
install_deps ".claude/cli-dashboard" "CLI Dashboard"

# 2. Web Dashboard Client (React)
install_deps ".claude/web-dashboard/client" "Web Dashboard - Client"

# 3. Web Dashboard Server (Express)
install_deps ".claude/web-dashboard/server" "Web Dashboard - Server"

# 4. Benchmarks
install_deps ".claude/benchmarks" "Performance Benchmarks"

# 5. Changelog Generator
install_deps ".claude/changelog" "Changelog Generator"

# 6. Integration Tests
install_deps "tests/integration" "Integration Tests"

# 7. React Todo Example
install_deps "tests/examples/react-todo-app" "Example: React Todo App"

# 8. Express API Example
install_deps "tests/examples/express-rest-api" "Example: Express REST API"

echo -e "${GREEN}🎉 All dependencies installed successfully!${NC}"
echo ""
echo "You can now:"
echo "  - Start CLI Dashboard: cd .claude/cli-dashboard && ./start.sh"
echo "  - Start Web Dashboard: cd .claude/web-dashboard && docker-compose up"
echo "  - Run Benchmarks: cd .claude/benchmarks && npm run bench:all"
echo "  - Run Integration Tests: cd tests/integration && npm test"
echo "  - Try React Example: cd tests/examples/react-todo-app && npm run dev"
echo "  - Try Express Example: cd tests/examples/express-rest-api && npm run dev"
