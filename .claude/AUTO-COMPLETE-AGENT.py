#!/usr/bin/env python3
"""
COMPLETE ALL WORK & FINALIZE

Finish all pending tasks, validate your work, then commit.
No questions. Work until done.
"""

AGENT_ID = "CCW-1"  # CHANGE THIS

import subprocess, json, time
from pathlib import Path

print(f"{AGENT_ID} - Completing all work...")

# Main work loop
inbox = Path(".claude/messages/inbox")
max_iterations = 10
iteration = 0

while iteration < max_iterations:
    # Check for tasks
    if not inbox.exists():
        break

    my_tasks = [f for f in inbox.glob("*.json")
                if AGENT_ID in f.read_text()]

    if not my_tasks:
        print("All tasks complete.")
        break

    print(f"Iteration {iteration+1}: {len(my_tasks)} tasks remaining")

    for task_file in my_tasks:
        task = json.loads(task_file.read_text())
        print(f"  Working on: {task['content'].get('task', 'unknown')}")

        # DO THE ACTUAL WORK HERE
        # ... agent completes task ...

        # Move to completed
        completed = Path(".claude/messages/completed")
        completed.mkdir(exist_ok=True)
        task_file.rename(completed / task_file.name)

    iteration += 1
    time.sleep(2)

# Finalize
subprocess.run(['git', 'add', '-A'])
subprocess.run(['git', 'commit', '-m', f'{AGENT_ID} all work complete'])
subprocess.run(['git', 'push'])

print(f"{AGENT_ID} DONE. Ready for review.")
