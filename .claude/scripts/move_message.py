#!/usr/bin/env python3
"""
Multi-Agent Message Movement Script
Moves messages between folders (inbox -> processing -> completed/failed)
"""

import json
import os
import shutil
from pathlib import Path
from datetime import datetime


def move_message(msg_id, from_folder, to_folder, update_status=True):
    """
    Move a message from one folder to another

    Args:
        msg_id (str): Message ID to move
        from_folder (str): Source folder ("inbox", "processing", "completed", "failed")
        to_folder (str): Destination folder
        update_status (bool): Whether to update the message status field

    Returns:
        bool: True if successful, False otherwise
    """

    # Get the .claude directory
    script_dir = Path(__file__).parent
    claude_dir = script_dir.parent
    messages_dir = claude_dir / "messages"

    from_path = messages_dir / from_folder
    to_path = messages_dir / to_folder

    # Ensure destination exists
    to_path.mkdir(parents=True, exist_ok=True)

    # Find the message file
    msg_file = from_path / f"{msg_id}.json"

    if not msg_file.exists():
        print(f"❌ Message {msg_id} not found in {from_folder}")
        return False

    # Read and optionally update the message
    if update_status:
        try:
            with open(msg_file, 'r', encoding='utf-8') as f:
                msg = json.load(f)

            # Update status based on destination folder
            status_map = {
                "inbox": "pending",
                "processing": "processing",
                "completed": "completed",
                "failed": "failed"
            }

            msg["status"] = status_map.get(to_folder, msg.get("status"))

            # Add movement metadata
            if "movements" not in msg.get("metadata", {}):
                if "metadata" not in msg:
                    msg["metadata"] = {}
                msg["metadata"]["movements"] = []

            msg["metadata"]["movements"].append({
                "from": from_folder,
                "to": to_folder,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            })

            # Write updated message to new location
            dest_file = to_path / f"{msg_id}.json"
            with open(dest_file, 'w', encoding='utf-8') as f:
                json.dump(msg, f, indent=2, ensure_ascii=False)

            # Remove from source
            msg_file.unlink()

        except Exception as e:
            print(f"❌ Error updating message: {e}")
            return False
    else:
        # Simple move without updating
        dest_file = to_path / f"{msg_id}.json"
        shutil.move(str(msg_file), str(dest_file))

    print(f"✅ Moved message {msg_id}")
    print(f"   {from_folder} → {to_folder}")

    return True


def move_all_messages(from_folder, to_folder, filter_func=None):
    """
    Move all messages from one folder to another

    Args:
        from_folder (str): Source folder
        to_folder (str): Destination folder
        filter_func (callable): Optional function to filter messages (receives msg dict)

    Returns:
        int: Number of messages moved
    """

    script_dir = Path(__file__).parent
    claude_dir = script_dir.parent
    from_path = claude_dir / "messages" / from_folder

    if not from_path.exists():
        print(f"⚠️  Source folder '{from_folder}' does not exist")
        return 0

    moved_count = 0

    for msg_file in from_path.glob("*.json"):
        try:
            # Read message to check filter
            if filter_func:
                with open(msg_file, 'r', encoding='utf-8') as f:
                    msg = json.load(f)

                if not filter_func(msg):
                    continue

            msg_id = msg_file.stem  # filename without .json

            if move_message(msg_id, from_folder, to_folder):
                moved_count += 1

        except Exception as e:
            print(f"⚠️  Error processing {msg_file.name}: {e}")
            continue

    print(f"\n✅ Moved {moved_count} message(s) from {from_folder} to {to_folder}")

    return moved_count


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 4:
        print("Usage: python move_message.py <msg_id> <from_folder> <to_folder>")
        print('Example: python move_message.py msg-20251123-120000-abc123 inbox processing')
        sys.exit(1)

    msg_id = sys.argv[1]
    from_folder = sys.argv[2]
    to_folder = sys.argv[3]

    move_message(msg_id, from_folder, to_folder)
