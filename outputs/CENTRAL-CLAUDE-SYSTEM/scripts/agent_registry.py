#!/usr/bin/env python3
"""
Agent Registry - CENTRAL Multi-Agent Communication System
"""

import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

try:
    from central_config import get_registry_path, ensure_central_structure
except ImportError:
    import sys
    sys.path.append(str(Path(__file__).parent))
    from central_config import get_registry_path, ensure_central_structure


def load_registry() -> Dict:
    """Load CENTRAL agent registry"""
    ensure_central_structure()

    registry_file = get_registry_path()

    if not registry_file.exists():
        registry = {
            "agents": [],
            "next_agent_id": 1,
            "system_version": "1.0",
            "created_at": datetime.utcnow().isoformat() + "Z"
        }
        save_registry(registry)
        return registry

    with open(registry_file, 'r') as f:
        return json.load(f)


def save_registry(registry: Dict):
    """Save CENTRAL agent registry"""
    registry_file = get_registry_path()
    registry_file.parent.mkdir(parents=True, exist_ok=True)

    with open(registry_file, 'w') as f:
        json.dump(registry, f, indent=2)


def register_agent(name: str, agent_type: str, role: str,
                   assigned_repos: List[str] = None, custom_id: Optional[str] = None) -> str:
    """
    Register agent in CENTRAL registry

    Args:
        name: Agent name
        agent_type: Type (web, cli, desktop, api)
        role: Role (worker, coordinator, specialist)
        assigned_repos: List of repos agent works on
        custom_id: Custom ID (optional)

    Returns:
        str: Agent ID
    """
    registry = load_registry()

    # Generate ID
    if custom_id:
        agent_id = custom_id
    else:
        prefix_map = {
            "web": "CCW",
            "cli": "CCC",
            "desktop": "CCD",
            "api": "API"
        }
        prefix = prefix_map.get(agent_type, "AGT")
        agent_id = f"{prefix}-{registry['next_agent_id']}"
        registry["next_agent_id"] += 1

    # Check exists
    for agent in registry["agents"]:
        if agent["id"] == agent_id:
            print(f"⚠️ Agent {agent_id} already registered!")
            return agent_id

    # Create agent
    agent = {
        "id": agent_id,
        "name": name,
        "type": agent_type,
        "role": role,
        "assigned_repos": assigned_repos or [],
        "status": "active",
        "current_task": None,
        "registered_at": datetime.utcnow().isoformat() + "Z",
        "last_heartbeat": datetime.utcnow().isoformat() + "Z",
        "metrics": {
            "tasks_completed": 0,
            "avg_completion_time": "0 minutes"
        }
    }

    registry["agents"].append(agent)
    save_registry(registry)

    print(f"✅ Agent registered (CENTRAL): {agent_id}")
    print(f"   Name: {name}")
    print(f"   Type: {agent_type}")
    print(f"   Repos: {', '.join(assigned_repos) if assigned_repos else 'None'}")

    return agent_id


def unregister_agent(agent_id: str):
    """Unregister agent"""
    registry = load_registry()

    initial_count = len(registry["agents"])
    registry["agents"] = [a for a in registry["agents"] if a["id"] != agent_id]

    if len(registry["agents"]) < initial_count:
        save_registry(registry)
        print(f"✅ Agent {agent_id} unregistered (CENTRAL)")
    else:
        print(f"❌ Agent {agent_id} not found")


def update_heartbeat(agent_id: str):
    """Update agent heartbeat"""
    registry = load_registry()

    for agent in registry["agents"]:
        if agent["id"] == agent_id:
            agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"
            save_registry(registry)
            print(f"💓 Heartbeat updated (CENTRAL): {agent_id}")
            return

    print(f"❌ Agent {agent_id} not found")


def update_agent_status(agent_id: str, status: str, current_task: Optional[str] = None):
    """Update agent status"""
    registry = load_registry()

    for agent in registry["agents"]:
        if agent["id"] == agent_id:
            agent["status"] = status
            if current_task is not None:
                agent["current_task"] = current_task
            agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"
            save_registry(registry)
            print(f"✅ Status updated (CENTRAL): {agent_id} → {status}")
            return

    print(f"❌ Agent {agent_id} not found")


def list_agents(agent_type: Optional[str] = None,
                status: Optional[str] = None,
                repo: Optional[str] = None) -> List[Dict]:
    """List agents with filters"""
    registry = load_registry()
    agents = registry["agents"]

    if agent_type:
        agents = [a for a in agents if a.get("type") == agent_type]

    if status:
        agents = [a for a in agents if a.get("status") == status]

    if repo:
        agents = [a for a in agents if repo in a.get("assigned_repos", [])]

    return agents


def print_agents(agents: List[Dict]):
    """Pretty print agents"""
    if not agents:
        print("📭 No agents registered")
        return

    print(f"\n👥 {len(agents)} agent(s) (CENTRAL):\n")

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

        repos = ', '.join(agent.get('assigned_repos', []))

        print(f"{i}. {status_emoji} {type_emoji} {agent['id']} - {agent['name']}")
        print(f"   Role: {agent.get('role')}")
        print(f"   Repos: {repos or 'None'}")
        print(f"   Status: {agent.get('status')}")
        print(f"   Current Task: {agent.get('current_task') or 'None'}")
        print()


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("📋 All Registered Agents (CENTRAL):\n")
        agents = list_agents()
        print_agents(agents)
    else:
        command = sys.argv[1]

        if command == "register":
            if len(sys.argv) < 5:
                print("Usage: python agent_registry.py register <name> <type> <role> [repos...] [custom_id]")
            else:
                name = sys.argv[2]
                agent_type = sys.argv[3]
                role = sys.argv[4]
                repos = sys.argv[5].split(',') if len(sys.argv) > 5 else []
                custom_id = sys.argv[6] if len(sys.argv) > 6 else None
                register_agent(name, agent_type, role, repos, custom_id)

        elif command == "heartbeat":
            if len(sys.argv) < 3:
                print("Usage: python agent_registry.py heartbeat <agent_id>")
            else:
                update_heartbeat(sys.argv[2])

        elif command == "status":
            if len(sys.argv) < 4:
                print("Usage: python agent_registry.py status <agent_id> <status> [task]")
            else:
                task = sys.argv[4] if len(sys.argv) > 4 else None
                update_agent_status(sys.argv[2], sys.argv[3], task)
