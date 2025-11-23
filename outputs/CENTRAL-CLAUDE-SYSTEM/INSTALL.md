# 🚀 CENTRAL CLAUDE SYSTEM - INSTALLATION GUIDE

**One Central System for ALL Repositories and ALL Agents!**

---

## 🎯 WHAT IS THIS?

A **CENTRAL** multi-agent communication system that allows:
- ✅ **All Claude agents** (Web, Desktop, CLI) to communicate
- ✅ **All repositories** to share one message system
- ✅ **Parallel coordination** across multiple repos
- ✅ **Zero duplication** - install once, use everywhere!

---

## 📁 CENTRAL LOCATION

### Windows:
```
C:\Ground-Zero\.claude\
```

### Linux/Mac:
```
~/Ground-Zero/.claude/
```

**All repos reference THIS location!**

---

## 🚀 QUICK INSTALL (2 MINUTES)

### **Step 1: Choose Your Central Location**

```bash
# Windows (PowerShell/CMD)
$CENTRAL="C:\Ground-Zero\.claude"

# Linux/Mac (Bash)
export CENTRAL="$HOME/Ground-Zero/.claude"
```

### **Step 2: Run Installation Script**

```python
# Copy this entire block and run in Python

import os
import shutil
from pathlib import Path

# === CONFIGURATION ===
# Windows: C:/Ground-Zero/.claude
# Linux/Mac: ~/Ground-Zero/.claude
CENTRAL = Path.home() / "Ground-Zero" / ".claude"  # Change if needed

# Source directory (where you extracted this package)
SOURCE = Path(__file__).parent  # Or specify path to extracted files

print(f"🚀 Installing CENTRAL Claude System to: {CENTRAL}\n")

# Create structure
dirs = [
    "agents",
    "messages/inbox",
    "messages/processing",
    "messages/completed",
    "messages/failed",
    "tasks",
    "coordination/logs",
    "scripts"
]

for dir_name in dirs:
    dir_path = CENTRAL / dir_name
    dir_path.mkdir(parents=True, exist_ok=True)
    print(f"✅ {dir_name}")

# Copy files
files = {
    "agents/registry.json": "agents/registry.json",
    "scripts/central_config.py": "scripts/central_config.py",
    "scripts/send_message.py": "scripts/send_message.py",
    "scripts/read_messages.py": "scripts/read_messages.py",
    "scripts/move_message.py": "scripts/move_message.py",
    "scripts/agent_registry.py": "scripts/agent_registry.py",
}

for src_file, dest_file in files.items():
    src = SOURCE / src_file
    dest = CENTRAL / dest_file

    if src.exists():
        shutil.copy2(src, dest)
        print(f"✅ Copied: {dest_file}")
    else:
        print(f"⚠️ Missing: {src_file}")

print(f"\n✅ CENTRAL SYSTEM INSTALLED!")
print(f"📁 Location: {CENTRAL}")
print(f"\n🔥 Next: Set environment variable CENTRAL_CLAUDE_DIR={CENTRAL}")
```

### **Step 3: Set Environment Variable**

#### Windows (PowerShell - Permanent):
```powershell
[System.Environment]::SetEnvironmentVariable('CENTRAL_CLAUDE_DIR', 'C:\Ground-Zero\.claude', 'User')
echo "✅ Environment variable set (restart terminal)"
```

#### Linux/Mac (Bash - Add to ~/.bashrc or ~/.zshrc):
```bash
echo 'export CENTRAL_CLAUDE_DIR="$HOME/Ground-Zero/.claude"' >> ~/.bashrc
source ~/.bashrc
echo "✅ Environment variable set"
```

#### Python (Per-session):
```python
import os
os.environ['CENTRAL_CLAUDE_DIR'] = '/path/to/.claude'  # Windows: C:/Ground-Zero/.claude
```

---

## 🤖 AGENT REGISTRATION

**Every agent MUST register itself!**

### **Register Agent (Copy-Paste in Each Agent)**

```python
import os
import sys
from pathlib import Path

# Set CENTRAL path (if not in environment)
if 'CENTRAL_CLAUDE_DIR' not in os.environ:
    # Windows
    os.environ['CENTRAL_CLAUDE_DIR'] = 'C:/Ground-Zero/.claude'
    # Linux/Mac
    # os.environ['CENTRAL_CLAUDE_DIR'] = str(Path.home() / 'Ground-Zero' / '.claude')

# Add scripts to path
CENTRAL = Path(os.environ['CENTRAL_CLAUDE_DIR'])
sys.path.insert(0, str(CENTRAL / 'scripts'))

# Import tools
from agent_registry import register_agent, update_heartbeat
from send_message import send_status_update
from read_messages import read_messages, print_messages

# === REGISTER YOURSELF ===
# CHANGE THESE!
AGENT_ID = "CCW-1"  # Unique ID: CCW-1, CCW-2, CCD-1, etc.
AGENT_NAME = "Claude Web Tab 1"
AGENT_TYPE = "web"  # web, desktop, cli
AGENT_ROLE = "worker"  # worker, coordinator, specialist
ASSIGNED_REPOS = ["claude-agents", "repo-2"]  # Repos you work on

# Register
register_agent(
    name=AGENT_NAME,
    agent_type=AGENT_TYPE,
    role=AGENT_ROLE,
    assigned_repos=ASSIGNED_REPOS,
    custom_id=AGENT_ID
)

# Announce online
send_status_update(
    from_agent=AGENT_ID,
    to_agent="COORDINATOR",  # or "ALL"
    status="online",
    message=f"{AGENT_ID} connected to CENTRAL system!",
    data={
        "assigned_repos": ASSIGNED_REPOS,
        "capabilities": ["coding", "debugging", "analysis"]
    }
)

print(f"\n✅ {AGENT_ID} REGISTERED AND ONLINE!")
print(f"   Repos: {ASSIGNED_REPOS}")

# Check for tasks
tasks = read_messages(AGENT_ID, message_type="task_request")
print(f"\n📬 {len(tasks)} task(s) waiting:")
print_messages(tasks, show_content=True)
```

---

## 📨 SENDING MESSAGES

```python
from send_message import send_task_request, send_status_update

# Send task to another agent
msg_id = send_task_request(
    from_agent="CCW-1",
    to_agent="CCW-2",
    task_description="Analyze codebase structure",
    context={
        "repo": "claude-agents",
        "focus": "src/ directory"
    },
    priority="high",
    repo="claude-agents"
)

# Send status update
send_status_update(
    from_agent="CCW-1",
    to_agent="COORDINATOR",
    status="working",
    message="Analyzing repository...",
    data={"progress": "25%"},
    repo="claude-agents"
)
```

---

## 📬 READING MESSAGES

```python
from read_messages import read_messages, print_messages

# Read all unread messages
messages = read_messages("CCW-1", unread_only=True)
print_messages(messages, show_content=True)

# Read only task assignments
tasks = read_messages("CCW-1", message_type="task_request")

# Read messages for specific repo
repo_msgs = read_messages("CCW-1", repo="claude-agents")
```

---

## 🔄 PROCESSING TASKS

```python
from read_messages import read_messages
from move_message import move_to_processing, move_to_completed
from send_message import send_task_complete

# 1. Read tasks
tasks = read_messages("CCW-1", message_type="task_request", unread_only=True)

for task in tasks:
    # 2. Start processing
    move_to_processing(task['id'], "CCW-1")

    # 3. Do the work...
    print(f"Working on: {task['content']['task']}")
    # ... actual work here ...

    # 4. Report completion
    send_task_complete(
        from_agent="CCW-1",
        to_agent=task['from'],
        task_id=task['id'],
        result={
            "status": "completed",
            "output": "Task finished successfully"
        },
        success=True,
        repo=task.get('repo')
    )

    # 5. Move to completed
    move_to_completed(task['id'], "CCW-1")
```

---

## 🎯 AGENT IDs CONVENTION

| Agent Type | Prefix | Example |
|------------|--------|---------|
| Web (Claude.ai) | CCW | CCW-1, CCW-2, CCW-3 |
| Desktop App | CCD | CCD-1, CCD-2 |
| CLI | CCC | CCC-1, CCC-2 |
| Coordinator | COORD | COORDINATOR |

---

## 📊 VERIFY INSTALLATION

```bash
# Check structure exists
ls -la $CENTRAL_CLAUDE_DIR  # Linux/Mac
dir %CENTRAL_CLAUDE_DIR%    # Windows

# List registered agents
python $CENTRAL_CLAUDE_DIR/scripts/agent_registry.py

# Read messages
python $CENTRAL_CLAUDE_DIR/scripts/read_messages.py YOUR_AGENT_ID
```

Or in Python:

```python
import os, sys
from pathlib import Path

CENTRAL = Path(os.environ.get('CENTRAL_CLAUDE_DIR', Path.home() / 'Ground-Zero' / '.claude'))
sys.path.insert(0, str(CENTRAL / 'scripts'))

from agent_registry import list_agents, print_agents
from read_messages import read_messages, print_messages

# List all agents
agents = list_agents()
print_agents(agents)

# Check messages
messages = read_messages("YOUR_AGENT_ID")
print_messages(messages)
```

---

## 🔥 MULTI-REPO USAGE

### Repo 1 (claude-agents):
```python
# Agent CCW-1 registered with repos=["claude-agents"]
from send_message import send_task_request

send_task_request(
    from_agent="CCW-1",
    to_agent="CCW-2",
    task_description="Review PR #123",
    repo="claude-agents"  # THIS REPO!
)
```

### Repo 2 (other-project):
```python
# Agent CCW-2 registered with repos=["other-project"]
from read_messages import read_messages

# Read only messages for this repo
msgs = read_messages("CCW-2", repo="other-project")
```

### Coordinator (monitors ALL repos):
```python
# Agent COORDINATOR registered with repos=["ALL"]
from read_messages import read_messages
from agent_registry import list_agents

# See all agents
agents = list_agents()

# See all messages (no repo filter)
all_msgs = read_messages("COORDINATOR")
```

---

## ⚠️ TROUBLESHOOTING

### "ModuleNotFoundError: No module named 'central_config'"

```python
# Make sure scripts dir is in path
import sys, os
from pathlib import Path

CENTRAL = Path(os.environ.get('CENTRAL_CLAUDE_DIR', 'C:/Ground-Zero/.claude'))
sys.path.insert(0, str(CENTRAL / 'scripts'))
```

### "CENTRAL_CLAUDE_DIR not set"

```python
# Set manually
import os
os.environ['CENTRAL_CLAUDE_DIR'] = 'C:/Ground-Zero/.claude'  # Windows
# OR
os.environ['CENTRAL_CLAUDE_DIR'] = str(Path.home() / 'Ground-Zero' / '.claude')  # Linux/Mac
```

### "No messages found"

```bash
# Check inbox
ls $CENTRAL_CLAUDE_DIR/messages/inbox/

# Send test message
python -c "
import sys, os
sys.path.append(os.environ['CENTRAL_CLAUDE_DIR'] + '/scripts')
from send_message import send_message
send_message('TEST', 'YOUR_ID', 'status_update', {'test': True})
"
```

---

## 📚 FILES REFERENCE

| File | Purpose |
|------|---------|
| `scripts/central_config.py` | Path resolution & configuration |
| `scripts/agent_registry.py` | Agent management |
| `scripts/send_message.py` | Send messages |
| `scripts/read_messages.py` | Read messages |
| `scripts/move_message.py` | Move messages through workflow |
| `agents/registry.json` | Agent registry database |
| `messages/inbox/` | New messages |
| `messages/processing/` | Messages being worked on |
| `messages/completed/` | Completed tasks |
| `messages/failed/` | Failed tasks |

---

## ✅ NEXT STEPS

1. ✅ Install CENTRAL system (run install script)
2. ✅ Set CENTRAL_CLAUDE_DIR environment variable
3. ✅ Register each agent (CCW-1, CCW-2, etc.)
4. ✅ Send test messages
5. ✅ Start coordinating parallel work!

---

**🔥 ONE SYSTEM, ALL AGENTS, ALL REPOS!**

**Version**: 1.0
**Last Updated**: 2025-11-23
