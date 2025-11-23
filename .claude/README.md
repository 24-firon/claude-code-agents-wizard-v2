# 🤖 CCW Agent System - Quick Reference

## 🚀 Quick Start

### Deploy Active Agent
```bash
# Method 1: Quick deploy
./.claude/deploy-agent.sh 1

# Method 2: Direct run
python3 .claude/MASTER-AGENT-DEPLOYMENT.py
```

### Deploy Standby Agent
```bash
# Register agent without active processing
sed 's/AGENT_ID = "CCW-X"/AGENT_ID = "CCW-3"/' .claude/STANDBY-AGENT.py | python3
```

### Monitor Agent Status
```bash
python3 .claude/scripts/agent_status.py
```

### Test System
```bash
python3 .claude/scripts/test_system.py
```

---

## 📂 File Structure

| File | Purpose |
|------|---------|
| `MASTER-AGENT-DEPLOYMENT.py` | Active agent with task processing loop |
| `STANDBY-AGENT.py` | Register agent without activation |
| `deploy-agent.sh` | Quick deployment helper script |
| `agents/registry.json` | Central agent registry (CCW-1 to CCW-10) |
| `scripts/send_message.py` | Send messages between agents |
| `scripts/read_messages.py` | Read agent inbox |
| `scripts/move_message.py` | Move messages between queues |
| `scripts/agent_status.py` | Monitor all agent statuses |
| `scripts/test_system.py` | Verify system integrity |

---

## 📨 Send a Task

```python
from .claude.scripts.send_message import send_message

send_message(
    from_agent="HUMAN",
    to_agent="CCW-1",
    msg_type="task_assignment",
    content={"task": "Your task here"}
)
```

---

## 🎯 Agent Status Types

| Status | Emoji | Description |
|--------|-------|-------------|
| ACTIVE | 🟢 | Running and processing tasks |
| STANDBY | 🟡 | Registered but idle |
| BUSY | 🔴 | Currently processing |
| OFFLINE | ⚫ | Not started |

---

## 📚 Full Documentation

See **[agents/CCW-DEPLOYMENT-GUIDE.md](./agents/CCW-DEPLOYMENT-GUIDE.md)** for complete documentation.

---

## 🧪 System Verification

Run tests to verify everything is working:

```bash
python3 .claude/scripts/test_system.py
```

Expected output:
```
✅ PASS - Directory Structure
✅ PASS - Registry
✅ PASS - Messaging System

3/3 tests passed
🎉 ALL TESTS PASSED! System is ready to deploy.
```

---

## 🔧 Agent IDs

| ID | Name | Status |
|----|------|--------|
| CCW-1 | Claude Code Wizard 1 | Offline |
| CCW-2 | Claude Code Wizard 2 | Offline |
| CCW-3 | Claude Code Wizard 3 | Offline |
| CCW-4 | Claude Code Wizard 4 | Offline |
| CCW-5 | Claude Code Wizard 5 | Offline |
| CCW-6 | Claude Code Wizard 6 | Offline |
| CCW-7 | Claude Code Wizard 7 | Offline |
| CCW-8 | Claude Code Wizard 8 | Offline |
| CCW-9 | Claude Code Wizard 9 | Offline |
| CCW-10 | Claude Code Wizard 10 | Offline |

---

**Happy Coding! 🚀**
