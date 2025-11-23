#!/usr/bin/env python3
"""
Multi-Agent Message Sending Script
Sends messages between agents in the Claude Code orchestration system
"""

import json
import os
from datetime import datetime
from pathlib import Path
import uuid


def send_message(from_agent, to_agent, msg_type, content, priority="normal"):
    """
    Send a message from one agent to another

    Args:
        from_agent (str): ID of the sending agent (e.g., "CEO", "CCW-1", "CCW-2")
        to_agent (str): ID of the receiving agent (e.g., "HUMAN", "CEO", "CCW-1")
        msg_type (str): Type of message (e.g., "task_assignment", "status_update", "completion_report")
        content (dict): Message content/payload
        priority (str): Message priority ("low", "normal", "high", "urgent")

    Returns:
        str: Message ID
    """

    # Get the .claude directory (go up from scripts/)
    script_dir = Path(__file__).parent
    claude_dir = script_dir.parent
    inbox_dir = claude_dir / "messages" / "inbox"

    # Ensure inbox exists
    inbox_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique message ID
    msg_id = f"msg-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-{uuid.uuid4().hex[:8]}"

    # Create message structure
    message = {
        "id": msg_id,
        "from": from_agent,
        "to": to_agent,
        "type": msg_type,
        "priority": priority,
        "content": content,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "pending",
        "metadata": {
            "created_at": datetime.utcnow().isoformat() + "Z",
            "version": "2.0"
        }
    }

    # Write message to inbox
    msg_file = inbox_dir / f"{msg_id}.json"
    with open(msg_file, 'w', encoding='utf-8') as f:
        json.dump(message, f, indent=2, ensure_ascii=False)

    print(f"✅ Message sent: {msg_id}")
    print(f"   From: {from_agent} → To: {to_agent}")
    print(f"   Type: {msg_type}")
    print(f"   Priority: {priority}")

    return msg_id


if __name__ == "__main__":
    # Example usage
    import sys

    if len(sys.argv) < 5:
        print("Usage: python send_message.py <from_agent> <to_agent> <msg_type> <content_json>")
        print('Example: python send_message.py CEO CCW-1 task_assignment \'{"task": "test"}\'')
        sys.exit(1)

    from_agent = sys.argv[1]
    to_agent = sys.argv[2]
    msg_type = sys.argv[3]
    content = json.loads(sys.argv[4])

    priority = sys.argv[5] if len(sys.argv) > 5 else "normal"

    send_message(from_agent, to_agent, msg_type, content, priority)
