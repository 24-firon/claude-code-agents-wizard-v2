# 🤖 CENTRAL CLAUDE SYSTEM

**One Communication System for ALL Claude Agents & Repositories**

---

## 🎯 Quick Start

```python
# 1. Set CENTRAL path
import os
os.environ['CENTRAL_CLAUDE_DIR'] = 'C:/Ground-Zero/.claude'  # Windows
# os.environ['CENTRAL_CLAUDE_DIR'] = str(Path.home() / 'Ground-Zero' / '.claude')  # Linux

# 2. Add to path
import sys
from pathlib import Path
CENTRAL = Path(os.environ['CENTRAL_CLAUDE_DIR'])
sys.path.insert(0, str(CENTRAL / 'scripts'))

# 3. Register
from agent_registry import register_agent
register_agent("Agent Name", "web", "worker", ["repo1"], "CCW-1")

# 4. Send/Read messages
from send_message import send_task_request
from read_messages import read_messages, print_messages

send_task_request("CCW-1", "CCW-2", "Do task", repo="my-repo")
tasks = read_messages("CCW-2")
print_messages(tasks)
```

---

## 📁 Installation

See **[INSTALL.md](INSTALL.md)** for complete installation guide!

**Quick Install:**
1. Extract this package to `C:/Ground-Zero/.claude` (Windows) or `~/Ground-Zero/.claude` (Linux/Mac)
2. Set `CENTRAL_CLAUDE_DIR` environment variable
3. Register agents using `agent_registry.py`

---

## 🚀 Features

✅ **Centralized** - One location for all repos
✅ **Multi-Agent** - Web, Desktop, CLI agents
✅ **Task Queue** - inbox → processing → completed/failed
✅ **Parallel Coordination** - Multiple agents, multiple repos
✅ **Cross-Platform** - Windows, Linux, Mac

---

## 📋 Files

- `scripts/central_config.py` - Configuration & path resolution
- `scripts/agent_registry.py` - Agent management
- `scripts/send_message.py` - Send messages
- `scripts/read_messages.py` - Read messages
- `scripts/move_message.py` - Move messages
- `agents/registry.json` - Agent registry
- `messages/` - Message folders
- `INSTALL.md` - Complete installation guide

---

**Version**: 1.0
**Location**: `C:/Ground-Zero/.claude` or `~/Ground-Zero/.claude`
