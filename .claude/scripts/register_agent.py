#!/usr/bin/env python3
"""
Multi-Agent Registration Script
Registers new agents in the orchestration system
"""

import json
import os
from datetime import datetime
from pathlib import Path


def register_agent(agent_id, name, agent_type, role, status="active"):
    """
    Register a new agent in the system

    Args:
        agent_id (str): Unique agent ID (e.g., "CEO", "CCW-1", "CCW-2")
        name (str): Human-readable agent name
        agent_type (str): Agent type ("cli", "web", "desktop", "subagent")
        role (str): Agent role (e.g., "orchestrator", "worker", "specialist")
        status (str): Initial status ("active", "inactive", "standby")

    Returns:
        bool: True if successful, False otherwise
    """

    # Get the .claude directory
    script_dir = Path(__file__).parent
    claude_dir = script_dir.parent
    registry_file = claude_dir / "agents" / "registry.json"

    # Load existing registry
    try:
        with open(registry_file, 'r', encoding='utf-8') as f:
            registry = json.load(f)
    except FileNotFoundError:
        print("❌ Registry file not found. Creating new registry...")
        registry = {
            "agents": [],
            "next_agent_id": 1,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

    # Check if agent already exists
    for agent in registry.get("agents", []):
        if agent["id"] == agent_id:
            print(f"⚠️  Agent {agent_id} already registered")
            print(f"   Updating existing registration...")

            # Update existing agent
            agent["name"] = name
            agent["type"] = agent_type
            agent["role"] = role
            agent["status"] = status
            agent["last_updated"] = datetime.utcnow().isoformat() + "Z"
            agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"

            # Write updated registry
            with open(registry_file, 'w', encoding='utf-8') as f:
                json.dump(registry, f, indent=2, ensure_ascii=False)

            print(f"✅ Agent {agent_id} updated successfully")
            return True

    # Register new agent
    new_agent = {
        "id": agent_id,
        "name": name,
        "type": agent_type,
        "role": role,
        "status": status,
        "registered_at": datetime.utcnow().isoformat() + "Z",
        "last_heartbeat": datetime.utcnow().isoformat() + "Z",
        "metadata": {
            "version": "2.0",
            "capabilities": []
        }
    }

    registry["agents"].append(new_agent)
    registry["next_agent_id"] = registry.get("next_agent_id", 1) + 1

    # Write updated registry
    registry_file.parent.mkdir(parents=True, exist_ok=True)
    with open(registry_file, 'w', encoding='utf-8') as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)

    print(f"✅ Agent registered: {agent_id}")
    print(f"   Name: {name}")
    print(f"   Type: {agent_type}")
    print(f"   Role: {role}")
    print(f"   Status: {status}")

    return True


def list_agents():
    """List all registered agents"""

    script_dir = Path(__file__).parent
    claude_dir = script_dir.parent
    registry_file = claude_dir / "agents" / "registry.json"

    try:
        with open(registry_file, 'r', encoding='utf-8') as f:
            registry = json.load(f)
    except FileNotFoundError:
        print("❌ Registry file not found")
        return []

    agents = registry.get("agents", [])

    if not agents:
        print("📭 No agents registered")
        return []

    print(f"\n🤖 Registered Agents ({len(agents)}):\n")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    for agent in agents:
        status_emoji = {
            "active": "🟢",
            "inactive": "🔴",
            "standby": "🟡"
        }.get(agent.get("status", "unknown"), "⚪")

        print(f"{status_emoji} {agent['id']:<15} | {agent['name']:<30} | {agent['type']:<10} | {agent['role']}")

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    return agents


def heartbeat(agent_id):
    """Update agent heartbeat timestamp"""

    script_dir = Path(__file__).parent
    claude_dir = script_dir.parent
    registry_file = claude_dir / "agents" / "registry.json"

    try:
        with open(registry_file, 'r', encoding='utf-8') as f:
            registry = json.load(f)
    except FileNotFoundError:
        print(f"❌ Registry file not found")
        return False

    # Find and update agent
    for agent in registry.get("agents", []):
        if agent["id"] == agent_id:
            agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"

            # Write updated registry
            with open(registry_file, 'w', encoding='utf-8') as f:
                json.dump(registry, f, indent=2, ensure_ascii=False)

            print(f"💓 Heartbeat updated for {agent_id}")
            return True

    print(f"❌ Agent {agent_id} not found in registry")
    return False


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  Register: python register_agent.py register <agent_id> <name> <type> <role> [status]")
        print("  List:     python register_agent.py list")
        print("  Heartbeat: python register_agent.py heartbeat <agent_id>")
        print("\nExample:")
        print('  python register_agent.py register CEO "CEO Orchestrator" cli orchestrator active')
        sys.exit(1)

    command = sys.argv[1]

    if command == "list":
        list_agents()
    elif command == "heartbeat" and len(sys.argv) >= 3:
        heartbeat(sys.argv[2])
    elif command == "register" and len(sys.argv) >= 6:
        agent_id = sys.argv[2]
        name = sys.argv[3]
        agent_type = sys.argv[4]
        role = sys.argv[5]
        status = sys.argv[6] if len(sys.argv) > 6 else "active"
        register_agent(agent_id, name, agent_type, role, status)
    else:
        print("❌ Invalid command or missing arguments")
        sys.exit(1)
