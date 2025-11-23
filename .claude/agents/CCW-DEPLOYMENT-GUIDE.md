# 🚀 CCW Agent Deployment Guide

## 📋 Overview

The **Claude Code Wizard (CCW) Agent System** enables you to deploy up to 10 parallel agents that can communicate via a message queue system.

## 🏗️ Infrastructure

### Directory Structure

```
.claude/
├── MASTER-AGENT-DEPLOYMENT.py    # Active agent (infinite loop)
├── STANDBY-AGENT.py               # Standby agent (register only)
├── AUTO-COMPLETE-AGENT.py         # Batch agent (work until done)
├── deploy-agent.sh                # Quick deploy helper
├── agents/
│   ├── registry.json              # Agent registry (CCW-1 to CCW-10)
│   ├── coder.md                   # Coder agent definition
│   ├── tester.md                  # Tester agent definition
│   └── stuck.md                   # Stuck agent definition
├── scripts/
│   ├── send_message.py            # Send messages between agents
│   ├── read_messages.py           # Read messages from inbox
│   ├── move_message.py            # Move messages between folders
│   ├── agent_status.py            # Monitor all agent statuses
│   └── test_system.py             # System verification tests
└── messages/
    ├── inbox/                     # Incoming messages per agent
    ├── processing/                # Messages being processed
    ├── completed/                 # Completed messages
    └── failed/                    # Failed messages
```

## 🎯 Quick Start

### 1. Deploy an Agent

```bash
# Copy the deployment script
cp .claude/MASTER-AGENT-DEPLOYMENT.py .claude/ccw-1-deployment.py

# Edit the AGENT_ID (line 6)
# Change: AGENT_ID = "CCW-1"  to  AGENT_ID = "CCW-2", etc.

# Run the agent
python3 .claude/ccw-1-deployment.py
```

### 2. Deploy Multiple Agents

Create separate copies for each agent:

```bash
# Create CCW-1
sed 's/AGENT_ID = "CCW-1"/AGENT_ID = "CCW-1"/' .claude/MASTER-AGENT-DEPLOYMENT.py > .claude/ccw-1.py

# Create CCW-2
sed 's/AGENT_ID = "CCW-1"/AGENT_ID = "CCW-2"/' .claude/MASTER-AGENT-DEPLOYMENT.py > .claude/ccw-2.py

# Create CCW-3
sed 's/AGENT_ID = "CCW-1"/AGENT_ID = "CCW-3"/' .claude/MASTER-AGENT-DEPLOYMENT.py > .claude/ccw-3.py

# ... up to CCW-10
```

### 3. Run Agents in Parallel

```bash
# Terminal 1
python3 .claude/ccw-1.py

# Terminal 2
python3 .claude/ccw-2.py

# Terminal 3
python3 .claude/ccw-3.py
```

## 📨 Messaging System

### Send a Message

```python
from send_message import send_message

# Send task to CCW-1
send_message(
    from_agent="HUMAN",
    to_agent="CCW-1",
    msg_type="task_assignment",
    content={
        "task": "Build React dashboard",
        "priority": "high"
    }
)
```

### Read Messages

```python
from read_messages import read_messages

# Read all messages for CCW-1
messages = read_messages("CCW-1")

# Read only task assignments
tasks = read_messages("CCW-1", msg_type="task_assignment")
```

### Move Messages

```python
from move_message import move_message

# Move message from inbox to processing
move_message(message_id, "inbox", "processing")

# Move to completed
move_message(message_id, "processing", "completed")

# Move to failed
move_message(message_id, "processing", "failed")
```

## 🔄 Agent Lifecycle

### Active Agent (MASTER-AGENT-DEPLOYMENT.py)

```
1. AGENT STARTS
   ├─ Updates registry.json (status = "active")
   ├─ Sends status_update to HUMAN
   └─ Enters processing loop

2. PROCESSING LOOP (every 10 seconds)
   ├─ Read messages from inbox
   ├─ Process task_assignment messages
   ├─ Move message: inbox → processing
   ├─ Execute task
   ├─ Move message: processing → completed (or failed)
   ├─ Send task_result back to sender
   └─ Send heartbeat every 10 loops (100 seconds)

3. AGENT STOPS
   └─ Status remains "active" in registry until manually updated
```

### Standby Agent (STANDBY-AGENT.py)

```
1. AGENT REGISTERS
   ├─ Updates registry.json (status = "standby")
   ├─ Updates last_heartbeat timestamp
   └─ Exits (no processing loop)

Purpose: Reserve agent ID without active processing
Use cases:
  - Reserve agents for future use
  - Mark agents as registered but not yet deployed
  - Quick status update without full deployment
```

### Auto-Complete Agent (AUTO-COMPLETE-AGENT.py)

```
1. AGENT STARTS
   ├─ Scans inbox for tasks assigned to this agent
   └─ Enters batch processing mode

2. BATCH PROCESSING (max 10 iterations)
   ├─ Read all pending tasks from inbox
   ├─ Process each task sequentially
   ├─ Move completed tasks to completed/
   ├─ Check if more tasks remain
   └─ Repeat until no tasks or max iterations reached

3. AUTO-FINALIZE
   ├─ git add -A (stage all changes)
   ├─ git commit -m "AGENT_ID all work complete"
   ├─ git push (push to remote)
   └─ Exit

Purpose: Batch process all tasks then auto-commit
Use cases:
  - Complete all pending work without supervision
  - Automated task completion workflows
  - CI/CD integration for agent-based tasks
  - Fire-and-forget batch processing
```

## 📊 Agent Status Monitoring

### Check All Agent Statuses

```bash
python3 .claude/scripts/agent_status.py
```

**Output:**
```
============================================================
CCW AGENT STATUS MONITOR
============================================================

📊 Total Agents: 10
🕒 Registry Updated: 2025-11-23T00:00:00Z

Status Summary:
  ⚫ OFFLINE: 9
  🟡 STANDBY: 1

------------------------------------------------------------
Individual Agent Status:
------------------------------------------------------------
⚫ CCW-1    | OFFLINE  | Last HB: None
⚫ CCW-2    | OFFLINE  | Last HB: None
⚫ CCW-3    | OFFLINE  | Last HB: None
⚫ CCW-4    | OFFLINE  | Last HB: None
🟡 CCW-5    | STANDBY  | Last HB: 2025-11-23 11:58:37
⚫ CCW-6    | OFFLINE  | Last HB: None
⚫ CCW-7    | OFFLINE  | Last HB: None
⚫ CCW-8    | OFFLINE  | Last HB: None
⚫ CCW-9    | OFFLINE  | Last HB: None
⚫ CCW-10   | OFFLINE  | Last HB: None
============================================================
```

### Agent Status Types

- 🟢 **ACTIVE**: Agent running and processing tasks
- 🟡 **STANDBY**: Agent registered but idle
- 🔴 **BUSY**: Agent currently processing (custom implementation)
- ⚫ **OFFLINE**: Agent not started

## 📊 Message Types

### `task_assignment`
Task for agent to execute
```json
{
  "type": "task_assignment",
  "content": {
    "task": "Description of task",
    "priority": "high|medium|low"
  }
}
```

### `task_result`
Result of completed task
```json
{
  "type": "task_result",
  "content": {
    "task_id": "uuid",
    "result": "Task completed successfully",
    "data": {}
  }
}
```

### `status_update`
Agent status change
```json
{
  "type": "status_update",
  "content": {
    "status": "online|offline|busy",
    "message": "Agent is now online"
  }
}
```

### `heartbeat`
Periodic health check
```json
{
  "type": "heartbeat",
  "content": {
    "loops": 42
  }
}
```

## 🛠️ Customization

### Modify Agent Behavior

Edit `MASTER-AGENT-DEPLOYMENT.py` line 48-62:

```python
try:
    # YOUR CUSTOM LOGIC HERE
    # Example: Call Claude Code, run subprocess, etc.
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
```

### Change Loop Interval

Line 67: `time.sleep(10)` - Change to desired seconds

### Change Heartbeat Frequency

Line 64: `if loop_count % 10 == 0` - Change `10` to desired number of loops

## 📝 Registry Management

Check agent status:

```python
import json
from pathlib import Path

registry = json.loads(
    Path(".claude/agents/registry.json").read_text()
)

for agent in registry["agents"]:
    print(f"{agent['id']}: {agent['status']}")
```

## 🚨 Troubleshooting

### Agent won't start
- Check AGENT_ID matches registry (CCW-1 to CCW-10)
- Verify .claude/agents/registry.json exists
- Check Python path in line 11

### Messages not received
- Check inbox directory: `.claude/messages/inbox/<agent-id>/`
- Verify message type matches read_messages filter
- Check message JSON format

### Messages stuck in processing
- Agent crashed during processing
- Manually move: `move_message(msg_id, "processing", "failed")`

## 🎯 Next Steps

1. **Deploy your first agent**: `python3 .claude/MASTER-AGENT-DEPLOYMENT.py`
2. **Send a test task**: Use `send_message()` to send a task
3. **Monitor the agent**: Watch console output for task processing
4. **Scale up**: Deploy CCW-2, CCW-3, etc. for parallel processing

---

**Happy coding with CCW Agents! 🚀**
