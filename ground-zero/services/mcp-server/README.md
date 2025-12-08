# Ground-Zero MCP Server

Model Context Protocol server for connecting Claude Desktop (Windows) to Ground-Zero orchestration system on DigitalOcean.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Windows PC                                             │
│  ┌──────────────────┐                                   │
│  │  Claude Desktop  │                                   │
│  │                  │                                   │
│  │  ┌────────────┐  │                                   │
│  │  │   MCP      │  │ <-- STDIO (Local)                │
│  │  │  Server    │  │                                   │
│  │  └─────┬──────┘  │                                   │
│  └────────┼─────────┘                                   │
│           │                                             │
│           │ HTTP via Headscale VPN                      │
│           │ (100.64.x.x)                                │
└───────────┼─────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│  DigitalOcean Droplet                                   │
│  ┌────────────────────────────────────────────┐         │
│  │  n8n Webhooks (Port 5678)                  │         │
│  │  └─→ PostgreSQL Queue                      │         │
│  │      └─→ Agent Zero Task Processor         │         │
│  └────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Installation (Windows)

### Prerequisites

1. **Node.js 18+** ([Download](https://nodejs.org/))
2. **Claude Desktop** ([Download](https://claude.ai/download))
3. **Headscale VPN** configured and connected to DigitalOcean droplet

### Step 1: Install Dependencies

```powershell
# Navigate to MCP server directory
cd ground-zero\services\mcp-server

# Install Node.js dependencies
npm install
```

### Step 2: Configure Environment

```powershell
# Copy environment template
copy .env.example .env

# Edit .env with your DigitalOcean VPN IP
notepad .env
```

Update `DIGITALOCEAN_HOST` with your Headscale VPN IP:

```env
DIGITALOCEAN_HOST=http://100.64.0.2  # Replace with actual VPN IP
N8N_WEBHOOK_BASE=http://100.64.0.2:5678/webhook
```

To find your VPN IP:
```powershell
# On Windows (with Tailscale/Headscale)
tailscale status

# Look for your droplet's IP (e.g., 100.64.0.2)
```

### Step 3: Configure Claude Desktop

Edit Claude Desktop config file:

**Location:** `%APPDATA%\Claude\claude_desktop_config.json`

Add MCP server configuration:

```json
{
  "mcpServers": {
    "groundzero": {
      "command": "node",
      "args": [
        "C:\\path\\to\\ground-zero\\services\\mcp-server\\index.js"
      ],
      "env": {
        "DIGITALOCEAN_HOST": "http://100.64.0.2",
        "N8N_WEBHOOK_BASE": "http://100.64.0.2:5678/webhook"
      }
    }
  }
}
```

**Important:** Replace `C:\\path\\to\\` with actual path (use double backslashes).

### Step 4: Restart Claude Desktop

1. Quit Claude Desktop completely
2. Start Claude Desktop again
3. MCP server will auto-start on STDIO

### Step 5: Test Connection

In Claude Desktop, try:

```
Use the enqueue_task tool to send a test task with type "simple_computation" and payload {"operation": "add", "args": [1, 2, 3]}.
```

Expected response:
```json
{
  "success": true,
  "task_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "enqueued",
  "message": "Task enqueued successfully"
}
```

## 🛠️ Available Tools

### 1. `enqueue_task`

Enqueue a new task to Ground-Zero queue.

**Arguments:**
- `task_type` (string, required): Task type
  - `"llm_reasoning"`: Use Ollama LLM
  - `"code_execution"`: Run code (requires E2B integration)
  - `"simple_computation"`: Math operations
  - `"external_api_call"`: HTTP requests
- `payload` (object, required): Task-specific parameters
- `priority` (number, optional): 1-10 (1=highest, default=5)

**Example:**
```json
{
  "task_type": "llm_reasoning",
  "payload": {
    "prompt": "Explain quantum computing in simple terms",
    "model": "llama2",
    "temperature": 0.7
  },
  "priority": 5
}
```

**Returns:**
```json
{
  "success": true,
  "task_id": "uuid-here",
  "status": "enqueued",
  "message": "Task enqueued successfully"
}
```

### 2. `get_task_status`

Get detailed status of a task.

**Arguments:**
- `task_id` (string, required): UUID from `enqueue_task`

**Example:**
```json
{
  "task_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Returns:**
```json
{
  "success": true,
  "task": {
    "task_id": "123e4567-e89b-12d3-a456-426614174000",
    "task_type": "llm_reasoning",
    "status": "completed",
    "result": {
      "llm_response": "Quantum computing uses quantum bits...",
      "duration_ms": 1234
    },
    "created_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:30:05Z"
  }
}
```

### 3. `list_tasks`

List tasks filtered by status.

**Arguments:**
- `status` (string, optional): Filter by status
  - `"pending"`, `"in_progress"`, `"completed"`, `"failed"`, `"retrying"`
- `limit` (number, optional): Max results (1-100, default=10)

**Example:**
```json
{
  "status": "completed",
  "limit": 5
}
```

**Returns:**
```json
{
  "success": true,
  "count": 5,
  "tasks": [
    {
      "task_id": "...",
      "task_type": "llm_reasoning",
      "status": "completed",
      "created_at": "..."
    }
  ]
}
```

### 4. `get_queue_stats`

Get queue statistics.

**Arguments:** None

**Returns:**
```json
{
  "success": true,
  "stats": {
    "pending": 5,
    "in_progress": 2,
    "completed": 123,
    "failed": 3,
    "avg_processing_time_seconds": 2.5
  }
}
```

### 5. `cancel_task`

Cancel a pending task.

**Arguments:**
- `task_id` (string, required): UUID of task to cancel

**Example:**
```json
{
  "task_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Returns:**
```json
{
  "success": true,
  "message": "Task cancelled successfully"
}
```

## 🔧 Troubleshooting

### Error: "Network error: Unable to reach DigitalOcean droplet"

**Cause:** VPN not connected or incorrect IP

**Solution:**
1. Check VPN connection:
   ```powershell
   tailscale status
   ```
2. Verify droplet IP in `.env` matches VPN IP
3. Ping droplet:
   ```powershell
   ping 100.64.0.2
   ```

### Error: "HTTP 404: Not Found"

**Cause:** n8n webhooks not set up

**Solution:**
1. Access n8n: `http://100.64.0.2:5678`
2. Import workflows from `ground-zero/services/n8n-workflows/`
3. Activate "Ground-Zero Orchestrator" workflow

### MCP Server Not Showing in Claude Desktop

**Cause:** Invalid config path or syntax error

**Solution:**
1. Check `claude_desktop_config.json` syntax (use JSON validator)
2. Verify paths use double backslashes: `C:\\Users\\...`
3. Check Claude Desktop logs:
   ```powershell
   # Logs location
   %APPDATA%\Claude\logs\
   ```

### Tasks Stay in "pending" Status

**Cause:** Agent Zero not running on droplet

**Solution:**
1. SSH to droplet
2. Check Agent Zero logs:
   ```bash
   cd ~/ground-zero
   make logs-agent
   ```
3. Restart if needed:
   ```bash
   make restart
   ```

## 📊 Development

### Run in Development Mode

```powershell
# Watch mode (auto-restart on file changes)
npm run dev
```

### Test Manually (Without Claude Desktop)

```powershell
# Start server
node index.js

# In another terminal, pipe JSON input
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_queue_stats","arguments":{}},"id":1}' | node index.js
```

## 🔐 Security Notes

- ✅ VPN-only communication (Headscale encrypts traffic)
- ✅ No API keys needed (VPN provides auth)
- ✅ Localhost-only ports on droplet
- ⚠️ Keep `.env` out of version control

## 📄 Related Documentation

- **Main README:** `../../README.md`
- **Deployment Guide:** `../../infrastructure/scripts/deploy-digitalocean.sh`
- **n8n Workflows:** `../n8n-workflows/`

## 🤝 Support

See main Ground-Zero documentation at project root.
