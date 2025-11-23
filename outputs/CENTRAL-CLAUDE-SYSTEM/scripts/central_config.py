#!/usr/bin/env python3
"""
Central Configuration - Multi-Agent Communication System
Handles path resolution for central vs repo-local installations
"""

import os
from pathlib import Path


def get_central_dir():
    """
    Get the central .claude directory path

    Priority:
    1. CENTRAL_CLAUDE_DIR environment variable
    2. C:/Ground-Zero/.claude (Windows)
    3. ~/Ground-Zero/.claude (Unix)
    4. Current repo's .claude (fallback)

    Returns:
        Path: Central directory path
    """
    # Check environment variable first
    if 'CENTRAL_CLAUDE_DIR' in os.environ:
        return Path(os.environ['CENTRAL_CLAUDE_DIR'])

    # Platform-specific defaults
    if os.name == 'nt':  # Windows
        default = Path('C:/Ground-Zero/.claude')
    else:  # Unix/Linux/Mac
        default = Path.home() / 'Ground-Zero' / '.claude'

    # Check if default exists
    if default.exists():
        return default

    # Fallback to repo-local
    return Path(__file__).parent.parent.parent / '.claude'


def set_central_dir(path: str):
    """
    Set the central directory path

    Args:
        path: Path to central .claude directory
    """
    os.environ['CENTRAL_CLAUDE_DIR'] = str(path)
    print(f"✅ CENTRAL_CLAUDE_DIR set to: {path}")


# Global central directory
CENTRAL_DIR = get_central_dir()


def get_agents_dir():
    """Get agents directory"""
    return CENTRAL_DIR / 'agents'


def get_messages_dir():
    """Get messages directory"""
    return CENTRAL_DIR / 'messages'


def get_tasks_dir():
    """Get tasks directory"""
    return CENTRAL_DIR / 'tasks'


def get_coordination_dir():
    """Get coordination directory"""
    return CENTRAL_DIR / 'coordination'


def get_scripts_dir():
    """Get scripts directory"""
    return CENTRAL_DIR / 'scripts'


def ensure_central_structure():
    """
    Ensure central directory structure exists
    Creates all required directories if they don't exist
    """
    dirs = [
        get_agents_dir(),
        get_messages_dir() / 'inbox',
        get_messages_dir() / 'processing',
        get_messages_dir() / 'completed',
        get_messages_dir() / 'failed',
        get_tasks_dir(),
        get_coordination_dir() / 'logs',
        get_scripts_dir()
    ]

    for dir_path in dirs:
        dir_path.mkdir(parents=True, exist_ok=True)

    print(f"✅ Central structure verified: {CENTRAL_DIR}")


def get_registry_path():
    """Get agent registry file path"""
    return get_agents_dir() / 'registry.json'


def get_inbox_path():
    """Get inbox directory path"""
    return get_messages_dir() / 'inbox'


def get_processing_path():
    """Get processing directory path"""
    return get_messages_dir() / 'processing'


def get_completed_path():
    """Get completed directory path"""
    return get_messages_dir() / 'completed'


def get_failed_path():
    """Get failed directory path"""
    return get_messages_dir() / 'failed'


if __name__ == "__main__":
    print("🔍 Central Claude System Configuration\n")
    print(f"CENTRAL_DIR: {CENTRAL_DIR}")
    print(f"  Agents: {get_agents_dir()}")
    print(f"  Messages: {get_messages_dir()}")
    print(f"  Tasks: {get_tasks_dir()}")
    print(f"  Coordination: {get_coordination_dir()}")
    print(f"  Scripts: {get_scripts_dir()}")

    print(f"\nExists: {CENTRAL_DIR.exists()}")

    if not CENTRAL_DIR.exists():
        print("\n⚠️ Central directory doesn't exist yet!")
        print("   Run: python install_central.py")
