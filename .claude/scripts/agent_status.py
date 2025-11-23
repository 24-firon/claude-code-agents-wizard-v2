#!/usr/bin/env python3
"""
Agent Status Monitor
Shows status of all CCW agents
"""

import json
from datetime import datetime
from pathlib import Path

CLAUDE_DIR = Path(__file__).parent.parent
registry_file = CLAUDE_DIR / "agents" / "registry.json"

def get_status_emoji(status):
    """Get emoji for agent status"""
    return {
        "active": "🟢",
        "standby": "🟡",
        "offline": "⚫",
        "busy": "🔴"
    }.get(status, "⚪")

def main():
    print("=" * 60)
    print("CCW AGENT STATUS MONITOR")
    print("=" * 60)

    if not registry_file.exists():
        print("❌ Registry not found!")
        return

    registry = json.loads(registry_file.read_text())

    print(f"\n📊 Total Agents: {len(registry['agents'])}")
    print(f"🕒 Registry Updated: {registry.get('updated', 'Unknown')}\n")

    # Count by status
    status_counts = {}
    for agent in registry["agents"]:
        status = agent.get("status", "offline")
        status_counts[status] = status_counts.get(status, 0) + 1

    print("Status Summary:")
    for status, count in sorted(status_counts.items()):
        emoji = get_status_emoji(status)
        print(f"  {emoji} {status.upper()}: {count}")

    print("\n" + "-" * 60)
    print("Individual Agent Status:")
    print("-" * 60)

    for agent in registry["agents"]:
        emoji = get_status_emoji(agent.get("status", "offline"))
        agent_id = agent["id"]
        status = agent.get("status", "offline").upper()
        heartbeat = agent.get("last_heartbeat", "Never")

        # Format heartbeat
        if heartbeat and heartbeat != "Never":
            try:
                dt = datetime.fromisoformat(heartbeat.replace('Z', '+00:00'))
                heartbeat = dt.strftime("%Y-%m-%d %H:%M:%S")
            except:
                pass

        print(f"{emoji} {agent_id:8} | {status:8} | Last HB: {heartbeat}")

    print("=" * 60)

if __name__ == "__main__":
    main()
