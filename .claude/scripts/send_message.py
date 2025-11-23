#!/usr/bin/env python3
"""
Send Message - Multi-Agent Communication System
Allows agents to send messages to each other via shared filesystem
"""

import json
import os
from datetime import datetime
from pathlib import Path
import uuid


def send_message(from_agent: str, to_agent: str, msg_type: str, content: dict, priority: str = "normal"):
    """
    Send a message from one agent to another

    Args:
        from_agent: Sender agent ID (e.g., "CCW-1", "CEO", "PM-1")
        to_agent: Recipient agent ID (e.g., "CCW-2", "HUMAN", "FRONTEND-1")
        msg_type: Type of message (status_update, task_request, task_complete, error, question)
        content: Message content as dictionary
        priority: Message priority (low, normal, high, critical)

    Returns:
        str: Message ID
    """
    # Get repo root
    repo_root = Path(__file__).parent.parent.parent
    inbox_dir = repo_root / ".claude" / "messages" / "inbox"

    # Create inbox if doesn't exist
    inbox_dir.mkdir(parents=True, exist_ok=True)

    # Generate message ID
    msg_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + "Z"

    # Create message
    message = {
        "id": msg_id,
        "from": from_agent,
        "to": to_agent,
        "type": msg_type,
        "priority": priority,
        "timestamp": timestamp,
        "status": "pending",
        "content": content
    }

    # Save to inbox
    msg_file = inbox_dir / f"{timestamp.replace(':', '-')}_{from_agent}_to_{to_agent}_{msg_type}.json"

    with open(msg_file, 'w') as f:
        json.dump(message, f, indent=2)

    print(f"✅ Message sent: {from_agent} → {to_agent} ({msg_type})")
    print(f"📁 File: {msg_file.name}")
    print(f"🆔 ID: {msg_id}")

    return msg_id


def send_task_request(from_agent: str, to_agent: str, task_description: str, context: dict = None, priority: str = "normal"):
    """
    Convenience function to send a task request

    Args:
        from_agent: Sender agent ID
        to_agent: Recipient agent ID
        task_description: What task to perform
        context: Additional context (files, dependencies, etc.)
        priority: Task priority

    Returns:
        str: Message ID
    """
    content = {
        "task": task_description,
        "context": context or {}
    }

    return send_message(from_agent, to_agent, "task_request", content, priority)


def send_task_complete(from_agent: str, to_agent: str, task_id: str, result: dict, success: bool = True):
    """
    Convenience function to send task completion notification

    Args:
        from_agent: Sender agent ID (worker who completed task)
        to_agent: Recipient agent ID (typically the requester)
        task_id: Original task message ID
        result: Task result data
        success: Whether task completed successfully

    Returns:
        str: Message ID
    """
    content = {
        "task_id": task_id,
        "success": success,
        "result": result
    }

    return send_message(from_agent, to_agent, "task_complete", content)


def send_status_update(from_agent: str, to_agent: str, status: str, message: str, data: dict = None):
    """
    Convenience function to send status update

    Args:
        from_agent: Sender agent ID
        to_agent: Recipient agent ID (typically "HUMAN" or "CEO")
        status: Status (online, working, idle, error, blocked)
        message: Human-readable status message
        data: Additional status data

    Returns:
        str: Message ID
    """
    content = {
        "status": status,
        "message": message,
        "data": data or {}
    }

    return send_message(from_agent, to_agent, "status_update", content)


def send_error(from_agent: str, to_agent: str, error_message: str, error_details: dict = None, severity: str = "error"):
    """
    Convenience function to send error notification

    Args:
        from_agent: Sender agent ID
        to_agent: Recipient agent ID (typically "CEO" or "HUMAN")
        error_message: Error description
        error_details: Stack trace, context, etc.
        severity: Error severity (warning, error, critical)

    Returns:
        str: Message ID
    """
    content = {
        "error": error_message,
        "severity": severity,
        "details": error_details or {}
    }

    return send_message(from_agent, to_agent, "error", content, priority="high" if severity == "critical" else "normal")


if __name__ == "__main__":
    # Example usage
    print("🧪 Testing send_message system...")

    # Test basic message
    msg_id = send_message(
        from_agent="TEST-AGENT",
        to_agent="HUMAN",
        msg_type="status_update",
        content={"status": "online", "message": "Test message sent!"}
    )

    print(f"\n✅ Test complete! Message ID: {msg_id}")
