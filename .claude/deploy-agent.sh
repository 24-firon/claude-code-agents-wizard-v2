#!/bin/bash
# ========================================
# CCW Agent Quick Deploy Script
# ========================================

# Usage: ./deploy-agent.sh CCW-1
# or: ./deploy-agent.sh 1  (will use CCW-1)

if [ -z "$1" ]; then
    echo "Usage: $0 <agent-id>"
    echo "Example: $0 CCW-1"
    echo "Example: $0 1  (will use CCW-1)"
    exit 1
fi

# Parse agent ID
AGENT_ID="$1"
if [[ ! "$AGENT_ID" =~ ^CCW- ]]; then
    AGENT_ID="CCW-$1"
fi

# Validate agent ID
if [[ ! "$AGENT_ID" =~ ^CCW-([1-9]|10)$ ]]; then
    echo "❌ Invalid agent ID: $AGENT_ID"
    echo "Valid IDs: CCW-1 through CCW-10"
    exit 1
fi

# Create agent-specific deployment script
AGENT_SCRIPT=".claude/agents/${AGENT_ID}-deployment.py"

echo "🔧 Creating deployment script for $AGENT_ID..."

# Copy and modify the master script
sed "s/AGENT_ID = \"CCW-1\"/AGENT_ID = \"$AGENT_ID\"/" \
    .claude/MASTER-AGENT-DEPLOYMENT.py > "$AGENT_SCRIPT"

chmod +x "$AGENT_SCRIPT"

echo "✅ Created: $AGENT_SCRIPT"
echo ""
echo "🚀 To start the agent, run:"
echo "   python3 $AGENT_SCRIPT"
echo ""
echo "📋 Or use screen/tmux for background running:"
echo "   screen -dmS $AGENT_ID python3 $AGENT_SCRIPT"
echo "   tmux new-session -d -s $AGENT_ID python3 $AGENT_SCRIPT"
