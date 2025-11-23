#!/usr/bin/env python3
"""
Send Message - CENTRAL Multi-Agent Communication System
Uses central .claude directory for all repositories
"""

import json
import uuid
from datetime import datetime
from pathlib import Path

try:
    from central_config import get_inbox_path, ensure_central_structure
except ImportError:
    # Fallback if run standalone
    import sys
    sys.path.append(str(Path(__file__).parent))
    from central_config import get_inbox_path, ensure_central_structure


def send_message(from_agent: str, to_agent: str, msg_type: str, content: dict,
                 priority: str = "normal", repo: str = None):
    """
    Send a message via CENTRAL system

    Args:
        from_agent: Sender agent ID
        to_agent: Recipient agent ID
        msg_type: Message type
        content: Message content
        priority: Priority level
        repo: Repository context (optional)

    Returns:
        str: Message ID
    """
    # Ensure central structure exists
    ensure_central_structure()

    inbox_dir = get_inbox_path()

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
        "repo": repo,
        "content": content
    }

    # Save to CENTRAL inbox
    msg_file = inbox_dir / f"{timestamp.replace(':', '-')}_{from_agent}_to_{to_agent}_{msg_type}.json"

    with open(msg_file, 'w') as f:
        json.dump(message, f, indent=2)

    print(f"✅ Message sent (CENTRAL): {from_agent} → {to_agent}")
    print(f"   Type: {msg_type}")
    print(f"   Repo: {repo or 'N/A'}")
    print(f"   Priority: {priority}")
    print(f"   ID: {msg_id}")

    return msg_id


def send_task_request(from_agent: str, to_agent: str, task_description: str,
                      context: dict = None, priority: str = "normal", repo: str = None):
    """Send task request"""
    content = {
        "task": task_description,
        "context": context or {}
    }
    return send_message(from_agent, to_agent, "task_request", content, priority, repo)


def send_task_complete(from_agent: str, to_agent: str, task_id: str,
                       result: dict, success: bool = True, repo: str = None):
    """Send task completion"""
    content = {
        "task_id": task_id,
        "success": success,
        "result": result
    }
    return send_message(from_agent, to_agent, "task_complete", content, repo=repo)


def send_status_update(from_agent: str, to_agent: str, status: str,
                       message: str, data: dict = None, repo: str = None):
    """Send status update"""
    content = {
        "status": status,
        "message": message,
        "data": data or {}
    }
    return send_message(from_agent, to_agent, "status_update", content, repo=repo)


def send_error(from_agent: str, to_agent: str, error_message: str,
               error_details: dict = None, severity: str = "error", repo: str = None):
    """Send error notification"""
    content = {
        "error": error_message,
        "severity": severity,
        "details": error_details or {}
    }
    priority = "high" if severity == "critical" else "normal"
    return send_message(from_agent, to_agent, "error", content, priority, repo)


if __name__ == "__main__":
    print("🧪 Testing CENTRAL send_message...")

    msg_id = send_message(
        from_agent="TEST",
        to_agent="HUMAN",
        msg_type="status_update",
        content={"message": "CENTRAL system test!"},
        repo="test-repo"
    )

    print(f"\n✅ Test complete! Message ID: {msg_id}")
