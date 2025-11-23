#!/usr/bin/env python3
"""
Agent Registry - Multi-Agent Communication System
Register, unregister, and list agents
"""

import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional


def get_registry_path() -> Path:
    """Get path to agent registry file"""
    repo_root = Path(__file__).parent.parent.parent
    return repo_root / ".claude" / "agents" / "registry.json"


def load_registry() -> Dict:
    """Load agent registry"""
    registry_file = get_registry_path()

    if not registry_file.exists():
        # Create default registry
        registry = {"agents": [], "next_agent_id": 1}
        save_registry(registry)
        return registry

    with open(registry_file, 'r') as f:
        return json.load(f)


def save_registry(registry: Dict):
    """Save agent registry"""
    registry_file = get_registry_path()
    registry_file.parent.mkdir(parents=True, exist_ok=True)

    with open(registry_file, 'w') as f:
        json.dump(registry, f, indent=2)


def register_agent(name: str, agent_type: str, role: str, custom_id: Optional[str] = None) -> str:
    """
    Register a new agent

    Args:
        name: Agent name (e.g., "Claude Code Web Tab 1")
        agent_type: Type of agent (web, cli, desktop, api)
        role: Agent role (primary_worker, specialist, coordinator, etc.)
        custom_id: Custom agent ID (optional, will auto-generate if not provided)

    Returns:
        str: Agent ID
    """
    registry = load_registry()

    # Generate or use custom ID
    if custom_id:
        agent_id = custom_id
    else:
        # Auto-generate ID based on type
        prefix_map = {
            "web": "CCW",
            "cli": "CCC",
            "desktop": "CCD",
            "api": "API"
        }
        prefix = prefix_map.get(agent_type, "AGT")
        agent_id = f"{prefix}-{registry['next_agent_id']}"
        registry["next_agent_id"] += 1

    # Check if agent already exists
    for agent in registry["agents"]:
        if agent["id"] == agent_id:
            print(f"⚠️ Agent {agent_id} already registered!")
            return agent_id

    # Create agent entry
    agent = {
        "id": agent_id,
        "name": name,
        "type": agent_type,
        "role": role,
        "status": "active",
        "registered_at": datetime.utcnow().isoformat() + "Z",
        "last_heartbeat": datetime.utcnow().isoformat() + "Z"
    }

    registry["agents"].append(agent)
    save_registry(registry)

    print(f"✅ Agent registered: {agent_id}")
    print(f"   Name: {name}")
    print(f"   Type: {agent_type}")
    print(f"   Role: {role}")

    return agent_id


def unregister_agent(agent_id: str):
    """
    Unregister an agent

    Args:
        agent_id: Agent ID to unregister
    """
    registry = load_registry()

    # Find and remove agent
    initial_count = len(registry["agents"])
    registry["agents"] = [a for a in registry["agents"] if a["id"] != agent_id]

    if len(registry["agents"]) < initial_count:
        save_registry(registry)
        print(f"✅ Agent {agent_id} unregistered")
    else:
        print(f"❌ Agent {agent_id} not found")


def update_heartbeat(agent_id: str):
    """
    Update agent's last heartbeat timestamp

    Args:
        agent_id: Agent ID
    """
    registry = load_registry()

    for agent in registry["agents"]:
        if agent["id"] == agent_id:
            agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"
            save_registry(registry)
            print(f"💓 Heartbeat updated for {agent_id}")
            return

    print(f"❌ Agent {agent_id} not found")


def update_agent_status(agent_id: str, status: str):
    """
    Update agent status

    Args:
        agent_id: Agent ID
        status: New status (active, idle, busy, offline, error)
    """
    registry = load_registry()

    for agent in registry["agents"]:
        if agent["id"] == agent_id:
            agent["status"] = status
            agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"
            save_registry(registry)
            print(f"✅ Status updated for {agent_id}: {status}")
            return

    print(f"❌ Agent {agent_id} not found")


def get_agent(agent_id: str) -> Optional[Dict]:
    """
    Get agent info by ID

    Args:
        agent_id: Agent ID

    Returns:
        Agent dict or None if not found
    """
    registry = load_registry()

    for agent in registry["agents"]:
        if agent["id"] == agent_id:
            return agent

    return None


def list_agents(agent_type: Optional[str] = None, status: Optional[str] = None) -> List[Dict]:
    """
    List all agents with optional filters

    Args:
        agent_type: Filter by type (web, cli, desktop, api)
        status: Filter by status (active, idle, busy, offline, error)

    Returns:
        List of agents
    """
    registry = load_registry()
    agents = registry["agents"]

    # Apply filters
    if agent_type:
        agents = [a for a in agents if a.get("type") == agent_type]

    if status:
        agents = [a for a in agents if a.get("status") == status]

    return agents


def print_agents(agents: List[Dict]):
    """
    Pretty print agents

    Args:
        agents: List of agents to print
    """
    if not agents:
        print("📭 No agents registered")
        return

    print(f"\n👥 {len(agents)} agent(s):\n")

    for i, agent in enumerate(agents, 1):
        status_emoji = {
            "active": "🟢",
            "idle": "🟡",
            "busy": "🔵",
            "offline": "⚫",
            "error": "🔴"
        }.get(agent.get("status", "active"), "⚪")

        type_emoji = {
            "web": "🌐",
            "cli": "💻",
            "desktop": "🖥️",
            "api": "🔌"
        }.get(agent.get("type", "web"), "🤖")

        print(f"{i}. {status_emoji} {type_emoji} {agent['id']} - {agent['name']}")
        print(f"   Role: {agent.get('role')}")
        print(f"   Type: {agent.get('type')}")
        print(f"   Status: {agent.get('status')}")
        print(f"   Last Heartbeat: {agent.get('last_heartbeat')}")
        print()


def get_active_agent_count() -> int:
    """Get count of active agents"""
    agents = list_agents(status="active")
    return len(agents)


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        # List all agents
        print("📋 All Registered Agents:\n")
        agents = list_agents()
        print_agents(agents)

        print(f"\n📊 Summary:")
        print(f"   Total: {len(agents)}")
        print(f"   Active: {len([a for a in agents if a.get('status') == 'active'])}")
        print(f"   By Type: Web={len([a for a in agents if a.get('type') == 'web'])}, " +
              f"CLI={len([a for a in agents if a.get('type') == 'cli'])}, " +
              f"Desktop={len([a for a in agents if a.get('type') == 'desktop'])}")

    else:
        command = sys.argv[1]

        if command == "register":
            if len(sys.argv) < 5:
                print("Usage: python agent_registry.py register <name> <type> <role> [custom_id]")
                print("Example: python agent_registry.py register 'Claude Web 1' web primary_worker CCW-1")
            else:
                name = sys.argv[2]
                agent_type = sys.argv[3]
                role = sys.argv[4]
                custom_id = sys.argv[5] if len(sys.argv) > 5 else None
                register_agent(name, agent_type, role, custom_id)

        elif command == "unregister":
            if len(sys.argv) < 3:
                print("Usage: python agent_registry.py unregister <agent_id>")
            else:
                unregister_agent(sys.argv[2])

        elif command == "heartbeat":
            if len(sys.argv) < 3:
                print("Usage: python agent_registry.py heartbeat <agent_id>")
            else:
                update_heartbeat(sys.argv[2])

        elif command == "status":
            if len(sys.argv) < 4:
                print("Usage: python agent_registry.py status <agent_id> <new_status>")
            else:
                update_agent_status(sys.argv[2], sys.argv[3])

        else:
            print(f"Unknown command: {command}")
            print("Available commands: register, unregister, heartbeat, status")
