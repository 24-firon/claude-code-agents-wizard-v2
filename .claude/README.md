# 🤖 Multi-Agent Communication System

**File-based message passing system for coordinating multiple Claude agents working in parallel**

---

## 🎯 What Is This?

This system allows **multiple Claude instances** (web, desktop, CLI) to communicate and coordinate via a shared filesystem. Instead of manual copy-pasting between agents, they can:

- ✅ Send structured messages to each other
- ✅ Register themselves in a central registry
- ✅ Track task progress (inbox → processing → completed/failed)
- ✅ Coordinate parallel workflows
- ✅ Report status and errors

---

## 📁 Directory Structure

```
.claude/
├── agents/
│   └── registry.json              # Central agent registry
├── messages/
│   ├── inbox/                     # New messages
│   ├── processing/                # Messages being worked on
│   ├── completed/                 # Completed tasks
│   └── failed/                    # Failed tasks
├── tasks/                         # Task definitions (future)
├── coordination/
│   └── logs/                      # Coordination logs (future)
└── scripts/
    ├── init_system.py             # Initialize system
    ├── agent_registry.py          # Register/manage agents
    ├── send_message.py            # Send messages
    ├── read_messages.py           # Read messages
    └── move_message.py            # Move messages between folders
```

---

## 🚀 Quick Start

### 1. Initialize System (Already Done!)

```bash
python3 .claude/scripts/init_system.py
```

This:
- ✅ Creates directory structure
- ✅ Registers CEO agent
- ✅ Sends test message
- ✅ Verifies system works

### 2. Register Worker Agents

```python
import sys
sys.path.append('.claude/scripts')

from agent_registry import register_agent

# Register Claude Web instance
register_agent(
    name="Claude Web Tab 1",
    agent_type="web",
    role="primary_worker",
    custom_id="CCW-1"
)

# Register another worker
register_agent(
    name="Frontend Developer",
    agent_type="web",
    role="frontend_developer",
    custom_id="FRONTEND-1"
)
```

### 3. Send Messages

```python
from send_message import send_task_request, send_status_update

# CEO sends task to worker
msg_id = send_task_request(
    from_agent="CEO",
    to_agent="CCW-1",
    task_description="Build Operations Dashboard - Executive View",
    context={
        "prd": "agents/operations-dashboard/01-pm/OUTPUT/prd.md",
        "deadline": "2025-11-25"
    },
    priority="high"
)

# Worker sends status update
send_status_update(
    from_agent="CCW-1",
    to_agent="CEO",
    status="working",
    message="Started on Executive Dashboard",
    data={"progress": "10%", "eta": "2 hours"}
)
```

### 4. Read Messages

```python
from read_messages import read_messages, print_messages, mark_message_read

# Read your messages
messages = read_messages("CCW-1", unread_only=True)

# Print them nicely
print_messages(messages, show_content=True)

# Mark as read
if messages:
    mark_message_read(messages[0]['id'], "CCW-1")
```

### 5. Process Tasks

```python
from move_message import move_to_processing, move_to_completed, move_to_failed

# Start processing
move_to_processing(msg_id, "CCW-1")

# ... do work ...

# Mark complete
move_to_completed(msg_id, "CCW-1")

# Or mark failed with reason
# move_to_failed(msg_id, "CCW-1", "NPM install error")
```

---

## 📋 Message Types

| Type | Description | When to Use |
|------|-------------|-------------|
| `status_update` | Agent status change | Online, working, idle, blocked |
| `task_request` | Request work from another agent | CEO → Worker delegation |
| `task_complete` | Task finished notification | Worker → CEO completion |
| `error` | Error notification | Any error that needs attention |
| `question` | Ask for human input | When stuck or need decision |

---

## 🎭 Agent Types & Roles

### Agent Types:
- `web` - Claude in browser tab
- `cli` - Claude Code CLI
- `desktop` - Claude Desktop app
- `api` - API-based agent

### Common Roles:
- `ceo_orchestrator` - Main coordinator (CEO)
- `primary_worker` - General-purpose worker
- `frontend_developer` - Frontend specialist
- `backend_engineer` - Backend specialist
- `qa_engineer` - Testing specialist
- `devops_engineer` - Deployment specialist

---

## 🔄 Workflow Example

### CEO delegates to 2 parallel workers:

```python
# CEO (Claude Code CLI)
from send_message import send_task_request

# Send to Frontend worker
frontend_msg = send_task_request(
    from_agent="CEO",
    to_agent="FRONTEND-1",
    task_description="Build Executive Dashboard UI",
    context={"design": "agents/.../04-product-designer/OUTPUT/ui-design.md"}
)

# Send to Backend worker (parallel!)
backend_msg = send_task_request(
    from_agent="CEO",
    to_agent="BACKEND-1",
    task_description="Build Analytics API endpoints",
    context={"schema": "agents/.../06-dba/OUTPUT/database-schema.md"}
)
```

### Worker processes task:

```python
# Worker (Claude Web Tab)
from read_messages import read_messages
from move_message import move_to_processing, move_to_completed
from send_message import send_task_complete

# Check inbox
messages = read_messages("FRONTEND-1", unread_only=True)

for msg in messages:
    if msg['type'] == 'task_request':
        # Start processing
        move_to_processing(msg['id'], "FRONTEND-1")

        # Do the work...
        # (build UI, write code, etc.)

        # Report completion
        send_task_complete(
            from_agent="FRONTEND-1",
            to_agent="CEO",
            task_id=msg['id'],
            result={
                "files_created": [
                    "pages/executive-dashboard.tsx",
                    "components/RevenueChart.tsx"
                ],
                "status": "ready_for_review"
            },
            success=True
        )

        # Move to completed
        move_to_completed(msg['id'], "FRONTEND-1")
```

### CEO monitors progress:

```python
# CEO checks for completed tasks
from read_messages import read_messages

completed = read_messages("CEO", msg_type="task_complete")

for msg in completed:
    print(f"✅ {msg['from']} completed: {msg['content']['result']}")
```

---

## 🛠️ Python API Reference

### agent_registry.py

```python
register_agent(name, agent_type, role, custom_id=None) -> str
unregister_agent(agent_id: str)
update_heartbeat(agent_id: str)
update_agent_status(agent_id: str, status: str)
get_agent(agent_id: str) -> dict
list_agents(agent_type=None, status=None) -> list
```

### send_message.py

```python
send_message(from_agent, to_agent, msg_type, content, priority="normal") -> str
send_task_request(from_agent, to_agent, task_description, context=None, priority="normal") -> str
send_task_complete(from_agent, to_agent, task_id, result, success=True) -> str
send_status_update(from_agent, to_agent, status, message, data=None) -> str
send_error(from_agent, to_agent, error_message, error_details=None, severity="error") -> str
```

### read_messages.py

```python
read_messages(agent_id, msg_type=None, priority=None, unread_only=True) -> list
get_message_by_id(msg_id: str) -> dict
mark_message_read(msg_id: str, agent_id: str)
get_messages_summary(agent_id: str) -> dict
print_messages(messages: list, show_content=False)
```

### move_message.py

```python
move_message(msg_id: str, to_folder: str, agent_id=None) -> bool
move_to_processing(msg_id: str, agent_id: str) -> bool
move_to_completed(msg_id: str, agent_id: str) -> bool
move_to_failed(msg_id: str, agent_id: str, reason=None) -> bool
cleanup_old_messages(days=30, folder="completed")
```

---

## 📊 Message Priority Levels

| Priority | Emoji | When to Use |
|----------|-------|-------------|
| `critical` | 🔴 | System errors, blocking issues |
| `high` | 🟠 | Important tasks, time-sensitive |
| `normal` | 🟢 | Regular tasks (default) |
| `low` | ⚪ | Nice-to-have, background work |

---

## ✅ Best Practices

### 1. **Always register before sending**
```python
# Bad: Send without registering
send_message("UNKNOWN-1", "CEO", ...)  # CEO doesn't know who this is!

# Good: Register first
register_agent("My Worker", "web", "worker", "WORKER-1")
send_message("WORKER-1", "CEO", ...)
```

### 2. **Move messages through states**
```python
# Bad: Leave messages in inbox forever
messages = read_messages("ME")
# ... process but never move ...

# Good: Track progress
move_to_processing(msg_id, "ME")  # I'm working on it
# ... do work ...
move_to_completed(msg_id, "ME")   # Done!
```

### 3. **Send completions back**
```python
# Bad: Complete task but don't notify
move_to_completed(msg_id, "WORKER")

# Good: Notify requester
send_task_complete("WORKER", "CEO", msg_id, {"output": "..."})
move_to_completed(msg_id, "WORKER")
```

### 4. **Update heartbeat periodically**
```python
# Every 5-10 minutes
from agent_registry import update_heartbeat
update_heartbeat("CCW-1")
```

### 5. **Use priority for urgent tasks**
```python
# Critical issues
send_error("WORKER", "CEO", "Build failed!", severity="critical")

# High priority tasks
send_task_request("CEO", "WORKER", "Fix production bug", priority="high")
```

---

## 🧪 Testing

### Test message flow:

```bash
# Initialize
python3 .claude/scripts/init_system.py

# Send test message
python3 -c "
import sys
sys.path.append('.claude/scripts')
from send_message import send_message
send_message('TEST', 'HUMAN', 'status_update', {'test': True})
"

# Read messages
python3 -c "
import sys
sys.path.append('.claude/scripts')
from read_messages import read_messages, print_messages
msgs = read_messages('HUMAN')
print_messages(msgs, show_content=True)
"
```

---

## 🔍 Troubleshooting

### Messages not appearing?

```bash
# Check inbox
ls -la .claude/messages/inbox/

# Read all messages for agent
python3 .claude/scripts/read_messages.py CCW-1
```

### Agent not registered?

```bash
# List all agents
python3 .claude/scripts/agent_registry.py

# Register manually
python3 .claude/scripts/agent_registry.py register "Agent Name" web worker CCW-1
```

### Old messages cluttering?

```python
from move_message import cleanup_old_messages

# Delete completed messages older than 7 days
cleanup_old_messages(days=7, folder="completed")

# Delete failed messages older than 30 days
cleanup_old_messages(days=30, folder="failed")
```

---

## 🎯 Integration with Parallel Agent System

This communication system integrates with the parallel agent workflow:

```python
# CEO starts Phase 1 (PM + Marketer parallel)

# Send to PM worker
send_task_request(
    from_agent="CEO",
    to_agent="PM-1",
    task_description="Create PRD for Operations Dashboard",
    context={
        "input": "agents/operations-dashboard/01-pm/CONTEXT/product-vision.md",
        "output": "agents/operations-dashboard/01-pm/OUTPUT/prd.md"
    }
)

# Send to Marketer worker (parallel!)
send_task_request(
    from_agent="CEO",
    to_agent="MARKETER-1",
    task_description="Create brand guidelines",
    context={
        "input": "agents/operations-dashboard/02-marketer/CONTEXT/product-vision.md",
        "output": "agents/operations-dashboard/02-marketer/OUTPUT/brand-guidelines.md"
    }
)

# Wait for both to complete...
# (CEO polls for task_complete messages)
```

---

## 📚 Additional Resources

- **System Architecture**: `/SYSTEM-INFO.md`
- **Parallel Workflow**: `/agents/operations-dashboard/PARALLEL-AGENT-WORKFLOW.md`
- **Agent Prompts**: `/agents/operations-dashboard/XX-agent/PROMPT.md`
- **Sub-Agent Guide**: `/agents/operations-dashboard/MASTER-SUB-AGENT-GUIDE.md`

---

## 🚀 System Status

✅ **SYSTEM ONLINE**

Run this to check:
```bash
python3 .claude/scripts/init_system.py
```

---

**Version**: 1.0
**Last Updated**: 2025-11-23
**Repository**: claude-code-agents-wizard-v2
