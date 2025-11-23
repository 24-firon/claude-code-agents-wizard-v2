#!/usr/bin/env python3
"""
Test CCW Agent System
Verifies all components are working correctly
"""

import json
import sys
from pathlib import Path

# Add scripts to path
CLAUDE_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(CLAUDE_DIR / "scripts"))

from send_message import send_message
from read_messages import read_messages
from move_message import move_message

def test_registry():
    """Test registry.json exists and is valid"""
    print("🔍 Testing registry...")
    registry_file = CLAUDE_DIR / "agents" / "registry.json"

    if not registry_file.exists():
        print("❌ Registry not found!")
        return False

    registry = json.loads(registry_file.read_text())

    if len(registry["agents"]) != 10:
        print(f"❌ Expected 10 agents, found {len(registry['agents'])}")
        return False

    for i, agent in enumerate(registry["agents"], 1):
        if agent["id"] != f"CCW-{i}":
            print(f"❌ Agent {i} has wrong ID: {agent['id']}")
            return False

    print(f"✅ Registry valid: {len(registry['agents'])} agents")
    return True


def test_messaging():
    """Test message sending and reading"""
    print("\n🔍 Testing messaging system...")

    # Send test message
    msg_id = send_message(
        "TEST-SYSTEM",
        "CCW-1",
        "task_assignment",
        {"task": "Test task", "test": True}
    )
    print(f"✅ Message sent: {msg_id}")

    # Read messages
    messages = read_messages("CCW-1")
    if not messages:
        print("❌ No messages received!")
        return False

    print(f"✅ Messages read: {len(messages)} found")

    # Move message
    success = move_message(msg_id, "inbox", "completed")
    if not success:
        print("❌ Failed to move message!")
        return False

    print("✅ Message moved successfully")

    return True


def test_directory_structure():
    """Test all required directories exist"""
    print("\n🔍 Testing directory structure...")

    required_dirs = [
        CLAUDE_DIR / "agents",
        CLAUDE_DIR / "scripts",
        CLAUDE_DIR / "messages" / "inbox",
        CLAUDE_DIR / "messages" / "processing",
        CLAUDE_DIR / "messages" / "completed",
        CLAUDE_DIR / "messages" / "failed",
    ]

    required_files = [
        CLAUDE_DIR / "agents" / "registry.json",
        CLAUDE_DIR / "scripts" / "send_message.py",
        CLAUDE_DIR / "scripts" / "read_messages.py",
        CLAUDE_DIR / "scripts" / "move_message.py",
        CLAUDE_DIR / "MASTER-AGENT-DEPLOYMENT.py",
    ]

    all_ok = True

    for directory in required_dirs:
        if not directory.exists():
            print(f"❌ Missing directory: {directory}")
            all_ok = False

    for file in required_files:
        if not file.exists():
            print(f"❌ Missing file: {file}")
            all_ok = False

    if all_ok:
        print("✅ All directories and files present")

    return all_ok


def main():
    print("=" * 50)
    print("CCW AGENT SYSTEM - VERIFICATION TEST")
    print("=" * 50)

    tests = [
        ("Directory Structure", test_directory_structure),
        ("Registry", test_registry),
        ("Messaging System", test_messaging),
    ]

    results = []

    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} FAILED with exception: {e}")
            results.append((test_name, False))

    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")

    print(f"\n{passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 ALL TESTS PASSED! System is ready to deploy.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
