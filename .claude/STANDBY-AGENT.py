#!/usr/bin/env python3
# ========================================
# CCW STANDBY AGENT (Registered but Idle)
# ========================================

AGENT_ID = "CCW-X"  # ← ÄNDERE: CCW-1 bis CCW-10

import json
from datetime import datetime
from pathlib import Path

# Adjusted for current directory structure
CLAUDE_DIR = Path("/home/user/claude-code-agents-wizard-v2/.claude")

print(f"🔧 {AGENT_ID} - STATUS CHECK\n")
print("  ℹ️  Registered but no work assigned")
print("  ⏸️  Ready for future tasks")

# Update registry to show agent is registered
registry_file = CLAUDE_DIR / "agents" / "registry.json"

if registry_file.exists():
    registry = json.loads(registry_file.read_text())

    for agent in registry["agents"]:
        if agent["id"] == AGENT_ID:
            agent["status"] = "standby"
            agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"
            print(f"\n✅ {AGENT_ID} marked as STANDBY in registry")
            break
    else:
        print(f"\n⚠️  {AGENT_ID} not found in registry")
        print("   Valid IDs: CCW-1 to CCW-10")

    registry_file.write_text(json.dumps(registry, indent=2))
else:
    print("\n❌ Registry not found!")
    print(f"   Expected: {registry_file}")

print("\n✅ No active work - agent in standby mode")
print("💡 Use MASTER-AGENT-DEPLOYMENT.py to activate this agent")
