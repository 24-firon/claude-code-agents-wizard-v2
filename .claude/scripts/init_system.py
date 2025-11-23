#!/usr/bin/env python3
"""
Initialize Multi-Agent Communication System
Sets up directory structure, registry, and tests the system
"""

import sys
from pathlib import Path

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent))

from agent_registry import register_agent, list_agents, print_agents
from send_message import send_message, send_status_update
from read_messages import read_messages, print_messages


def init_system():
    """Initialize the multi-agent communication system"""

    print("🚀 INITIALIZING MULTI-AGENT COMMUNICATION SYSTEM\n")
    print("=" * 60)

    # Step 1: Verify directory structure
    print("\n📁 Step 1: Verifying directory structure...")

    repo_root = Path(__file__).parent.parent.parent
    required_dirs = [
        ".claude/agents",
        ".claude/messages/inbox",
        ".claude/messages/processing",
        ".claude/messages/completed",
        ".claude/messages/failed",
        ".claude/tasks",
        ".claude/coordination/logs",
        ".claude/scripts"
    ]

    for dir_path in required_dirs:
        full_path = repo_root / dir_path
        if full_path.exists():
            print(f"   ✅ {dir_path}")
        else:
            print(f"   ❌ {dir_path} (missing!)")

    # Step 2: Register CEO agent (this instance)
    print("\n🤖 Step 2: Registering CEO Agent...")

    agent_id = register_agent(
        name="Claude Code CEO - Orchestrator",
        agent_type="cli",
        role="ceo_orchestrator",
        custom_id="CEO"
    )

    # Step 3: Send test message
    print("\n📨 Step 3: Sending test message...")

    msg_id = send_status_update(
        from_agent="CEO",
        to_agent="HUMAN",
        status="online",
        message="Multi-Agent Communication System is ONLINE! 🔥",
        data={
            "system_version": "1.0",
            "capabilities": [
                "Agent Registry",
                "Message Passing",
                "Task Coordination",
                "Status Tracking"
            ]
        }
    )

    # Step 4: Verify message was created
    print("\n📬 Step 4: Verifying message delivery...")

    messages = read_messages("HUMAN", unread_only=True)

    if messages:
        print(f"   ✅ {len(messages)} message(s) in inbox")
        print_messages(messages, show_content=True)
    else:
        print("   ⚠️ No messages found (this might be an error)")

    # Step 5: List registered agents
    print("\n👥 Step 5: Registered Agents:")

    agents = list_agents()
    print_agents(agents)

    # Summary
    print("\n" + "=" * 60)
    print("✅ SYSTEM INITIALIZATION COMPLETE!")
    print("=" * 60)

    print("\n📋 Next Steps:")
    print("   1. Register worker agents:")
    print("      from agent_registry import register_agent")
    print("      register_agent('Claude Web 1', 'web', 'primary_worker', 'CCW-1')")
    print()
    print("   2. Send messages:")
    print("      from send_message import send_task_request")
    print("      send_task_request('CEO', 'CCW-1', 'Build dashboard')")
    print()
    print("   3. Read messages:")
    print("      from read_messages import read_messages")
    print("      messages = read_messages('CCW-1')")
    print()
    print("   4. Move processed messages:")
    print("      from move_message import move_to_completed")
    print("      move_to_completed(msg_id, 'CCW-1')")

    print("\n🚀 SYSTEM READY!\n")


if __name__ == "__main__":
    init_system()
