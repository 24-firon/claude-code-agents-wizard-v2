# Quick Start: Multi-Agent System 🚀

**Goal**: Get your first worker agent communicating with the CEO in 5 minutes!

---

## ✅ Prerequisites

The system is **already installed**! You just need to:
1. Have Python 3.x available
2. Have access to Claude Desktop/Web for worker agents

---

## 🎯 Step-by-Step Guide

### Step 1: Verify System is Ready

```bash
cd /home/user/claude-code-agents-wizard-v2
python3 .claude/scripts/test_system.py
```

You should see:
```
✅ SYSTEM TEST COMPLETE!
📊 Test Results:
   • Status: OPERATIONAL 🟢
```

### Step 2: Check Registered Agents

```bash
python3 .claude/scripts/register_agent.py list
```

You should see the CEO already registered:
```
🟢 CEO | CEO Orchestrator - Claude Code CLI | cli | orchestrator
```

### Step 3: Register Your First Worker Agent

**Option A: From Python (in Claude Desktop/Web)**

Open a new Claude Desktop or Web instance, then paste:

```python
import json
from datetime import datetime
from pathlib import Path

# Path to registry (adjust if needed)
registry_file = Path(".claude/agents/registry.json")

# Load registry
with open(registry_file, 'r') as f:
    registry = json.load(f)

# Register yourself
registry['agents'].append({
    "id": "CCW-1",
    "name": "Claude Code Web Worker 1",
    "type": "web",
    "role": "worker",
    "status": "active",
    "registered_at": datetime.utcnow().isoformat() + "Z",
    "last_heartbeat": datetime.utcnow().isoformat() + "Z",
    "metadata": {"version": "2.0", "capabilities": []}
})

registry['next_agent_id'] = 2

# Save
with open(registry_file, 'w') as f:
    json.dump(registry, f, indent=2)

print("✅ CCW-1 registered!")
```

**Option B: From CEO (Claude Code CLI)**

```bash
python3 .claude/scripts/register_agent.py register CCW-1 "Web Worker 1" web worker active
```

### Step 4: Send a Test Message (CEO → Worker)

In Claude Code CLI:

```python
import sys
sys.path.append('.claude/scripts')

from send_message import send_message

# CEO sends task to CCW-1
msg_id = send_message(
    from_agent="CEO",
    to_agent="CCW-1",
    msg_type="task_assignment",
    content={
        "task_id": "TASK-001",
        "title": "Hello World Test",
        "description": "Respond with a greeting message",
        "action": "Send a completion_report back to CEO"
    },
    priority="normal"
)

print(f"\n✅ Task sent to CCW-1: {msg_id}")
```

### Step 5: Read the Message (in Worker Agent)

In Claude Desktop/Web (CCW-1):

```python
import sys
sys.path.append('.claude/scripts')

from read_messages import read_messages, print_messages

# Check inbox
messages = read_messages("CCW-1", "inbox")
print_messages(messages)
```

You should see your task assignment!

### Step 6: Process the Task (in Worker Agent)

```python
from move_message import move_message
from send_message import send_message

# Get the message (from previous step)
msg = messages[0]
msg_id = msg['id']

# Move to processing
move_message(msg_id, "inbox", "processing")

# Do the work (in this case, just send a greeting)
print("👷 Processing task: Hello World Test")

# Send completion report back to CEO
send_message(
    from_agent="CCW-1",
    to_agent="CEO",
    msg_type="completion_report",
    content={
        "task_id": "TASK-001",
        "status": "completed",
        "message": "Hello from CCW-1! Task completed successfully! 🎉",
        "output": "Test greeting sent"
    }
)

# Move to completed
move_message(msg_id, "processing", "completed")

print("✅ Task completed and reported back to CEO!")
```

### Step 7: CEO Reads the Response

Back in Claude Code CLI:

```python
from read_messages import read_messages, print_messages

# Check CEO's inbox
messages = read_messages("CEO", "inbox", filter_type="completion_report")
print_messages(messages)
```

You should see CCW-1's completion report! 🎉

---

## 🎊 Success!

You've just:
- ✅ Registered a worker agent (CCW-1)
- ✅ Sent a task from CEO → CCW-1
- ✅ Processed the task in CCW-1
- ✅ Sent completion report CCW-1 → CEO
- ✅ Verified end-to-end communication!

---

## 🚀 Next Steps

### Add More Worker Agents

```bash
# Register PM agent
python3 .claude/scripts/register_agent.py register CCW-PM "Product Manager" web worker

# Register Designer agent
python3 .claude/scripts/register_agent.py register CCW-Designer "UI Designer" web worker

# Register Developer agent
python3 .claude/scripts/register_agent.py register CCW-Dev "Frontend Developer" web worker
```

### Run Parallel Tasks

```python
# CEO sends tasks to multiple agents simultaneously
send_message("CEO", "CCW-PM", "task_assignment", {"task": "Write PRD"})
send_message("CEO", "CCW-Designer", "task_assignment", {"task": "Create mockups"})

# Both agents work in parallel!
```

### Monitor Progress

```bash
# Check inbox
ls -la .claude/messages/inbox/

# Check processing
ls -la .claude/messages/processing/

# Check completed
ls -la .claude/messages/completed/
```

---

## 💡 Tips

1. **Keep scripts handy**: Add `.claude/scripts` to your Python path
2. **Use descriptive agent IDs**: CCW-PM, CCW-Designer, CCW-Frontend, etc.
3. **Update heartbeats**: `heartbeat("CCW-1")` every few minutes
4. **Clean up messages**: Periodically archive completed messages
5. **Check the full docs**: See `.claude/MULTI_AGENT_SYSTEM.md` for details

---

## 🆘 Troubleshooting

**"Registry file not found"**
```bash
# Run the test system to recreate
python3 .claude/scripts/test_system.py
```

**"No messages found"**
- Check you're looking in the right folder (inbox/processing/completed)
- Verify the `to` field matches your agent ID
- Check messages actually got sent (ls .claude/messages/inbox/)

**"Module not found"**
```python
# Make sure to add scripts to path
import sys
sys.path.append('.claude/scripts')
```

---

**Ready to build something amazing with parallel agents?** 🚀

See `MULTI_AGENT_SYSTEM.md` for complete documentation!
