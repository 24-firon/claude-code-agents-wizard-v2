#!/usr/bin/env python3
"""
Move Message - Multi-Agent Communication System
Move messages between folders (inbox → processing → completed/failed)
"""

import json
import shutil
from pathlib import Path
from typing import Optional
import os


def move_message(msg_id: str, to_folder: str, agent_id: Optional[str] = None) -> bool:
    """
    Move a message to a different folder

    Args:
        msg_id: Message ID to move
        to_folder: Destination folder (processing, completed, failed)
        agent_id: Agent performing the move (optional, for logging)

    Returns:
        bool: Success status
    """
    # Get repo root
    repo_root = Path(__file__).parent.parent.parent
    messages_dir = repo_root / ".claude" / "messages"

    # Valid folders
    valid_folders = ["inbox", "processing", "completed", "failed"]
    if to_folder not in valid_folders:
        print(f"❌ Invalid folder: {to_folder}. Must be one of: {valid_folders}")
        return False

    # Find message in all folders
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

    # Create destination folder
    dest_folder = messages_dir / to_folder
    dest_folder.mkdir(parents=True, exist_ok=True)

    # Move file
    dest_file = dest_folder / msg_file.name

    try:
        shutil.move(str(msg_file), str(dest_file))
        print(f"✅ Message moved: {current_folder} → {to_folder}")
        print(f"   🆔 {msg_id}")
        print(f"   📁 {msg_file.name}")

        # Update message status in the file
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
    """
    Convenience function: Move message to processing folder

    Args:
        msg_id: Message ID
        agent_id: Agent who is processing the message

    Returns:
        bool: Success status
    """
    return move_message(msg_id, "processing", agent_id)


def move_to_completed(msg_id: str, agent_id: str) -> bool:
    """
    Convenience function: Move message to completed folder

    Args:
        msg_id: Message ID
        agent_id: Agent who completed the task

    Returns:
        bool: Success status
    """
    return move_message(msg_id, "completed", agent_id)


def move_to_failed(msg_id: str, agent_id: str, reason: Optional[str] = None) -> bool:
    """
    Convenience function: Move message to failed folder

    Args:
        msg_id: Message ID
        agent_id: Agent reporting the failure
        reason: Failure reason (optional)

    Returns:
        bool: Success status
    """
    success = move_message(msg_id, "failed", agent_id)

    if success and reason:
        # Add failure reason to message
        repo_root = Path(__file__).parent.parent.parent
        dest_file = repo_root / ".claude" / "messages" / "failed" / f"*{msg_id}*.json"

        # Find the file
        failed_folder = repo_root / ".claude" / "messages" / "failed"
        for file in failed_folder.glob("*.json"):
            try:
                with open(file, 'r') as f:
                    msg = json.load(f)

                if msg.get("id") == msg_id:
                    msg["failure_reason"] = reason

                    with open(file, 'w') as f:
                        json.dump(msg, f, indent=2)

                    print(f"   ⚠️ Failure reason: {reason}")
                    break

            except Exception:
                continue

    return success


def cleanup_old_messages(days: int = 30, folder: str = "completed"):
    """
    Delete messages older than specified days

    Args:
        days: Delete messages older than this many days
        folder: Which folder to clean (completed, failed)
    """
    from datetime import datetime, timedelta

    repo_root = Path(__file__).parent.parent.parent
    messages_dir = repo_root / ".claude" / "messages" / folder

    if not messages_dir.exists():
        print(f"📁 {folder} folder doesn't exist")
        return

    cutoff_date = datetime.utcnow() - timedelta(days=days)
    deleted_count = 0

    for msg_file in messages_dir.glob("*.json"):
        try:
            with open(msg_file, 'r') as f:
                msg = json.load(f)

            msg_date = datetime.fromisoformat(msg.get("timestamp", "").replace("Z", ""))

            if msg_date < cutoff_date:
                os.remove(msg_file)
                deleted_count += 1

        except Exception as e:
            print(f"⚠️ Error processing {msg_file.name}: {e}")

    print(f"🗑️ Deleted {deleted_count} message(s) older than {days} days from {folder}/")


if __name__ == "__main__":
    import sys

    # Example usage
    if len(sys.argv) > 2:
        msg_id = sys.argv[1]
        to_folder = sys.argv[2]
        agent_id = sys.argv[3] if len(sys.argv) > 3 else "SYSTEM"

        move_message(msg_id, to_folder, agent_id)
    else:
        print("Usage: python move_message.py <msg_id> <to_folder> [agent_id]")
        print("Example: python move_message.py abc123 processing CCW-1")
