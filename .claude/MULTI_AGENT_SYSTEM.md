# Multi-Agent Orchestration System v2.0 🤖

**Status**: ✅ OPERATIONAL
**Version**: 2.0
**Last Updated**: 2025-11-23

---

## 🎯 Overview

This is a **file-based message-passing system** for coordinating multiple Claude instances (CLI, Desktop, Web) working together on complex projects. It enables parallel execution, task delegation, and seamless communication between agents.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│  CEO (Claude Code CLI) - The Orchestrator                │
│  • 200k Context Window                                   │
│  • File System Access                                    │
│  • Creates todos, delegates tasks                        │
│  • Coordinates all worker agents                         │
└──────────────────────────────────────────────────────────┘
                          │
                          │ Messages via .claude/messages/
                          ▼
┌──────────────────────────────────────────────────────────┐
│  Worker Agents (Claude Desktop/Web instances)            │
│  • Specialized roles (PM, Designer, Developer, etc.)     │
│  • Receive tasks via message inbox                       │
│  • Send completion reports back                          │
│  • Work in parallel on independent tasks                 │
└──────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
.claude/
├── agents/
│   ├── registry.json              # Agent registration database
│   ├── coder.md                   # Coder subagent definition
│   ├── tester.md                  # Tester subagent definition
│   └── stuck.md                   # Stuck (human escalation) subagent
│
├── messages/
│   ├── inbox/                     # New messages (pending)
│   ├── processing/                # Messages being processed
│   ├── completed/                 # Successfully completed messages
│   └── failed/                    # Failed messages
│
├── tasks/                         # Task definitions and tracking
│
├── coordination/
│   └── logs/                      # Coordination logs
│
└── scripts/
    ├── send_message.py           # Send messages between agents
    ├── read_messages.py          # Read messages for an agent
    ├── move_message.py           # Move messages between folders
    ├── register_agent.py         # Register/list agents
    └── test_system.py            # System test suite
```

## 🔧 Core Components

### 1. Agent Registry (`agents/registry.json`)

Tracks all registered agents in the system:

```json
{
  "agents": [
    {
      "id": "CEO",
      "name": "CEO Orchestrator - Claude Code CLI",
      "type": "cli",
      "role": "orchestrator",
      "status": "active",
      "registered_at": "2025-11-23T07:36:09Z",
      "last_heartbeat": "2025-11-23T07:36:09Z"
    }
  ],
  "next_agent_id": 2
}
```

**Agent Types:**
- `cli` - Claude Code CLI (file system access)
- `web` - Claude Web browser instances
- `desktop` - Claude Desktop app instances
- `subagent` - Built-in subagents (coder, tester, stuck)

**Agent Roles:**
- `orchestrator` - Coordinates everything (CEO)
- `worker` - Executes tasks (PM, Designer, Developer, etc.)
- `specialist` - Specialized capabilities (QA, Security, DevOps)

### 2. Message Passing System

Messages flow through four stages:

```
inbox/ → processing/ → completed/ or failed/
```

**Message Structure:**
```json
{
  "id": "msg-20251123-120000-abc123",
  "from": "CEO",
  "to": "CCW-1",
  "type": "task_assignment",
  "priority": "high",
  "content": {
    "task_id": "TASK-001",
    "description": "Implement login page"
  },
  "timestamp": "2025-11-23T12:00:00Z",
  "status": "pending"
}
```

**Message Types:**
- `task_assignment` - CEO assigns task to worker
- `status_update` - Agent reports status
- `completion_report` - Agent reports task completion
- `error_report` - Agent reports error/problem
- `question` - Agent asks for clarification
- `coordination` - Inter-agent coordination

**Priority Levels:**
- `urgent` - Immediate attention required
- `high` - Important, handle soon
- `normal` - Standard priority
- `low` - Handle when available

## 🚀 Usage Guide

### Register a New Agent

```python
from register_agent import register_agent

register_agent(
    agent_id="CCW-1",
    name="Claude Code Web Tab 1",
    agent_type="web",
    role="worker",
    status="active"
)
```

**Via CLI:**
```bash
python3 .claude/scripts/register_agent.py register CCW-1 "Web Worker 1" web worker active
```

### List All Agents

```python
from register_agent import list_agents

agents = list_agents()
```

**Via CLI:**
```bash
python3 .claude/scripts/register_agent.py list
```

### Send a Message

```python
from send_message import send_message

msg_id = send_message(
    from_agent="CEO",
    to_agent="CCW-1",
    msg_type="task_assignment",
    content={
        "task_id": "TASK-001",
        "title": "Implement user authentication",
        "description": "Create login and signup pages",
        "priority": "high"
    },
    priority="high"
)
```

### Read Messages

```python
from read_messages import read_messages

# Read all messages for CCW-1 in inbox
messages = read_messages("CCW-1", "inbox")

# Read only task assignments
messages = read_messages("CCW-1", "inbox", filter_type="task_assignment")

# Limit to 10 messages
messages = read_messages("CCW-1", "inbox", limit=10)
```

**Via CLI:**
```bash
python3 .claude/scripts/read_messages.py CCW-1 inbox task_assignment 10
```

### Move Message to Processing

```python
from move_message import move_message

# When you start working on a task
move_message("msg-20251123-120000-abc123", "inbox", "processing")

# When done
move_message("msg-20251123-120000-abc123", "processing", "completed")

# If error
move_message("msg-20251123-120000-abc123", "processing", "failed")
```

### Update Heartbeat

```python
from register_agent import heartbeat

# Keep your agent registered as active
heartbeat("CCW-1")
```

## 🔄 Typical Workflow

### CEO (Orchestrator) Perspective

```python
# 1. CEO receives project request
# 2. CEO breaks down into tasks
# 3. CEO sends task assignments

from send_message import send_message

# Assign PM task
send_message(
    from_agent="CEO",
    to_agent="CCW-PM",
    msg_type="task_assignment",
    content={"task": "Create PRD for user dashboard"},
    priority="high"
)

# Assign Designer task (parallel)
send_message(
    from_agent="CEO",
    to_agent="CCW-Designer",
    msg_type="task_assignment",
    content={"task": "Design UI mockups for dashboard"},
    priority="high"
)

# 4. CEO monitors completion reports
# 5. CEO coordinates next phase
```

### Worker Agent Perspective

```python
# 1. Worker checks for messages
from read_messages import read_messages
from move_message import move_message

messages = read_messages("CCW-PM", "inbox", filter_type="task_assignment")

if messages:
    msg = messages[0]

    # 2. Move to processing
    move_message(msg["id"], "inbox", "processing")

    # 3. Do the work...
    # (Agent completes the task)

    # 4. Send completion report
    send_message(
        from_agent="CCW-PM",
        to_agent="CEO",
        msg_type="completion_report",
        content={
            "task_id": msg["content"]["task"],
            "status": "completed",
            "output_file": "agents/project/pm/OUTPUT/prd.md"
        }
    )

    # 5. Move to completed
    move_message(msg["id"], "processing", "completed")
```

## 🧪 Testing

Run the complete system test:

```bash
python3 .claude/scripts/test_system.py
```

Expected output:
```
✅ SYSTEM TEST COMPLETE!

📊 Test Results:
   • Agents registered: 1
   • Messages sent: 2
   • Messages received: 1
   • Status: OPERATIONAL 🟢

🚀 Multi-Agent Orchestration System is READY!
```

## 🎯 Benefits

### 1. **Parallel Execution**
Multiple agents work simultaneously on independent tasks
- 56% faster than sequential execution
- PM + Marketer work together (30 min)
- Frontend + Backend work together (60 min)

### 2. **Clean Context Windows**
Each agent gets fresh context for their specific task
- No context pollution
- Focused expertise
- Clearer results

### 3. **Persistent State**
File-based messaging provides:
- Audit trail of all communications
- Recovery from failures
- Progress tracking
- Historical analysis

### 4. **Flexible Coordination**
- Synchronous or asynchronous communication
- Priority-based message handling
- Error recovery and retry
- Human-in-the-loop when needed

## 📊 Agent Roles Reference

Common agent roles in a typical project:

| Agent ID | Role | Responsibilities |
|----------|------|------------------|
| CEO | Orchestrator | Overall coordination, task delegation |
| CCW-PM | Product Manager | PRD, requirements, user stories |
| CCW-Marketer | Marketing | Brand guidelines, messaging |
| CCW-UX | UX Designer | User flows, wireframes |
| CCW-UI | UI Designer | Visual design, mockups |
| CCW-Architect | Software Architect | System design, architecture |
| CCW-DBA | Database Admin | Schema design, data modeling |
| CCW-Frontend | Frontend Dev | UI implementation |
| CCW-Backend | Backend Dev | API, business logic |
| CCW-CodeReview | Code Reviewer | Code quality checks |
| CCW-Security | Security Engineer | Security audits |
| CCW-QA | QA Engineer | Testing, validation |
| CCW-DevOps | DevOps Engineer | Deployment, infrastructure |

## 🔐 Security Notes

- Messages are stored as plain JSON files
- No encryption by default (local file system)
- Agent IDs should be unique and predictable
- Registry tracks all agent activity
- Message history provides audit trail

## 🚨 Error Handling

If a worker agent encounters a problem:

```python
# Send error report to CEO
send_message(
    from_agent="CCW-Frontend",
    to_agent="CEO",
    msg_type="error_report",
    content={
        "error": "Missing API endpoint specification",
        "task_id": "TASK-007",
        "needs_human_input": True
    },
    priority="urgent"
)

# Move message to failed
move_message(msg_id, "processing", "failed")
```

CEO can then:
1. Invoke `stuck` subagent for human input
2. Send clarification message
3. Reassign task
4. Adjust workflow

## 📝 Best Practices

1. **Always update heartbeat** - Let CEO know you're alive
2. **Move messages through stages** - Don't leave in inbox forever
3. **Use descriptive content** - Make messages self-documenting
4. **Set appropriate priorities** - Help CEO triage
5. **Send completion reports** - Close the loop
6. **Handle errors gracefully** - Use error_report messages
7. **Keep registry current** - Register/deregister properly

## 🔄 Integration with Existing System

This multi-agent system **complements** the existing subagent system:

- **Subagents (coder, tester, stuck)** - Built-in, same context, immediate
- **Worker Agents (CCW-*)** - External, parallel, message-based

Use **subagents** for:
- Quick iterations
- Testing implementations
- Human escalation

Use **worker agents** for:
- Parallel execution
- Specialized expertise
- Large-scale projects

## 📖 Next Steps

1. **Register worker agents** as you spawn them
2. **Create specialized agent prompts** for different roles
3. **Establish communication patterns** for your workflows
4. **Monitor message flow** through inbox/processing/completed
5. **Iterate and improve** based on actual usage

---

**Version**: 2.0
**Status**: Production Ready ✅
**Last Updated**: 2025-11-23

*Built for Claude Code Agents Wizard v2 - Parallel Agent Orchestration System*
