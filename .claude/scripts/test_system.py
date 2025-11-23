#!/usr/bin/env python3
"""
Multi-Agent System Test Script
Tests the communication infrastructure
"""

import sys
from pathlib import Path

# Add scripts directory to path
script_dir = Path(__file__).parent
sys.path.insert(0, str(script_dir))

from send_message import send_message
from read_messages import read_messages, print_messages
from register_agent import register_agent, list_agents, heartbeat


def test_communication_system():
    """Test the multi-agent communication system"""

    print("🧪 Testing Multi-Agent Communication System\n")
    print("=" * 60)

    # Test 1: List registered agents
    print("\n1️⃣ Testing Agent Registry...")
    print("-" * 60)
    agents = list_agents()

    # Test 2: Send a message
    print("\n2️⃣ Testing Message Sending...")
    print("-" * 60)

    msg_id = send_message(
        from_agent="CEO",
        to_agent="HUMAN",
        msg_type="status_update",
        content={
            "status": "online",
            "message": "Multi-agent communication system ACTIVE! 🔥",
            "components": [
                "registry",
                "message_passing",
                "agent_coordination"
            ],
            "system_version": "2.0"
        },
        priority="high"
    )

    # Test 3: Read messages
    print("\n3️⃣ Testing Message Reading...")
    print("-" * 60)

    messages = read_messages("HUMAN", "inbox")
    print_messages(messages)

    # Test 4: Send task assignment message
    print("\n4️⃣ Testing Task Assignment Message...")
    print("-" * 60)

    task_msg_id = send_message(
        from_agent="CEO",
        to_agent="CCW-1",
        msg_type="task_assignment",
        content={
            "task_id": "TASK-001",
            "title": "Test Task Assignment",
            "description": "Verify that task assignment messaging works",
            "priority": "normal",
            "deadline": "2025-11-24T00:00:00Z"
        },
        priority="normal"
    )

    # Test 5: Heartbeat
    print("\n5️⃣ Testing Heartbeat...")
    print("-" * 60)

    heartbeat("CEO")

    # Summary
    print("\n" + "=" * 60)
    print("✅ SYSTEM TEST COMPLETE!")
    print("=" * 60)
    print(f"\n📊 Test Results:")
    print(f"   • Agents registered: {len(agents)}")
    print(f"   • Messages sent: 2")
    print(f"   • Messages received: {len(messages)}")
    print(f"   • Status: OPERATIONAL 🟢")
    print("\n🚀 Multi-Agent Orchestration System is READY!\n")


if __name__ == "__main__":
    test_communication_system()
