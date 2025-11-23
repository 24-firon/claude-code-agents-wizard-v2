#!/usr/bin/env python3
"""
Read Messages - CCW Messaging System
Reads messages from agent inbox
"""

import json
from pathlib import Path
from typing import List, Optional

def read_messages(agent_id: str, msg_type: Optional[str] = None) -> List[dict]:
    """
    Read messages from agent's inbox

    Args:
        agent_id: ID of the agent
        msg_type: Optional filter by message type

    Returns:
        List of message dictionaries
    """

    # Get inbox directory
    claude_dir = Path(__file__).parent.parent
    inbox_dir = claude_dir / "messages" / "inbox" / agent_id.lower()

    # Check if inbox exists
    if not inbox_dir.exists():
        inbox_dir.mkdir(parents=True, exist_ok=True)
        return []

    # Read all messages
    messages = []
    for message_file in inbox_dir.glob("*.json"):
        try:
            message = json.loads(message_file.read_text())

            # Filter by type if specified
            if msg_type is None or message.get("type") == msg_type:
                messages.append(message)

        except json.JSONDecodeError:
            print(f"⚠️  Invalid message file: {message_file}")
            continue

    # Sort by timestamp
    messages.sort(key=lambda m: m.get("timestamp", ""))

    return messages


if __name__ == "__main__":
    # Test
    messages = read_messages("CCW-1")
    print(f"📬 Found {len(messages)} messages")
    for msg in messages:
        print(f"  - {msg['type']} from {msg['from']}")
