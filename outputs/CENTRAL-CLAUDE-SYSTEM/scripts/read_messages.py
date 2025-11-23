#!/usr/bin/env python3
"""
Read Messages - CENTRAL Multi-Agent Communication System
"""

import json
from pathlib import Path
from typing import List, Dict, Optional

try:
    from central_config import get_inbox_path, ensure_central_structure
except ImportError:
    import sys
    sys.path.append(str(Path(__file__).parent))
    from central_config import get_inbox_path, ensure_central_structure


def read_messages(agent_id: str, message_type: Optional[str] = None,
                  priority: Optional[str] = None, repo: Optional[str] = None,
                  unread_only: bool = True) -> List[Dict]:
    """
    Read messages from CENTRAL system

    Args:
        agent_id: Agent ID to read messages for
        message_type: Filter by type
        priority: Filter by priority
        repo: Filter by repository
        unread_only: Only unread messages

    Returns:
        List of messages
    """
    ensure_central_structure()

    inbox_dir = get_inbox_path()

    if not inbox_dir.exists():
        return []

    messages = []

    for msg_file in inbox_dir.glob("*.json"):
        try:
            with open(msg_file, 'r') as f:
                msg = json.load(f)

            # Filter by recipient
            if msg.get("to") != agent_id and msg.get("to") != "ALL":
                continue

            # Apply filters
            if message_type and msg.get("type") != message_type:
                continue

            if priority and msg.get("priority") != priority:
                continue

            if repo and msg.get("repo") != repo:
                continue

            if unread_only and msg.get("status") != "pending":
                continue

            msg["_file"] = str(msg_file)
            messages.append(msg)

        except Exception as e:
            print(f"⚠️ Error reading {msg_file.name}: {e}")

    # Sort by timestamp (newest first)
    messages.sort(key=lambda m: m.get("timestamp", ""), reverse=True)

    return messages


def get_message_by_id(msg_id: str) -> Optional[Dict]:
    """Get specific message by ID"""
    inbox_dir = get_inbox_path()

    if not inbox_dir.exists():
        return None

    for msg_file in inbox_dir.glob("*.json"):
        try:
            with open(msg_file, 'r') as f:
                msg = json.load(f)

            if msg.get("id") == msg_id:
                msg["_file"] = str(msg_file)
                return msg

        except Exception:
            continue

    return None


def print_messages(messages: List[Dict], show_content: bool = False):
    """Pretty print messages"""
    if not messages:
        print("📭 No messages")
        return

    print(f"\n📬 {len(messages)} message(s):\n")

    for i, msg in enumerate(messages, 1):
        status_emoji = "🆕" if msg.get("status") == "pending" else "✅"
        priority_emoji = {
            "critical": "🔴",
            "high": "🟠",
            "normal": "🟢",
            "low": "⚪"
        }.get(msg.get("priority", "normal"), "🟢")

        repo_info = f" [{msg.get('repo')}]" if msg.get('repo') else ""

        print(f"{i}. {status_emoji} {priority_emoji} [{msg.get('type')}] {msg.get('from')} → {msg.get('to')}{repo_info}")
        print(f"   🕐 {msg.get('timestamp')}")
        print(f"   🆔 {msg.get('id')}")

        if show_content:
            print(f"   📄 Content:")
            content = msg.get("content", {})
            for key, value in content.items():
                print(f"      {key}: {value}")

        print()


if __name__ == "__main__":
    import sys

    agent_id = sys.argv[1] if len(sys.argv) > 1 else "HUMAN"

    print(f"🔍 Reading messages for {agent_id} (CENTRAL)...\n")

    messages = read_messages(agent_id, unread_only=True)
    print_messages(messages, show_content=True)
