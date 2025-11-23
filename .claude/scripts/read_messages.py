#!/usr/bin/env python3
"""
Read Messages - Multi-Agent Communication System
Allows agents to read their incoming messages
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional


def read_messages(agent_id: str, msg_type: Optional[str] = None, priority: Optional[str] = None, unread_only: bool = True) -> List[Dict]:
    """
    Read messages for a specific agent

    Args:
        agent_id: Agent ID to read messages for (e.g., "CCW-1", "CEO")
        msg_type: Filter by message type (status_update, task_request, etc.)
        priority: Filter by priority (low, normal, high, critical)
        unread_only: Only return unread messages (status=pending)

    Returns:
        List of messages sorted by timestamp (newest first)
    """
    # Get repo root
    repo_root = Path(__file__).parent.parent.parent
    inbox_dir = repo_root / ".claude" / "messages" / "inbox"

    if not inbox_dir.exists():
        print(f"📭 No messages (inbox doesn't exist)")
        return []

    messages = []

    # Read all message files
    for msg_file in inbox_dir.glob("*.json"):
        try:
            with open(msg_file, 'r') as f:
                msg = json.load(f)

            # Check if message is for this agent
            if msg.get("to") != agent_id and msg.get("to") != "ALL":
                continue

            # Apply filters
            if msg_type and msg.get("type") != msg_type:
                continue

            if priority and msg.get("priority") != priority:
                continue

            if unread_only and msg.get("status") != "pending":
                continue

            # Add file path for later processing
            msg["_file"] = str(msg_file)

            messages.append(msg)

        except Exception as e:
            print(f"⚠️ Error reading {msg_file.name}: {e}")

    # Sort by timestamp (newest first)
    messages.sort(key=lambda m: m.get("timestamp", ""), reverse=True)

    return messages


def get_message_by_id(msg_id: str) -> Optional[Dict]:
    """
    Get a specific message by ID

    Args:
        msg_id: Message ID

    Returns:
        Message dict or None if not found
    """
    repo_root = Path(__file__).parent.parent.parent
    inbox_dir = repo_root / ".claude" / "messages" / "inbox"

    if not inbox_dir.exists():
        return None

    for msg_file in inbox_dir.glob("*.json"):
        try:
            with open(msg_file, 'r') as f:
                msg = json.load(f)

            if msg.get("id") == msg_id:
                msg["_file"] = str(msg_file)
                return msg

        except Exception as e:
            continue

    return None


def mark_message_read(msg_id: str, agent_id: str):
    """
    Mark a message as read by updating its status

    Args:
        msg_id: Message ID
        agent_id: Agent who read the message
    """
    msg = get_message_by_id(msg_id)

    if not msg:
        print(f"❌ Message {msg_id} not found")
        return

    msg_file = Path(msg["_file"])

    # Update status
    msg["status"] = "read"
    msg["read_by"] = agent_id
    msg["read_at"] = datetime.utcnow().isoformat() + "Z"

    # Remove internal fields
    if "_file" in msg:
        del msg["_file"]

    # Save updated message
    with open(msg_file, 'w') as f:
        json.dump(msg, f, indent=2)

    print(f"✅ Message {msg_id} marked as read by {agent_id}")


def get_messages_summary(agent_id: str) -> Dict:
    """
    Get summary of messages for an agent

    Args:
        agent_id: Agent ID

    Returns:
        Summary dict with counts by type and priority
    """
    messages = read_messages(agent_id, unread_only=False)

    summary = {
        "total": len(messages),
        "unread": len([m for m in messages if m.get("status") == "pending"]),
        "by_type": {},
        "by_priority": {
            "critical": 0,
            "high": 0,
            "normal": 0,
            "low": 0
        }
    }

    for msg in messages:
        # Count by type
        msg_type = msg.get("type", "unknown")
        summary["by_type"][msg_type] = summary["by_type"].get(msg_type, 0) + 1

        # Count by priority (only unread)
        if msg.get("status") == "pending":
            priority = msg.get("priority", "normal")
            summary["by_priority"][priority] += 1

    return summary


def print_messages(messages: List[Dict], show_content: bool = False):
    """
    Pretty print messages

    Args:
        messages: List of messages to print
        show_content: Whether to print full message content
    """
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

        print(f"{i}. {status_emoji} {priority_emoji} [{msg.get('type')}] {msg.get('from')} → {msg.get('to')}")
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

    # Example usage
    if len(sys.argv) > 1:
        agent_id = sys.argv[1]
    else:
        agent_id = "HUMAN"

    print(f"🔍 Reading messages for {agent_id}...\n")

    # Get summary
    summary = get_messages_summary(agent_id)
    print(f"📊 Summary:")
    print(f"   Total: {summary['total']}")
    print(f"   Unread: {summary['unread']}")
    print(f"   By Priority: {summary['by_priority']}")
    print(f"   By Type: {summary['by_type']}")

    # Read unread messages
    messages = read_messages(agent_id, unread_only=True)
    print_messages(messages, show_content=True)
