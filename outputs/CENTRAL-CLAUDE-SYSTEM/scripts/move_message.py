#!/usr/bin/env python3
"""
Move Message - CENTRAL Multi-Agent Communication System
"""

import json
import shutil
from pathlib import Path
from typing import Optional

try:
    from central_config import get_messages_dir, ensure_central_structure
except ImportError:
    import sys
    sys.path.append(str(Path(__file__).parent))
    from central_config import get_messages_dir, ensure_central_structure


def move_message(msg_id: str, to_folder: str, agent_id: Optional[str] = None) -> bool:
    """
    Move message between folders in CENTRAL system

    Args:
        msg_id: Message ID
        to_folder: Destination (processing, completed, failed)
        agent_id: Agent performing move

    Returns:
        bool: Success
    """
    ensure_central_structure()

    messages_dir = get_messages_dir()

    valid_folders = ["inbox", "processing", "completed", "failed"]
    if to_folder not in valid_folders:
        print(f"❌ Invalid folder: {to_folder}")
        return False

    # Find message
    msg_file = None
    current_folder = None

    for folder in valid_folders:
        folder_path = messages_dir / folder
        if not folder_path.exists():
            continue

        for file in folder_path.glob("*.json"):
            try:
                with open(file, 'r') as f:
                    msg = json.load(f)

                if msg.get("id") == msg_id:
                    msg_file = file
                    current_folder = folder
                    break

            except Exception:
                continue

        if msg_file:
            break

    if not msg_file:
        print(f"❌ Message {msg_id} not found")
        return False

    # Move file
    dest_folder = messages_dir / to_folder
    dest_folder.mkdir(parents=True, exist_ok=True)
    dest_file = dest_folder / msg_file.name

    try:
        shutil.move(str(msg_file), str(dest_file))
        print(f"✅ Message moved (CENTRAL): {current_folder} → {to_folder}")
        print(f"   ID: {msg_id}")

        # Update status
        if agent_id:
            with open(dest_file, 'r') as f:
                msg = json.load(f)

            msg["moved_by"] = agent_id
            msg["moved_at"] = __import__('datetime').datetime.utcnow().isoformat() + "Z"

            if to_folder == "processing":
                msg["status"] = "processing"
            elif to_folder == "completed":
                msg["status"] = "completed"
            elif to_folder == "failed":
                msg["status"] = "failed"

            with open(dest_file, 'w') as f:
                json.dump(msg, f, indent=2)

        return True

    except Exception as e:
        print(f"❌ Error moving message: {e}")
        return False


def move_to_processing(msg_id: str, agent_id: str) -> bool:
    """Move to processing"""
    return move_message(msg_id, "processing", agent_id)


def move_to_completed(msg_id: str, agent_id: str) -> bool:
    """Move to completed"""
    return move_message(msg_id, "completed", agent_id)


def move_to_failed(msg_id: str, agent_id: str, reason: Optional[str] = None) -> bool:
    """Move to failed"""
    return move_message(msg_id, "failed", agent_id)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 2:
        msg_id = sys.argv[1]
        to_folder = sys.argv[2]
        agent_id = sys.argv[3] if len(sys.argv) > 3 else "SYSTEM"

        move_message(msg_id, to_folder, agent_id)
    else:
        print("Usage: python move_message.py <msg_id> <to_folder> [agent_id]")
