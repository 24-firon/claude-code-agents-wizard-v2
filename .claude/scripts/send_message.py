#!/usr/bin/env python3
"""
Send Message - CCW Messaging System
Sends messages between agents in the Claude Code Wizard system
"""

import json
import uuid
from datetime import datetime
from pathlib import Path

def send_message(from_agent: str, to_agent: str, msg_type: str, content: dict) -> str:
    """
    Send a message from one agent to another

    Args:
        from_agent: ID of sending agent
        to_agent: ID of receiving agent
        msg_type: Type of message (task_assignment, status_update, task_result, heartbeat)
        content: Message content as dictionary

    Returns:
        message_id: Unique ID of the sent message
    """

    # Generate unique message ID
    message_id = str(uuid.uuid4())

    # Create message structure
    message = {
        "id": message_id,
        "from": from_agent,
        "to": to_agent,
        "type": msg_type,
        "content": content,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "pending"
    }

    # Determine message directory
    claude_dir = Path(__file__).parent.parent

    # Route to appropriate inbox
    if to_agent == "HUMAN":
        inbox_dir = claude_dir / "messages" / "inbox" / "human"
    else:
        inbox_dir = claude_dir / "messages" / "inbox" / to_agent.lower()

    # Create inbox if it doesn't exist
    inbox_dir.mkdir(parents=True, exist_ok=True)

    # Save message
    message_file = inbox_dir / f"{message_id}.json"
    message_file.write_text(json.dumps(message, indent=2))

    # Log
    print(f"📨 {from_agent} → {to_agent}: {msg_type}")

    return message_id


if __name__ == "__main__":
    # Test
    msg_id = send_message(
        "CCW-1",
        "HUMAN",
        "status_update",
        {"status": "online", "message": "Test message"}
    )
    print(f"✅ Message sent: {msg_id}")
