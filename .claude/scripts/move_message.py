#!/usr/bin/env python3
"""
Move Message - CCW Messaging System
Moves messages between different status folders
"""

import json
import shutil
from pathlib import Path

def move_message(message_id: str, from_folder: str, to_folder: str) -> bool:
    """
    Move a message between folders (inbox, processing, completed, failed)

    Args:
        message_id: UUID of the message
        from_folder: Source folder name (inbox, processing, completed, failed)
        to_folder: Destination folder name

    Returns:
        True if successful, False otherwise
    """

    claude_dir = Path(__file__).parent.parent
    messages_dir = claude_dir / "messages"

    # Find the message in source folder
    source_file = None

    # Search in from_folder for all agent subdirectories
    from_base = messages_dir / from_folder
    if from_base.exists():
        for agent_dir in from_base.iterdir():
            if agent_dir.is_dir():
                potential_file = agent_dir / f"{message_id}.json"
                if potential_file.exists():
                    source_file = potential_file
                    break

    # Also check root of from_folder
    root_file = from_base / f"{message_id}.json"
    if root_file.exists():
        source_file = root_file

    if not source_file:
        print(f"❌ Message {message_id} not found in {from_folder}")
        return False

    # Read message to get agent info
    try:
        message = json.loads(source_file.read_text())
        agent_id = message.get("to", "unknown").lower()
    except:
        agent_id = "unknown"

    # Create destination directory
    to_dir = messages_dir / to_folder / agent_id
    to_dir.mkdir(parents=True, exist_ok=True)

    # Move the file
    dest_file = to_dir / f"{message_id}.json"

    try:
        shutil.move(str(source_file), str(dest_file))
        print(f"📦 Moved {message_id}: {from_folder} → {to_folder}")
        return True
    except Exception as e:
        print(f"❌ Failed to move message: {e}")
        return False


if __name__ == "__main__":
    # Test
    import sys
    if len(sys.argv) == 4:
        msg_id, from_f, to_f = sys.argv[1:4]
        move_message(msg_id, from_f, to_f)
    else:
        print("Usage: python move_message.py <message_id> <from_folder> <to_folder>")
