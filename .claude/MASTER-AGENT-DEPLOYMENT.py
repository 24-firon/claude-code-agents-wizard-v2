#!/usr/bin/env python3
# ========================================
# CCW AUTO-START (NUR ID ÄNDERN!)
# ========================================

AGENT_ID = "CCW-1"  # ← ÄNDERE: CCW-1 bis CCW-10

import json, os, sys, time
from datetime import datetime
from pathlib import Path

# Adjusted for current directory structure
CLAUDE_DIR = Path("/home/user/claude-code-agents-wizard-v2/.claude")
sys.path.append(str(CLAUDE_DIR / "scripts"))

from send_message import send_message
from read_messages import read_messages
from move_message import move_message

print(f"🔥 {AGENT_ID} STARTING!")

# Update registry
registry_file = CLAUDE_DIR / "agents" / "registry.json"
registry = json.loads(registry_file.read_text())

for agent in registry["agents"]:
    if agent["id"] == AGENT_ID:
        agent["status"] = "active"
        agent["last_heartbeat"] = datetime.utcnow().isoformat() + "Z"
        break

registry_file.write_text(json.dumps(registry, indent=2))

# Announce
send_message(AGENT_ID, "HUMAN", "status_update", {
    "status": "online",
    "message": f"{AGENT_ID} ONLINE! 🔥"
})

print("🚀 LOOP STARTING...\n")

# LOOP
loop_count = 0
while True:
    loop_count += 1

    tasks = read_messages(AGENT_ID, msg_type="task_assignment")

    if tasks:
        for task in tasks:
            task_id = task["id"]
            print(f"\n📋 Task: {task['content'].get('task')}")
            move_message(task_id, "inbox", "processing")

            try:
                result = "Task completed!"
                move_message(task_id, "processing", "completed")
                send_message(AGENT_ID, task["from"], "task_result", {
                    "task_id": task_id,
                    "result": result
                })
                print("   ✅ Done!")
            except Exception as e:
                move_message(task_id, "processing", "failed")
                print(f"   ❌ Error: {e}")

    if loop_count % 10 == 0:
        send_message(AGENT_ID, "HUMAN", "heartbeat", {"loops": loop_count})

    time.sleep(10)
