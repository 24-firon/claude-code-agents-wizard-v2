#!/usr/bin/env python3
"""
Multi-Agent Message Reading Script
Reads messages for a specific agent
"""

import json
import os
from pathlib import Path
from datetime import datetime


def read_messages(agent_id, folder="inbox", filter_type=None, limit=None):
    """
    Read messages for a specific agent

    Args:
        agent_id (str): ID of the agent to read messages for
        folder (str): Which folder to read from ("inbox", "processing", "completed", "failed")
        filter_type (str): Optional message type filter
        limit (int): Maximum number of messages to return

    Returns:
        list: List of messages for the agent
    """

    # Get the .claude directory
    script_dir = Path(__file__).parent
    claude_dir = script_dir.parent
    msg_dir = claude_dir / "messages" / folder

    if not msg_dir.exists():
        print(f"⚠️  Message folder '{folder}' does not exist")
        return []

    # Read all message files
    messages = []
    for msg_file in sorted(msg_dir.glob("*.json")):
        try:
            with open(msg_file, 'r', encoding='utf-8') as f:
                msg = json.load(f)

            # Filter by agent_id (recipient)
            if msg.get("to") == agent_id:
                # Apply type filter if specified
                if filter_type is None or msg.get("type") == filter_type:
                    msg["_file"] = str(msg_file)  # Add file path for reference
                    messages.append(msg)

        except Exception as e:
            print(f"⚠️  Error reading {msg_file.name}: {e}")
            continue

    # Apply limit
    if limit:
        messages = messages[:limit]

    return messages


def print_messages(messages):
    """Pretty print messages"""
    if not messages:
        print("📭 No messages found")
        return

    print(f"\n📬 Found {len(messages)} message(s):\n")

    for msg in messages:
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"🆔 ID: {msg['id']}")
        print(f"📤 From: {msg['from']}")
        print(f"📥 To: {msg['to']}")
        print(f"📋 Type: {msg['type']}")
        print(f"⚡ Priority: {msg.get('priority', 'normal')}")
        print(f"🕒 Time: {msg['timestamp']}")
        print(f"📄 Content:")
        print(json.dumps(msg.get('content', {}), indent=2))
        print()


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python read_messages.py <agent_id> [folder] [filter_type] [limit]")
        print('Example: python read_messages.py CCW-1 inbox task_assignment 10')
        sys.exit(1)

    agent_id = sys.argv[1]
    folder = sys.argv[2] if len(sys.argv) > 2 else "inbox"
    filter_type = sys.argv[3] if len(sys.argv) > 3 else None
    limit = int(sys.argv[4]) if len(sys.argv) > 4 else None

    messages = read_messages(agent_id, folder, filter_type, limit)
    print_messages(messages)
